const express = require('express')
const router = express.Router()
const promotionList = require('../promotion.json')

const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    // node: 'http://localhost:9200', //local
      node:" http://10.229.240.73:9200/"  //remote 
    }); 

router.get('/getAllPromotions',async (req, res) => {

    try {
    
        const index = 'promotion'
        const count = await client.count({ index: index })
        const result= await client.search({
          index: index,
          // query: {
            //   match: { quote: 'inception' }
            // }
            size: count.count 
          })
          return res.send(result)
        } catch (error) {
          return res.send(error)
        }
})




module.exports = app => app.use('/promotion', router)