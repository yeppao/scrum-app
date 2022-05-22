
import Issue from '@@app/models/Issue';
import User from '@@app/models/User';
import Group from '@@models/Group';
import TeamSession from '@@models/TeamSession';
import _ from 'lodash';

const distributeIssuesToGroups = async (issues, groups) => {
    const sortedIssues = _.sortBy(issues, issue => issue.fields['customfield_10026']);
    let availableStoryPoints = sortedIssues.reduce((acc, issue) => acc + issue.fields['customfield_10026'], 0);
    while (sortedIssues.length) {
        let tiniestGroup: Group = new Group();
        for (const group of groups) {
            const groupIssues = await group.$get('issues');
            const tiniestGroupIssues = tiniestGroup.id !== null ? await tiniestGroup?.$get('issues') : [];
            tiniestGroup = (tiniestGroup.id === null || groupIssues.length <= tiniestGroupIssues.length) ? group : tiniestGroup;
        }

        const selectedIssue = sortedIssues.shift();
        await selectedIssue.$set('group', tiniestGroup);
        availableStoryPoints = availableStoryPoints - selectedIssue.fields['customfield_10026'];
    }

    return groups;
}

export const splitUsersBySkill = (users: User[]) => {
    const splittedUsers: { front: User[], back: User[] } = { front: [], back: [] };

    users.forEach(user => {
        // @todo : create a specific split for superskilled (based on percent)
        if (user.skills.includes('front')) {
            if (_.isEqual(user.skills, ['front', 'back']) && splittedUsers.back.length < splittedUsers.front.length) {
                return splittedUsers.back.push(user);
            }

            return splittedUsers.front.push(user);
        }

        if (user.skills.includes('back')) return splittedUsers.back.push(user);
    });
    return splittedUsers;
}

export const createTeamSessionGroups = async (teamSessionId, groupsNumber) => {
    const groups: Group[] = [];
    const teamSession = await TeamSession.findOne({ where: { id: teamSessionId } });
    let users = await User.findAll();
    const issues = await Issue.findAll();
    const splittenUsers = splitUsersBySkill(users);
    const numberOfUsersPerGroup = Math.ceil(users.length / groupsNumber);
    const backPerGroup = splittenUsers.back.length / groupsNumber >= 1 ?
        Math.floor(splittenUsers.back.length / groupsNumber)
        : Math.ceil(splittenUsers.back.length / groupsNumber);
    const frontPerGroup = splittenUsers.front.length / groupsNumber >= 1 ?
        Math.floor(splittenUsers.front.length / groupsNumber)
        : Math.ceil(splittenUsers.front.length / groupsNumber);

    while (users.length) {
        const members: User[] = [
            ...splittenUsers.back.splice(0, backPerGroup),
            ...splittenUsers.front.splice(0, frontPerGroup)
        ];

        users = _.pullAllWith(users, members, _.isEqual);
        if (users.length === 1 && groups.length + 1 === groupsNumber) {
            const lastUser = users.shift();
            if (lastUser) members.push(lastUser);
        };

        console.log(users, users.length);
        const group = new Group();
        await group.save();
        await group.$set('users', members);
        for (const member of members) await member.$set('group', group);
        groups.push(group);
    }

    await teamSession?.$set('groups', groups);
    const finalGroups = await distributeIssuesToGroups(issues, groups);

    return await Promise.all(finalGroups.map(async finalGroup => ({
        ...finalGroup.get({ plain: true }),
        issues: await finalGroup.$get('issues'),
        users: await finalGroup.$get('users')
    })));
}


export const getGroup = async (groupId) => {
    const group = await Group.findOne({ where: { id: groupId }});
    return group;
};
