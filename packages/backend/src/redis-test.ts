import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'HEc6TE2GHT5SnEKuMT1evbGo4QRt9Trg',
    socket: {
        host: 'redis-17967.c341.af-south-1-1.ec2.redns.redis-cloud.com',
        port: 17967
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    await client.connect();
    const session = await client.get('session:688d5ff8b6e78cb5d1f6435e'); // Replace with user.id from register
    console.log('Session Token:', session);
    await client.disconnect();
})();