// ENVIROMENT VARIABLES CONFIG
require("dotenv").config();

// REQUIRE MODULES
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// INSTEAD APP
const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "DELETE", "PATCH", "HEAD"],
  })
);

// MOUNT ROUTERS

const routes = (() => {
  const routesPath = path.resolve(path.join(__dirname, "./routes"));

  const routes = fs.readdirSync(routesPath);

  return routes.map((str) => str.replace(".js", ""));
})();

routes.forEach((path) => {
  const router = require(`./routes/${path}`);

  app.use(`/api/${path}`, router);
});

// LISTEN APPLICATION

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
