const { filter, formatDate } = require("../utils");
const {dateRule, moreDate,moreThan, productListPromo  } = require('../promotionRules/promotionRules')
const productList = require("../product.json");
const promotion = require("../promotion.json");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

function checkAmmount(req, res, next) {
  try {
    const { purchase } = req.body;
    if (purchase.length <= 0) {
      throw "no product in purchase.";
    }
    let data = fs.readFileSync("product.json");
    let myprodList = JSON.parse(data);

    myprodList.forEach((prod, index) => {
      const filt = purchase.filter(function (purchasProd) {
        return purchasProd.name === prod.name;
      });
      if (filt[0]) {
        if (filt[0].quantity > myprodList[index].ammountAvailable) {
          throw `Not enoght ammount Available for this quantity. only available ${myprodList[index].ammountAvailable} for the product ${myprodList[index].name}`;
        }
        myprodList[index].ammountAvailable -= filt[0].quantity;
      }
    });

    let newData = JSON.stringify(myprodList);
    fs.writeFile("product.json", newData, (err) => {
      if (err) throw err;
      res.send(error)
    });
    next();
  } catch (error) {
    res.send(error)
  }
}

function confirmPurchase(req, res, next) {
  try {
    const { purchase } = req.body;
    const finalPurchase = {products:[], totalPrice:0}
    purchase.forEach((productBuyed, index) => {
      let product = filter(productList, "name", {name: productBuyed.name});

      if (!product[0]) {
        throw `product "${productBuyed.name}" not available`;
      }
      if (!product[0]?.promotion) {
        let current = new Date();

        const prodNoPromotion = {
          id: product[0].id,
          name: productBuyed.name,
          finalPrice:  productBuyed.quantity * product[0].price,
          earlyDate: formatDate(current.setDate(current.getDate() + product[0].earlyDate)),
          quantity: productBuyed.quantity,
          promotion: 'no promotion available',

        }
        finalPurchase.products.push(prodNoPromotion)
      } else {
        console.log('else')
        let promo = promotion.filter(function (element) {
          return element.id === product[0].promotionId;
        });

        if (promo[0].rule == "date") {
          finalPurchase.products.push(dateRule("a", promo[0], productBuyed, product[0], promo[0]));
        }
        if (promo[0].rule == "more then & date") {
          finalPurchase.products.push(moreDate(promo[0], productBuyed, product[0], promo[0]));
        }
        if (promo[0].rule == "more then") {
          finalPurchase.products.push(moreThan(promo[0], productBuyed, product[0], promo[0]));
        }
        if (promo[0].rule == "product List") {
          finalPurchase.products.push(
            productListPromo(promo[0], productBuyed, product[0], promo[0])
          );
        }
      }
    });
    finalPurchase.products.map((prod) => {
      finalPurchase.totalPrice += prod.finalPrice 
    })
    finalPurchase.id = uuidv4()


    
    let purchaseList = fs.readFileSync("purchase.json");
    let purchaseListObject = JSON.parse(purchaseList);
    purchaseListObject.push(finalPurchase)

    let newData = JSON.stringify(purchaseListObject);
    fs.writeFile("purchase.json", newData, (err) => {
      if (err) throw err;
    });

    return res.send(finalPurchase)
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

module.exports = {
  checkAmmount,
  confirmPurchase
};
