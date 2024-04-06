// ENVIROMENT VARIABLES CONFIG
// import * as dotenv from "dotenv";

// dotenv.config();

// DATABASES CONNECTIONS
import redis from "./db/redis.client.js";

import  "./db/mongodb.js";

// REQUIRE MODULES
import express from "express";

import cors from "cors";
import mountRoutes  from "./helpers/mountRoutes.js";

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
