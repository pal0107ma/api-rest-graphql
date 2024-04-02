// ENVIROMENT VARIABLES CONFIG
require("dotenv").config();

// DATABASES CONNECTIONS
const redis = require("./db/redis.client");

require("./db/mongodb");

// REQUIRE MODULES
const express = require("express");

const cors = require("cors");

const { mountRoutes } = require("./helpers");

async function main() {
  // REDIS CONNECTION
  await redis.connect();

  console.log("redis client connection success");

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

  mountRoutes(app);

  // LISTEN APPLICATION

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

main();
