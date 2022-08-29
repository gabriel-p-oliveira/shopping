const Redis = require('redis')
const redisClient = Redis.createClient()
redisClient.connect()

async function insertInCacheAndReturnData (expiration, data, key) {
    try {
        await redisClient.setEx(key, expiration, JSON.stringify(data))
    } catch (error) {
        return res.send(error)
    }
}

module.exports = {redisClient, insertInCacheAndReturnData}