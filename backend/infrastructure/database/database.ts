import { Pool } from "pg";
import { settings } from "../frameworks/settings";

export const pool = new Pool({
  host: settings.database.host,
  port: settings.database.port,
  database: settings.database.name,
  user: settings.database.user,
  password: settings.database.pass,
});
