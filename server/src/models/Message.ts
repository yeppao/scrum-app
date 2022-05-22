import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import Room from './Room';
import User from './User';

@Table
class Message extends Model {
  @Column(DataType.TEXT)
  content: string;

  @ForeignKey(() => User)
  @Column
  senderId: string;

  @BelongsTo(() => User)
  sender: User;

  @ForeignKey(() => Room)
  @Column
  roomId: string;

  @BelongsTo(() => Room)
  room: Room
}

export default Message;
