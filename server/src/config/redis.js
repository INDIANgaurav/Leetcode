const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-19209.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 19209,
  },
});

module.exports = redisClient;
