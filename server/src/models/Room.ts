import { Table, Column, Model, DataType, BelongsTo, HasMany, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import Message from './Message';
import User from './User';
import UserRoom from './UserRoom';

@Table
class Room extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: false
  })
  id: string;

  @BelongsToMany(() => User, () => UserRoom)
  participants: User[];

  @HasMany(() => Message)
  messages: Message[];

  @ForeignKey(() => User)
  @Column
  creatorId: string;

  @BelongsTo(() => User)
  creator: User;
}

export default Room;
