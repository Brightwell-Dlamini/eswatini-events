import { createClient } from 'redis';

const redis = createClient({
    username: 'default',
    password: 'HEc6TE2GHT5SnEKuMT1evbGo4QRt9Trg',
    socket: {
        host: 'redis-17967.c341.af-south-1-1.ec2.redns.redis-cloud.com',
        port: 17967
    }
});
redis.on('error', (err) => console.error('Redis Error:', err));
redis.connect();

export { redis };