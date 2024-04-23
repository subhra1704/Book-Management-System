const mongoose = require("mongoose");
let db = mongoose.connection;
const config = require("../config/config.json");
const DBConnection = config.DATABASE_URL;

function init() {
  return new Promise((resolve, reject) => {
    mongoose.set("strictQuery", false);
    mongoose.connect(DBConnection, {
      autoIndex: true,
    });
    db.on("error", (err) => {
      console.log(`Connection with mongodb failed- ${err}`);
      return reject(err);
    });
    db.once("open", () => {
      console.log("Connection with mongodb successfully established.");
      return resolve();
    });
    db.on("disconnected", function () {
      console.log("Disconnected from mongodb");
    });
    db.on("connected", function () {
      console.log("Connection to mongodb ok");
      console.log(`Trying to connect to mongodb successfully`);
    });
  });
}

module.exports = {
  init: init,
};
