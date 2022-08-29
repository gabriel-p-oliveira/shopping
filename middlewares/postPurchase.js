const { formatDate } = require("../utils");
const {
  dateRule,
  moreDate,
  moreThan,
  productListPromo,
} = require("../promotionRules/promotionRules");

const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
  getpromotion,
  getProduct,
  updateProductByName,
  insert,
} = require("../elastic");

async function checkAmmount(req, res, next) {
  try {
    const { purchase, slow } = req.body;
    if (purchase.length <= 0) {
      throw { error: "no product in purchase." };
    }
    // console.log(await getAll('product'))

    purchase.forEach(async (prod, index) => {
      const p = await getProduct("product", prod.name);
      const filt = p.hits.hits[0];
      if (!filt) {
        throw { error: `product "${prod.name}" not available` };
      }

      if (filt._source) {
        if (filt._source.ammountAvailable < prod.quantity) {
          throw {
            error: `Not enoght ammount Available for this quantity. only available ${filt._source.ammountAvailable} for the product ${filt._source.name}`,
          };
        }

        filt._source.ammountAvailable -= prod.quantity;
        updateProductByName(filt._id, filt._source.ammountAvailable);
      }
    });
    if (slow) {
      setTimeout(() => {
        next();
      }, slow * 1000);
    } else {
      next();
    }
  } catch (error) {
    return res.send(error);
  }
}

async function confirmPurchase(req, res, next) {
  try {
    // res.send(res.locals.prodList)
    const { purchase } = req.body;
    const finalPurchase = { products: [], totalprice: 0 };
    const productList = []

    for(let i = 0; i < purchase.length +1; i++) {

      if(i == purchase.length ){
        finalPurchase.products = productList
        break
      }
      let p = await getProduct("product", purchase[i].name);
      if (!p.hits.hits[0]) {
        return res.send({ error: `product "${purchase[i].name}" not available` });
      }
      let product = p.hits.hits[0]._source;
      
      if (!product?.promotion) {
        let current = new Date();
        
        const prodNoPromotion = {
          id: product.id,
          name: purchase[i].name,
          finalprice: purchase[i].quantity * product.price,
          earlyDate: formatDate(
            current.setDate(current.getDate() + product.earlyDate)
          ),
          quantity: purchase[i].quantity,
          promotion: "no promotion available",
        };
        // productList.push(prodNoPromotion);
        productList.push(prodNoPromotion)
      } else {
        let p = await getpromotion("promotion", product.promotionId);

        const promo = p.hits.hits[0]._source;

        if (promo.rule == "date") {
          productList.push(dateRule(promo, purchase[i], product, promo))
        }
        if (promo.rule == "more then & date") {
           productList.push( moreDate(promo, purchase[i], product, promo))
        }
        if (promo.rule == "more then") {
            productList.push(moreThan(promo, purchase[i], product, promo))
        }
        if (promo.rule == "product List") {
          
            productList.push(productListPromo(promo, purchase[i], product, promo))
          
        }
      }

    };

    finalPurchase.products.forEach(async (prod) => {
       finalPurchase.totalprice += prod.finalprice? prod.finalprice: prod.normalprice;
    });
    finalPurchase.id = uuidv4();

    
    insert('purchase', finalPurchase)

    return res.send(finalPurchase);
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  checkAmmount,
  confirmPurchase,
};
