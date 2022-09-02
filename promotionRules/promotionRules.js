const {percentageFunc, formatDate} = require('../utils')


const dateRule= (promo,  query,product) => {
    let current = new Date();
    let promotionDate = new Date(promo.ruleValue[0])
    query.promotion = promo.name
    query.normalprice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue
    if(current < promotionDate){
        const finalprice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalprice = parseInt(finalprice.toFixed(2))

        query.percentage = promo.percentage
        query.promotionDetails = 'promotion valid.'
        return query
    }else{
        query.promotionDetails = 'promotion Expired.'
        return query
    }
}
const moreDate= (promo,  query,product) => {
    let current = new Date();
    let promotionDate = new Date(promo.ruleValue[1])
    query.promotion = promo.name
    query.normalprice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue
    if(current < promotionDate && query.quantity >= promo.ruleValue[0]){
        const finalprice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalprice = parseInt(finalprice.toFixed(2))
        query.percentage = promo.percentage
        query.promotionDetails = 'promotion valid.'
        return query        
    }else{
        query.promotionDetails = 'promotion Expired or quantity not enough.'
        return query        
    }
}
const productListPromo = (promo,  query,product) => {
    let current = new Date();
    query.promotion = promo.name
    query.normalprice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue

    let findProd = promo.ruleValue.filter(function(item) { return item === query.name; });
    if(findProd){
        const finalprice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalprice = parseInt(finalprice.toFixed(2))
        query.percentage = promo.percentage

        query.promotionDetails = 'promotion valid.'
        return query       
    }else{
        query.promotionDetails = 'sorry, promotion not available for this product.'
        return query             
    }
}
const moreThan = (promo,  query,product) => {
    let current = new Date();
    query.promotion = promo.name
    query.normalprice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue

    
    if(query.quantity >= parseInt(promo.ruleValue[0])){
        const finalprice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalprice = parseInt(finalprice.toFixed(2))
        query.percentage = promo.percentage
        query.promotionDetails = 'promotion valid.'
        return query   
    }else{
        query.promotionDetails = 'sorry, you didnt reach the minimun to get this promotion.'
        return query             
    }

}
module.exports ={
    dateRule,
    moreDate,
    productListPromo,
    moreThan
}