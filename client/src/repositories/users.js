import axios from '@utils/axios';

export const getJiraUsers = async () => {
  const users = await axios.get(`/users`);

  return users.data;
}
