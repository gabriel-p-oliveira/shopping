const {formatDate} = require('../utils')

function noPromotion(req, res, next){
    try {
        const query = req.query;
        const slow = req.query.slow;

        let current = new Date();
        let product = res.locals.product._source
        if(!product){
            throw {error:  `product "${req.query.name}" not found.`}
        }
        query.normalprice =  query.quantity * product.price
        query.finalprice =  query.quantity * product.price
        query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
        query.promotion = 'no promotion available'
        query.price = product.price

        if(slow){
            setTimeout(() => {
                return res.send(query)
            }, slow*1000)
          }else{
              return res.send(query)
          }
    } catch (error) {
       return res.send(error)
    }
}
module.exports = {noPromotion}