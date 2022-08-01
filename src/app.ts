require("dotenv").config();
import express from "express";
import config from "config";
import connectDB from "./utils/connectDB";
import log from "./utils/logger";
import router from "./routes"

const app = express();

app.use(express.json())
app.use(router)

const port = config.get("port");

app.listen(port, () => {
  log.info("App Started at " + port);
  connectDB();
});
