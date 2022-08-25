const productList = require('../product.json')

function checkProductAmount(req, res, next){
    try {
        const query = req.query
        req.query.name = req.query.name.toLowerCase();
        req.query.quantity = req.query.quantity.toLowerCase();

        const filt = productList.filter(function (purchasProd) {
            return purchasProd.name === query.name;
        });
        if(!filt[0]){
            throw {error: `Error, product ${query.name} not find.`}
        }
        if(query.quantity > filt[0].ammountAvailable){
            throw {error:  `Not enoght ammount Available for this quantity.You are trying to buy ${query.quantity}, but there its only ${filt[0].ammountAvailable} availablef for this product ${filt[0].name}.`}
        }
        res.locals.product = filt[0]
        next()
    } catch (error) {
        console.log(error)
        return res.send(error)
    }
}

module.exports ={
    checkProductAmount
}