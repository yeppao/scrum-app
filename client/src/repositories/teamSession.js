import axios from '@utils/axios';

export const createTeamSession = async (teamSession, issues) => {
  const outputTeamSession = await axios.post(`/teamsession`, {
    teamSession,
    issues
  });

  return outputTeamSession.data;
}
