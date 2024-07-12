const cartManager = require("../dao/classes/cart.dao.js");
const cartModel = require("../dao/models/cart.model.js");
const productManager = require("../dao/classes/product.dao.js");
const crypto = require("crypto");
const ticketManager = require("../dao/classes/ticket.dao.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const cartService = new cartManager();
const productService = new productManager();
const ticketService = new ticketManager();

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.usermail,
    pass: process.env.pass,
  },
});
exports.getcarts = async (req, res) => {
  try {
    let carts = await cartService.getCarts();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.error("No se encuentas carritos en la Base de datos", error);
  }
};

exports.addCart = async (req, res) => {
  await cartService.addCart();
  let carts = await cartService.getCarts();
  console.log("Carrito creado correctamente");
  res.send({ result: "success", payload: carts });
};

exports.getCartById = async (req, res) => {
  let { cid } = req.params;

  try {
    let cart = await cartService.getCartByIdPopulate(cid);
    let cartSimple = await cartService.getCartById(cid);
    console.log(cart);
    res.render("cart", {
      cart,
      totalPrice: cartSimple.total,
      title: "Carrito",
    });
  } catch (error) {
    res.status(500).send("Error al obtener el carrito");
  }
};

exports.addToCart = async (req, res) => {
  let { cid, pid } = req.params;
  let user = req.session.user;
  try {
    if (user.rol === "admin") {
      res.send({
        message:
          "Usted es administrador, no puede agregar productos al carrito",
      });
    }
    if (user.rol === "user") {
      await cartService.addToCart(pid, cid);
      res.redirect("/products");
    }
  } catch (error) {
    console.error("No se puede agregar el producto", error);
    res.status(500).send("Error de conexión");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let { cid, pid } = req.params;
    const cart = await cartService.getCartById(cid);
    const product = await productService.getProductById(pid);
    if (!cart) {
      return res.status(404).send({ Respusta: "Carrito no encontrado" });
    }
    let existProduct = cart.products.find((p) => p.product.toString() === pid);
    if (!existProduct) {
      return res
        .status(404)
        .send({ Respuesta: "Producto no encontrado en el carrito" });
    } else {
      if (existProduct.quantity >= 1) {
        existProduct.quantity--;
        existProduct.totalPrice = existProduct.quantity * product.price;
        cart.total = cart.total - product.price;
        let result = await cartModel.updateOne(
          { _id: cid },
          { products: cart.products }
        );
        if (existProduct.quantity === 0) {
          cart.products = cart.products.filter(
            (p) => p.product.toString() !== pid
          );
        }

        await cart.save();

        res.redirect(`/carts/${cid}`);
      }
    }
  } catch (error) {
    res.status(504).send(error);
  }
};

exports.checkout = async (req, res) => {
  try {
    let { cid } = req.params;
    let productStock = [];
    let productNoStock = [];
    let total = 0;
    let finalyCart = await cartService.getCartById(cid);
    let cart = await cartService.getCartByIdPopulate(cid);
    let products = await productService.getProducts();
    for (const product of cart.products) {
      if (product.product.stock >= product.quantity) {
        productStock.push({ title: product.product.title });
        total = total + product.totalPrice;
      } else {
        productNoStock.push({ title: product.product.title });
      }
    }
    console.log(total);
    res.render("checkout", {
      ProductosConStock: productStock,
      ProductosSinStock: productNoStock,
      total: total,
    });
  } catch (error) {
    res.status(504).send(error);
  }
};

exports.buy = async (req, res) => {
  let { cid } = req.params;
  let cart = await cartService.getCartByIdPopulate(cid);
  let productStock = [];
  let productNoStock = [];
  let total = 0;
  for (const product of cart.products) {
    if (product.product.stock >= product.quantity) {
      productStock.push({ title: product.product.title });
      const productId = product._id;
      let newStock = product.product.stock - product.quantity;
      total = total + product.totalPrice;
      cart.total = cart.total - product.totalPrice;
      await productService.updateQuantity(product.product._id, newStock);
      await cartService.updateTotal(cid, cart.total);
      console.log(
        `Producto ${product.product.title} actualizado en base de datos`
      );
      await cartService.updateCart(cid, productId);
      
    } else {
      productNoStock.push({ title: product.product.title });
      console.log(`Producto ${product.product.title} sin stock`);
    }

  }

  let codeCrypto = `${req.session.user.last_name}_${crypto
    .randomBytes(10)
    .toString("hex")}`;
  let code = codeCrypto;
  let ticket = {
    code: code,
    purchase_datetime: new Date(),
    amount: total,
    purchaser: req.session.user.email,
  };
  let mail = await transport.sendMail({
    from: "n.buccafusca@outlook.com.ar",
    to: req.session.user.email,
    subject: "Gracias por tu compra",
    html: `<div>
          <h1>Orden # ${ticket.code}</h1>
          <p>Total de compra $ ${ticket.amount}.-</p>
          <p>Gracias por su compra</p>
          </div>`,
  });
  
  let result = await ticketService.createTicket(ticket);
  res.render("purchaseDetail", {
    ticket: ticket,
    products: productStock,
    productNoStock: productNoStock,
  });
}