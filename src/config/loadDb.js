const { default: mongoose } = require("mongoose");
const { appConfig } = require("./appConfig");

exports.startServer = () => {
  // Handling connection events

  mongoose
    .connect(appConfig.mongodbConnectionString)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((error) => {
      console.error(`MongoDB connection error: ${error}`);
    });
};
