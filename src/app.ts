import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import cors from "cors";
import config from "config";
import express, { Request, Response, NextFunction } from "express";
import rootFiles from "./routes/index";
import connect from "./database/connect";
import logger from "./utils/logger";
import deserializer from "./middlewares/DeserialiseUser";
import { ErrorHandler } from "./middlewares/ErrorHandler";
import { NotFoundError } from "../lib/appErrors";

const router = express.Router();
const rootRouter = rootFiles(router);

const app = express();

/**
 * Middlewares go here for the application.
 * if it gets to cumbersome then we can move to seperate file
 *
 */
app.use(express.json()); //for parsing application/json
app.use(express.urlencoded({ extended: false })); //for parsing application/x-www-form-urlencoded
app.use(cors());
app.use(deserializer);

//  defining the port
const port = config.get<number>("port");
app.get("/status", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		message: "Server is up and running",
	});
});
app.use("/api/v1", rootRouter);

// if route is not handled to the point, return a 404 error
app.use((req: Request, res: Response, next: NextFunction) => {
	next(new NotFoundError());
});

// handle Errors Centrally in the error Middleware
app.use(ErrorHandler);

app.listen(port, async () => {
	logger.info(`server is up on port  ${port}`);
	await connect();
});
