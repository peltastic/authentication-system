import logger from "pino";

const log = logger({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			timestampKey: "time",
			translateTime: true,
		},
	},
});

export default log;
