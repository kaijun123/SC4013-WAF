import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDb } from "./db";
import router from "./routes";
dotenv.config();

const port = process.env.PORT || 3000;
// const dbUrl = process.env.MONGO_URI || ""
const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME || ""
const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || ""
const dbUrl = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/`

  ;
(async () => {
  console.log()
  await connectToDb(dbUrl)

  const app = express();
  app.use(cors())
  app.use(express.json())
  app.use(router)

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})().catch((e) => console.error(e))
