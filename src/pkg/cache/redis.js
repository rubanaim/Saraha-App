import Redis from 'ioredis';
 export class RedisCacheProvider{
     client;

     //setup config - general
     constructor(config) {
         this.client = new Redis({
             host: config.host,
             port: config.port,
             password: config.password,
             lazyConnect: true, //wait until the server and redis establish there connection
             maxLoadingRetryTime: 3 //try three times to load the redis > may be the server needs time to start
         });
         //error in cache server
         this.client.on('error', (err)=>console.log('redis server error', err.message));
         //error on connection
         this.client.connect().catch(err=>console.log('fail to connect to redis', err.message)); // connect to localhost : 6379
         //.catch() when my redis fail we catch the err otherwise my server will stop
     }
     async set(key, value , ttl){
        return this.client.set(key, value, 'EX' , ttl);
     }
     async get(key){
       return this.client.get(key);
     }
     async del(key){
       return this.client.del(key);
     }
     // Increment a key's value by 1
     async incr(key) {
         return this.client.incr(key);
     }
     // Set expiration time for a key
     async expire(key, seconds) {
         return this.client.expire(key, seconds);
     }
 }