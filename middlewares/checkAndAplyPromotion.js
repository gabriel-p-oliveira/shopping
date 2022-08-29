const promotion = require("../promotion.json");
const {
  dateRule,
  moreDate,
  productListPromo,
  moreThan
} = require("../promotionRules/promotionRules");

const {getpromotion} = require('../elastic')

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
      
      if (promo.rule == "date") {
        return res.send(dateRule(promo, query, product, promo));
      }
      if (promo.rule == "more then & date") {
        return res.send(moreDate(promo, query, product, promo));
      }
      if (promo.rule == "more then") {
        return res.send(moreThan(promo, query, product, promo));
      }
      if (promo.rule == "product List") {
        return res.send(productListPromo(promo, query, product, promo));
      }
    }
  } catch (error) {
    // console.log(error)
    res.send(error)
  }
}

module.exports = {
  checkAndAplyPromotion,
};
