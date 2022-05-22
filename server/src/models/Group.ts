import { Table, Column, Model, HasMany, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import User from './User';
import Issue from './Issue';
import TeamSession from './TeamSession';

@Table
class Group extends Model {
  @HasMany(() => Issue)
  issues: Issue[];

  @HasMany(() => User)
  users: User[];

  @ForeignKey(() => TeamSession)
  @Column
  teamSessionId: number;

  @BelongsTo(() => TeamSession)
  teamSession: TeamSession
}

export default Group;
