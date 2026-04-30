const redisClient = require('../config/redis');

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (data) return JSON.parse(data);
    return null;
  } catch (error) {
    console.error('Redis Get Error:', error);
    return null;
  }
};

const setCache = async (key, data, ttlInSeconds = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: ttlInSeconds
    });
  } catch (error) {
    console.error('Redis Set Error:', error);
  }
};

const deleteCache = async (keyPattern) => {
  try {
    // If the key doesn't have wildcard, just delete it
    if (!keyPattern.includes('*')) {
      await redisClient.del(keyPattern);
      return;
    }
    
    // For wildcard, we need to find keys first using scan
    let cursor = 0;
    do {
      const result = await redisClient.scan(cursor, {
        MATCH: keyPattern,
        COUNT: 100
      });
      cursor = result.cursor;
      const keys = result.keys;
      
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } while (cursor !== 0);
    
  } catch (error) {
    console.error('Redis Delete Error:', error);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache
};
