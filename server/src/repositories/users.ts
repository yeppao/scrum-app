import models from '@@models/index';

const { User } = models;

export const addUser = async (userData) => {
  const user = await User.create(userData);
  return user;
}


export const getUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  return user;
}

export const getUsers = async () => {
  const users = await User.findAll();
  return users;
}

export const deleteUser = async (userId) => {
  const user = await getUser(userId);
  user?.destroy();
  return user;
}
