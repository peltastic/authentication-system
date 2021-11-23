import dotenv from "dotenv";
dotenv.config();
import "./db/connect";
import express from "express";
import config from "config";
import cors from "cors";
import { Router } from "express";
import log from "./logger";
import route from "./routes";

const routeHandler = route(Router());
const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api/v1",routeHandler);

app.listen(port, host, () => {
  const hr = new Date().getHours();
  const mins = new Date().getMinutes();
  console.table({
    port,
    host,
    time: `${hr}:${mins}`,
  });
  log.info(`server is up on http://${host}/${port}`);
});
