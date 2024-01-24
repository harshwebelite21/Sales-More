const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const router = require("./routes/indexRouter");
const { startServer } = require("./config/loadDb");
const { appConfig } = require("./config/appConfig");

// For use the body parser
app.use(express.json(), bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Handle Routing
app.use(router);
// Database connection

startServer();

//  Start server after checking connection
app.listen(appConfig.port, () => {
  console.log("server is running on port " + appConfig.port);
});
