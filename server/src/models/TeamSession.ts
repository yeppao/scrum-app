import { Table, Column, Model, DataType, HasMany, IsUUID, Default } from 'sequelize-typescript';
import Group from './Group';
import Issue from './Issue';

@Table
class TeamSession extends Model {
  @Column
  projectKey: string;

  @Column
  boardId: Number;

  @Column
  sprintId: Number;

  @Column
  currentStep: Number;

  @HasMany(() => Group)
  groups: Group[];

  @HasMany(() => Issue)
  issues: Issue[];

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  adminUuid: string;

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  participationUuid: string;
}

export default TeamSession;
