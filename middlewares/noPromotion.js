const productList= require('../product.json')
const {filter, formatDate} = require('../utils')

function noPromotion(req, res, next){
    try {
        const query = req.query;
        let current = new Date();
        let product = filter(productList,'name', req.query )
        query.normalPrice =  query.quantity * product[0].price
        query.earlyDate = formatDate(current.setDate(current.getDate() + product[0].earlyDate))
        query.promotion = 'no promotion available'
        query.price = product[0].price
        if(!product){
            throw {error:  `product "${req.query.name}" not found.`}
        }

        return res.send(query)
    } catch (error) {
       return res.send(error)
    }
}
module.exports = {noPromotion}