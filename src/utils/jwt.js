const jwt = require("jsonwebtoken");
const { appConfig } = require("../config/appConfig");

exports.generateJwtToken = (payload, options) => {
  try {
    return jwt.sign(payload, appConfig.jwtKey, options);
  } catch (err) {
    console.log("Error while generating token", err);
    throw err;
  }
};

exports.verifyJwtToken = (cookieToken) => {
  try {
    jwt.verify(cookieToken, appConfig.jwtKey);
  } catch (err) {
    console.error("Error while verifying token:", err);
    return res.status(401).json({ err: "Invalid JWT token." });
  }
};

exports.decodeJwtToken = (cookieToken) => {
  const { userId } = jwt.decode(cookieToken, appConfig.jwtKey);
  return userId;
};
