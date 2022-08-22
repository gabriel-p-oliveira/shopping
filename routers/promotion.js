const express = require('express')
const router = express.Router()
const promotionList = require('../promotion.json')


router.get('/getAllPromotions',async (req, res) => {

    try {
        res.send(promotionList)
    } catch (error) {
        
    }
})




module.exports = app => app.use('/promotion', router)