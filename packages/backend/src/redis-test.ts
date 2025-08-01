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
    await client.set('foo', 'bar');
    const result = await client.get('foo');
    console.log('Redis Value:', result);
    await client.del('foo');
    console.log('Test key deleted');
    await client.disconnect();
})();