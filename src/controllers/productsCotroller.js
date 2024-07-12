const productManager = require("../dao/classes/product.dao.js");
const cartManager = require("../dao/classes/cart.dao.js");
const productModel = require("../dao/models/product.model.js");
const productService = new productManager();
const cartService = new cartManager();

exports.getProducts = async (req, res) => {
  let { limit = 3, page = 1, sort, category } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);

  try {
    let filter = {};
    if (category) {
      filter = {
        $or: [
          { category: category.toUpperCase() },
          { available: category.toLowerCase() === "true" }, 
        ],
      };
    }

    
    let sortOptions = {};
    if (sort) {
      sortOptions.price = sort === "asc" ? 1 : -1;
    }

    
    const totalProducts = await productService.totalProducts(filter);

    
    const totalPages = Math.ceil(totalProducts / limit);
    const offset = (page - 1) * limit;

    const products = await productModel
      .find(filter)
      .lean()
      .sort(sortOptions)
      .skip(offset)
      .limit(limit);

    
    const response = {
      status: "success",
      payload: products,
      userOne: req.session.user,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `/products?limit=${limit}&page=${page - 1}&sort=${
              sort || ""
            }&category=${category || ""}`
          : null,
      nextLink:
        page < totalPages
          ? `/products?limit=${limit}&page=${page + 1}&sort=${
              sort || ""
            }&category=${category || ""}`
          : null,
    };

    
    if (req.session.user) {
      const cart = await cartService.getCartById(req.session.user.cart);
    
      res.render("products", {
        user: req.session.user,
        cart: cart.products,
        response,
        title: "Productos",
      });
    } else {
      res.render("products", {
        response,
        title: "Productos",
      });
    }

    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

exports.productDetails = async (req, res) => {
  let { pid } = req.params;
  const product = await productService.getProductById(pid);
  if (req.session.user) {
    const cart = await cartService.getCartById(req.session.user.cart);
    if (cart) {
      res.render("productDetail", {
        cart: cart.products,
        user: req.session.user,
        product,
        title: "Detalles producto",
      });
    }

  } else {
    res.render("productDetail", {
      product,
      title: "Detalles producto",
    });
  }
};

exports.productsAdmin = async (req, res) => {
  try {
    let page = parseInt(req.query.page);
    if (!page) page = 1;
    let result = await productModel.paginate(
      {},
      { page, limit: 3, lean: true }
    );
    result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
    result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
    result.isValid = !(page <= 0 || page > result.totalPages);
    result.title = "Administrador de productos";
    result.user = req.session.user;

    res.render("productsManager", result);
  } catch (error) {
    console.error("No se encuentran productos en la Base de datos", error);
  }
};

exports.addProductToBD = async (req, res) => {
  let { title, description, price, code, status, category, stock } =
    req.body;
  let page = parseInt(req.query.page);
  if (!page) page = 1;
  let result = await productModel.paginate({}, { page, limit: 3, lean: true });
  result.prevLink = result.hasPrevPage ? `?page=${result.prevPage}` : "";
  result.nextLink = result.hasNextPage ? `?page=${result.nextPage}` : "";
  result.isValid = !(page <= 0 || page > result.totalPages);
  result.agregado = "Producto agregado correctamente";
  result.user = req.session.user;

  try {
    await productService.addProduct(
      title,
      description,
      price,
      code,
      status,
      category,
      stock
    );

    res.render("productsManager", result);
  } catch (error) {
    if (error.message === "No se han completado todos los campos") {
      result.error = "No se han completado todos los campos";
      res.render("productsManager", result);
    } else if (error.message === "Número de código existente") {
      result.error = "Número de código existente";
      res.render("productsManager", result);
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
};

exports.updateProductToDB = async (req, res) => {
  let { uid } = req.params;
  let { title, description, price,code, status, category, stock } =
    req.body;

  try {
    await productService.updateProduct(
      uid,
      title,
      description,
      price,
      code,
      status,
      category,
      stock
    );
    let products = await productService.onlyGetProducts();
    const exist = products.find((prod) => prod.id === uid);
    res.status(201).json({ message: `Producto ${exist.title} actualizado` });
  } catch (error) {
    if (error.message === "Producto no existe en la base de datos") {
      res.status(400).json({ error: "Producto no existe en la base de datos" });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
};
exports.getUpdateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    let result = await productService.getProductById(pid);
    res.render("updateProduct", { result: result, style: "products.css" });
  } catch (error) {}
};

exports.deleteProductToDB = async (req, res) => {
  let { uid } = req.params;

  try {
    await productService.deleteProduct(uid);

    res.render("productsManager");
  } catch (error) {
    if (
      error.message === "No se encuentra producto con es id en la base de datos"
    ) {
      res.status(400).json({
        error: `No se encuentra producto con ID: ${uid} en la base de datos`,
      });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
};
