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
  insertInCacheAndReturnData,
} = require("../middlewares/redisCache");

router.get("/getAllProducts", async (req, res) => {
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

router.get("/getAllPurchase", async (req, res) => {
  try {
    const result = await getAll("purchase");
    res.send(result);
  } catch (error) {}
});

router.post(
  "/postPurchase",
  returnCache,
  checkAmmount,
  confirmPurchase,
  insertInCacheAndReturnData
);

module.exports = (app) => app.use("/product", router);
