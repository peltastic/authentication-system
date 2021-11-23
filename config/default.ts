export default {
  port: process.env.PORT,
  host: process.env.HOST,
  dbUri: process.env.DBURI,
  saltWorkFactor: process.env.SALT,
  accessTokenTtl: process.env.ACCESSTOKEN,
  refreshTokenTtl: process.env.REFRESHTOKEN,
  privateKey: process.env.JWT_TOKEN
};
