import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

(async () => {
  const app: Express = express();

  app.use(cors())
  app.use(express.json())

  const port = process.env.PORT || 3000;

  app.get("/healthz", (req: Request, res: Response) => {
    res.status(200).send("Healthy");
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})()
