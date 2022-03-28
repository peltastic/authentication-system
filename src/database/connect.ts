import mongoose from "mongoose";
import config from "config";
import logger from "../utils/logger"

async function connect() {
	const dbUri:string = config.get<string>("dbUri");

	try {
		await mongoose.connect(dbUri);
		logger.info("connected successfully to database");
	} catch (err) {
		logger.error("Failed connection to database");
		process.exit(1);
	}
}

export default connect;
