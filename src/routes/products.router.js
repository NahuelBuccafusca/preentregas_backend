const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsCotroller.js");
const ProductManager = require("../dao/classes/product.dao.js");
const productManager = new ProductManager();
const {
  isAuthenticated,
  isAdmin,
} = require("../middleware/auth.js");

router.get("/products", productsController.getProducts);

router.get("/productDetails/:pid", productsController.productDetails);

router.get(
  "/productsManager",
  isAuthenticated,
  isAdmin,
  productsController.productsAdmin
);

router.post("/productsManager", productsController.addProductToBD);

router.put("/:uid", productsController.updateProductToDB);

router.get("/updateproducts/:pid", productsController.getUpdateProduct);

router.delete("/productsManager/:uid", productsController.deleteProductToDB);

module.exports = router;