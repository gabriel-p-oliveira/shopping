const redis = require('../redis')

const returnCache = async (req, res, next) => {
    try {
        const slow = req.query.slow?req.query.slow: req.body.slow;
     

        let cacheKey =  req.originalUrl
        const cacheResponse = await redis.get(cacheKey)
        const response =JSON.parse(cacheResponse)
        if(cacheResponse){
            if (slow) {
                setTimeout(() => {
                    return res.send(response)
                }, slow * 1000);
            }
            
            return res.send(response)
        }else{
            console.log('call next to get cache...')
            next()
        }
    } catch (error) {
        return res.send(error)
    }
    
}
function insertInCacheAndReturnData (expiration, data, key) {
    console.log('all set')
    try {
        redis.setEx(key, expiration, JSON.stringify(data))
    } catch (error) {
        return res.send(error)
    }
}

module.exports = {returnCache, insertInCacheAndReturnData}