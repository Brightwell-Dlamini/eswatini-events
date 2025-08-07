import { createClient } from 'redis';

const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

// Handle connection errors
redis.on('error', (err) => console.error('Redis Client Error:', err));

// Connect only if not already connected
async function connectRedis() {
  if (!redis.isOpen) {
    try {
      await redis.connect();
      console.log('Connected to Redis');
    } catch (err) {
      console.error('Redis connection failed:', err);
    }
  }
}
export async function safeRedisGet(key: string) {
  try {
    if (!redis.isOpen) await redis.connect();
    return await redis.get(key);
  } catch (err) {
    console.error('Redis get error:', err);
    return null;
  }
}

export async function safeRedisSetEx(key: string, seconds: number, value: string) {
  try {
    if (!redis.isOpen) await redis.connect();
    return await redis.setEx(key, seconds, value);
  } catch (err) {
    console.error('Redis setEx error:', err);
    return null;
  }
}

// Initialize the connection when this module is imported
connectRedis();

export { redis };