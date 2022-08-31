const Redis = require('redis')
// const redisClient = Redis.createClient() //local

const redisClient = Redis.createClient({
    socket: {
        host: '10.229.240.73',
        port: '6379'
    }
    //remove the object to run localy

});

redisClient.connect()



async function insertInCacheAndReturnData (expiration, data, key) {
    try {
        await redisClient.setEx(key, expiration, JSON.stringify(data))
    } catch (error) {
        return res.send(error)
    }
}

module.exports = {redisClient, insertInCacheAndReturnData}