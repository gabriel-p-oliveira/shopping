const { filter } = require("../utils");

const productList = require("../product.json");
const promotion = require("../promotion.json");
const {
  dateRule,
  moreDate,
  productListPromo,
  moreThan
} = require("../promotionRules/promotionRules");
function checkAndAplyPromotion(req, res, next) {
  try {
    const query = req.query;
    let product = filter(productList, "name", query);

    if(!product[0]){
      throw {error: `product ${query.name} not available`}
    }
    if (!product[0]?.promotion) {
      next();
      //call nopromotion 
    } else {
      let promo = promotion.filter(function (element) {
        return element.id === product[0].promotionId;
      });
      

      if (promo[0].rule == "date") {
        return res.send(dateRule("a", promo[0], query, product[0], promo[0]));
      }
      if (promo[0].rule == "more then & date") {
        return res.send(moreDate(promo[0], query, product[0], promo[0]));
      }
      if (promo[0].rule == "more then") {
        return res.send(moreThan(promo[0], query, product[0], promo[0]));
      }
      if (promo[0].rule == "product List") {
        return res.send(productListPromo(promo[0], query, product[0], promo[0]));
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
