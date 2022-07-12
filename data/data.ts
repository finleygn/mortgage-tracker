import { Database, SQLite3Connector, Relationships } from 'https://deno.land/x/denodb/mod.ts';
import envConfig from '../config.ts';
import Frame from './models/Frame.ts';
import Mortgage from './models/Mortgage.ts';
import Session from './models/Session.ts';

const connection = new SQLite3Connector({
  filepath: envConfig.database
});

const db = new Database(connection);

Relationships.belongsTo(Frame, Mortgage);

db.link([
  Frame,
  Mortgage,
  Session
]);

await db.sync({ drop: false });

export {
  Frame,
  Mortgage,
  Session
};