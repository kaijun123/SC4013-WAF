import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

(async () => {
  const app: Express = express();

  // var corsOptions = {
  //   origin: 'http://localhost:3000',
  //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  // }
  // app.use(cors(corsOptions))

  app.use(cors())
  app.use(express.json())

  const port = process.env.PORT || 3001;

  const mongoURI = process.env.MONGO_URI || ""
  console.log("[mongoURI]: ", mongoURI)

  app.get("/healthz", (req: Request, res: Response) => {
    res.status(200).send("Healthy");
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})()
