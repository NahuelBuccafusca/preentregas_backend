const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController.js");

router.get("/carts", cartController.getcarts);

router.get("/carts/:cid/purchase", cartController.checkout);

router.post("/carts/:cid/purchase", cartController.buy);

router.post("/createcart", cartController.addCart);

router.get("/carts/:cid", cartController.getCartById);

router.post("/carts/:cid/products/:pid", cartController.addToCart);

router.put("/carts/:cid/products/:pid", cartController.addToCart);

router.delete("/carts/:cid/products/:pid", cartController.deleteProduct);

module.exports = router;