import express from 'express';
import _ from 'lodash';
import jira from '@@config/jira';
import { createTeamSessionGroups, getGroup } from '@@app/repositories/groups';
import { createTeamSession } from '@@app/repositories/teamSession';
import Group from '@@app/models/Group';

const router = express.Router();

router.get(
  '/projects',
  async (req, res) => {
    const projects = await jira.listProjects();
    res.json(projects);
  }
);

router.get(
  '/groups/:groupId',
  async (req, res) => {
    const { groupId } = req.params;
    const group = await getGroup(groupId);
    const groupData = {
      ...group?.get({ plain: true }),
      issues: await group?.$get('issues'),
      users: await group?.$get('users')

    }
    res.json(groupData);
  }
);

router.get(
  '/sprints/:projectKey',
  async (req, res) => {
    let existingSprints = [];
    const { projectKey } = req.params;
    const boards = await jira.getAllBoards(null, null, null, null, projectKey);
    for (const board of boards.values) {
      if (board.type !== 'scrum') continue;
      const sprints = await jira.getAllSprints(board.id);
      existingSprints = _.unionWith(existingSprints, sprints.values, _.isEqual);
    }
    res.json(existingSprints);
  }
);

router.get(
  '/sprint/:sprintId',
  async (req, res) => {
    const { sprintId } = req.params;
    const currentSprint = await jira.getSprint(sprintId);

    res.json(currentSprint);
  }
)

router.get(
  '/issues/:boardId/:sprintId',
  async (req, res) => {
    const { boardId, sprintId } = req.params;
    const issuesData = await jira.getBoardIssuesForSprint(boardId, sprintId);
    res.json(issuesData);
  }
);

router.get(
  '/epics/:boardId',
  async (req, res) => {
    const { boardId } = req.params;
    const epicsData = await jira.getEpics(boardId, 0, 50, 'false');
    console.log(epicsData);
    res.json(epicsData);
  }
)

router.post(
  '/teamsession',
  async (req, res) => {
    const teamSession = await createTeamSession(req.body);
    res.json(teamSession);
  }
)

router.post(
  '/groups/:teamSessionId',
  async (req, res) => {
    const { teamSessionId } = req.params;
    const { groupsNumber } = req.body;
    const groups = await createTeamSessionGroups(teamSessionId, groupsNumber);
    res.json(groups);
  }
)

router.get(
  '/users',
  async (req, res) => {
    const users = await jira.getUsers();

    res.json(users);
  }
)

export default router;
