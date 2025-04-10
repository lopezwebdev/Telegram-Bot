import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Reminder } from "../entities/Reminder";
import { Note } from "../entities/Note";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [Reminder, Note],
  migrations: [],
  subscribers: [],
});