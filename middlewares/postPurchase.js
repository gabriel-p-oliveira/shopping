const { filter } = require("../utils");

const productList = require("../product.json");
const promotion = require("../promotion.json");
const fs = require("fs");
const { Console } = require("console");

function postPurchase(req, res, next) {
  try {
    const { purchase } = req.body;
    if (purchase.length <= 0) {
      throw "no product in purchase.";
    }
    let data = fs.readFileSync("product.json");
    let myprodList = JSON.parse(data);

    myprodList.forEach((prod, index) => {
        const filt = purchase.filter(function(purchasProd) { return purchasProd.name === prod.name; })
        if(filt[0]){
            // prod.ammountAvailable -= purchase[index].quantity 
            console.log(filt)
            // console.log(purchase[index])
        }
    })

        console.log(myprodList)

    // });
    // let newData = JSON.stringify(myprodList);
    // console.log(myprodList)
    // fs.writeFile('product.json', newData, err => {
    //         if(err) throw err;
    //         console.log("New data added");
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  postPurchase,
};
