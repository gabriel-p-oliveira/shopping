const {
  dateRule,
  moreDate,
  productListPromo,
  moreThan
} = require("../promotionRules/promotionRules");

const {getpromotion} = require('../elastic')
const {insertInCacheAndReturnData} = require('../middlewares/redisCache')

async function checkAndAplyPromotion(req, res, next) {
  try {
    const query = req.query;
    let product = res.locals.product

    if(!product){
      throw {error: `product ${query.name} not available`}
    }
    if (!product?.promotion) {
      next();
    } else {
      const p = await getpromotion('promotion', product.promotionId)

      let promo = p.hits.hits[0]._source
      
      query.price = product.price
      const promos = ['date','more then & date','more then','product List']
      console.log('...')
      if (promo.rule == "date") {
        insertInCacheAndReturnData(60, dateRule(promo, query, product, promo), req.originalUrl)
        return res.send(dateRule(promo, query, product, promo));
      }
      if (promo.rule == "more then & date") {
        insertInCacheAndReturnData(60, moreDate(promo, query, product, promo), req.originalUrl);
        return res.send(moreDate(promo, query, product, promo));
      }
      if (promo.rule == "more then") {
        insertInCacheAndReturnData(60, moreThan(promo, query, product, promo), req.originalUrl);
        return res.send(moreThan(promo, query, product, promo));
      }
      if (promo.rule == "product List") {
        insertInCacheAndReturnData(60, productListPromo(promo, query, product, promo), req.originalUrl);
        return res.send(productListPromo(promo, query, product, promo));
      }
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

module.exports = {
  checkAndAplyPromotion,
};
