import { Table, Column, Model, BelongsTo, ForeignKey, BelongsToMany, DataType } from 'sequelize-typescript';
import Group from './Group';
import Room from './Room';
import UserRoom from './UserRoom';

@Table
class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: false
  })
  id: string;

  @Column
  peerId: string;

  @Column
  name: string;

  @Column(DataType.ARRAY(DataType.STRING))
  skills: string[];

  @BelongsToMany(() => Room, () => UserRoom)
  rooms: Room[];

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;
}

export default User;
