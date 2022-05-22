import TeamSession from "@@app/models/TeamSession";
import Issue from "@@app/models/Issue";

export const createTeamSession = async (data) => {
    const teamSessionIssues: Issue[] = [];
    const teamSession = new TeamSession(data.teamSession);
    await teamSession.save();

    for (const issueData of data.issues) {
        const issue = new Issue(issueData);
        await issue.save();
        teamSessionIssues.push(issue);
    }

    await teamSession.$set('issues', teamSessionIssues);
    return teamSession;
}
