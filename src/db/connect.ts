import mongoose, { ConnectOptions } from "mongoose";
import config from "config";
import log from "./../logger/";

const dbUri = config.get("dbUri") as string
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions).then((data)=> {
    log.info("Database connected successfully", data)
}).catch((err)=> {
    log.error("failed to connect to datase", err)
    process.exit(1);
})