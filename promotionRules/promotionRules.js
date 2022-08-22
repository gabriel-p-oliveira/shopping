const {percentageFunc, formatDate, filter} = require('../utils')
const dateRule= (date, promo,  query,product) => {
    let current = new Date();
    let promotionDate = new Date(promo.ruleValue)
    query.promotion = promo.name
    query.normalPrice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue

    // console.log(current)
    console.log(promo.ruleValue)
    // console.log(current < promotionDate)
    if(current < promotionDate){
        const finalPrice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalPrice = finalPrice
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
    query.normalPrice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue

    if(current < promotionDate && query.quantity >= promo.ruleValue[0]){
        const finalPrice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalPrice = finalPrice
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
    query.normalPrice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue

    let findProd = promo.ruleValue.filter(function(item) { return item === query.name; });
    if(findProd){
        const finalPrice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalPrice = finalPrice
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
    query.normalPrice = query.quantity * product.price
    query.earlyDate = formatDate(current.setDate(current.getDate() + product.earlyDate))
    query.promoRule = promo.ruleValue

    if(query.quantity > promo.ruleValue){
        const finalPrice = percentageFunc(query.quantity, product.price,  promo.percentage)
        query.finalPrice = finalPrice
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