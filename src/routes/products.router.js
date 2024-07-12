const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsCotroller.js");

const { isAuthenticated } = require("../middleware/auth.js");

router.get("/products", productsController.getProducts);

router.get("/productDetails/:pid", productsController.productDetails);

router.get(
  "/productsManager",
  isAuthenticated,
  productsController.productsAdmin
);

router.post("/productsManager", productsController.addProductToBD);

router.put("/:uid", productsController.updateProductToDB);

router.delete("/productsManager/:uid", productsController.deleteProductToDB);

module.exports = router;
