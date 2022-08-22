const express = require('express')
const router = express.Router()
const productList= require('../product.json')
const purchase = require('../purchase.json')

const {checkAndAplyPromotion} = require('../middlewares/checkAndAplyPromotion')
const { noPromotion } = require('../middlewares/noPromotion')
const {postPurchase} = require('../middlewares/postPurchase')
require('dotenv').config()

router.get('/getAllProducts', async (req, res) => {

    try {
        return res.send(productList)
    } catch (error) {
        
    }
})
router.get('/getProductByName',checkAndAplyPromotion, noPromotion)


router.get('/getAllPurchase',async (req, res) => {
    try {
        res.send(purchase)
    } catch (error) {
        
    }
})
router.get('/getPurchase',async (req, res) => {
    try {
        
    } catch (error) {
        
    }
})
router.post('/postPurchase',postPurchase, async (req, res) => {
    try {
        return res.send('a')
    } catch (error) {
        
    }
})





module.exports = app => app.use('/product', router)