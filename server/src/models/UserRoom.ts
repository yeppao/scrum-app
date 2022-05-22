import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import Room from './Room';
import User from './User';

@Table
class UserRoom extends Model {
    @ForeignKey(() => User)
    @Column
    user: string

    @ForeignKey(() => Room)
    @Column
    room: number
}

export default UserRoom;
