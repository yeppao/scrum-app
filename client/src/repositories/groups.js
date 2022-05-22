import axios from '@utils/axios';

export const createTeamSessionGroups = async (teamSessionId, groupsNumber) => {
  const groups = await axios.post(`/groups/${teamSessionId}`, {
    groupsNumber
  });

  return groups.data;
};


export const getGroup = async (groupId) => {
  const group = await axios.get(`/groups/${groupId}`);

  return group.data;
}
