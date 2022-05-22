import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import Group from './Group';
import TeamSession from './TeamSession';

@Table
class Issue extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: false,
  })
  key: string;

  @Column
  summary: string;

  @Column(DataType.JSONB)
  fields: Object;

  @HasMany(() => Issue)
  subtasks: Issue[];

  @ForeignKey(() => Issue)
  @Column
  parentId: string;

  @BelongsTo(() => Issue)
  parent: Issue;

  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => TeamSession)
  @Column
  teamSessionId: number;

  @BelongsTo(() => TeamSession)
  teamSession: TeamSession;
}

export default Issue;
