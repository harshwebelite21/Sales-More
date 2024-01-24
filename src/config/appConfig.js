require("dotenv").config();

exports.appConfig = {
  mongodbConnectionString: process.env.MONGODB_CONNNECTION_LINK,
  port: process.env.PORT || 3000,
  jwtKey: process.env.SECRETKEY,
};
