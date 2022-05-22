import axios from '@utils/axios';

export const getProjects = async () => {
  const projects = await axios.get('/projects');

  return projects.data;
};

export const getSprints = async (projectKey) => {
  const sprints = await axios.get(`/sprints/${projectKey}`);

  return sprints.data;
}

export const getSprint = async (sprintId) => {
  const sprint = await axios.get(`/sprint/${sprintId}`);

  return sprint.data;
}

export const getSprintIssues = async (boardId, sprintId) => {
  const issues = await axios.get(`/issues/${boardId}/${sprintId}`);

  return issues.data.issues;
}

export const getEpics = async (boardId) => {
  const epics = await axios.get(`/epics/${boardId}`);

  return epics.data.values;
}
