const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./src/config/config.json");
const errorController = require("./src/utils/errorHandlers/errorController");
const routes = require("./src/routes/routes");
const DBConnection = require("./src/database/dbConnection");
const bodyParser = require("body-parser");

//environment variables
dotenv.config({ path: "./.env" });
const server = http.createServer(app);

app.use(express.json());

// to check the server status (if crashed!)
app.options("/check-server", cors());
app.get("/check-server", cors(), (req, res) => {
  res.send("Server up and running! hurray 😊.......");
});

app.use(
  cors({
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    origin: "*",
  })
);

app.use(bodyParser.json());

// routes
app.use("/api", routes);

// creating DB Connection
DBConnection.init();

//global error controller to handle the error
app.use(errorController);

server.listen(config.PORT, () => {
  console.log(`listening on *:${config.PORT}`);
});
