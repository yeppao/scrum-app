import models from '@@models/index';
import { getUser } from '@@repositories/users';

const { Room, User } = models;

export const defaultRoomName = 'default';

export const createRoom = async (roomId, creatorId, participants) => {
  const users = participants.map(async participant => await getUser(participant.id === participant));

  const room = await Room.create({
    id: roomId,
    creator: users.find(user => user.id === creatorId),
    participants: users
  });

  return room;
}

export const getRoom = async (roomId) => {
  const room = await Room.findOne({ where: { id: roomId }});
  return room;
}
