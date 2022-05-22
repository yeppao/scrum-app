import { Sequelize } from 'sequelize-typescript';
import models from '@@models/index';
import UserRoom from '@@app/models/UserRoom';

const {
  Group,
  Issue,
  Message,
  Room,
  TeamSession,
  User
} = models;

const sequelizeDbUri = process.env.SEQUELIZE_DB_URI ?? '';

const initSequelize = async () => {
  const sequelize = new Sequelize(sequelizeDbUri, {
    models: [
      Group,
      Issue,
      Message,
      Room,
      TeamSession,
      User,
      UserRoom
    ]
  });

  await sequelize.authenticate();
  await sequelize.sync();
  // let schemas: any[] = await sequelize.showAllSchemas({});

  return sequelize;
}

export default initSequelize;
