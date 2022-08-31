const {redisClient} = require('../redis')


const redisAll = (expiration=5) => async (req, res, next) => {
    let cacheKey =req.originalUrl
    const slow = req.query.slow?req.query.slow: req.body.slow;

    const cacheResponse = await redisClient.get(cacheKey)

    if(cacheResponse){
        return res.send(JSON.parse(cacheResponse))
    }else{
        res.originalSend = res.send
        res.send = body => {
            res.originalSend(body)
            redisClient.setEx(cacheKey, expiration, JSON.stringify(body))
        }
        if(slow){
            setTimeout(() => {
                next()
            }, slow*1000)
          }else{
              next()
          }    
        
    }
}

module.exports = redisAll