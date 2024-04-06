import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_CLIENT_URI || "redis://127.0.0.1:6379/0",
});

client.on("error", (error) => {
  console.log("Redis Client Error", error);
});

export default client;
