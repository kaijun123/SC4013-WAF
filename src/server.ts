import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./routes";
import config from "./setup";
dotenv.config();

const port = process.env.PORT || 3000;

  ;
(async () => {
  config.__configure("./config")

  const app = express();
  app.use(cors())
  app.use(express.json())
  app.use(router)

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})().catch((e) => console.error(e))
