import dotenv from "dotenv";
dotenv.config();

export default {
  port: 3000,
  logLevel: "info",
  dbUri: process.env.DB_URI,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    secure: true,
  },
};

