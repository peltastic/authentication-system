export default {
	port: process.env.PORT,
	dbUri: process.env.DB_URI,
	saltWorkFactor: Number(process.env.SALT_WORK_FACTOR),
	accessTokenLT: process.env.ACCESS_TOKEN_LT,
	refreshTokenLT: process.env.REFRESH_TOKEN_LT,
	privateKey: process.env.PRIVATE_KEY,
	publicKey: process.env.PUBLIC_KEY,
	sendgridKey: process.env.SENDGRID_API_KEY,
	emailSender: process.env.EMAIL_SENDER,
};
