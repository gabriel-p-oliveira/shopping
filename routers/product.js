const express = require("express");
const router = express.Router();

const {
  checkAndAplyPromotion,
} = require("../middlewares/checkAndAplyPromotion");
const { noPromotion } = require("../middlewares/noPromotion");
const {
  checkAmmount,
  confirmPurchase,
} = require("../middlewares/postPurchase");
const { checkProductAmount } = require("../middlewares/checkAmount");
const { getAll } = require("../elastic");
const {
  returnCache,
} = require("../middlewares/redisCache");

const redisAll = require('../middlewares/redisAllCache')
router.get("/getAllProducts", redisAll(180), async (req, res) => {
  try {
    const slow = req.query?.slow;
    const result = await getAll("product");
    if (slow) {
      setTimeout(() => {
        return res.send(result);
      }, slow * 1000);
    } else {
      return res.send(result);
    }
  } catch (error) {
    return res.send(error);
  }
});

router.get(
  "/getProductByName",
  returnCache,
  checkProductAmount,
  checkAndAplyPromotion,
  noPromotion
);

router.get("/getAllPurchase", redisAll(180), async (req, res) => {
  try {
    const result = await getAll("purchase");
    res.send(result);
  } catch (error) {}
});

router.post(
  "/postPurchase",
  returnCache,
  checkAmmount,
  confirmPurchase
);

module.exports = (app) => app.use("/product", router);
