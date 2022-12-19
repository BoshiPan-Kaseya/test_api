const redis = require("redis");

const rediscl = redis.createClient();

module.exports = rediscl;