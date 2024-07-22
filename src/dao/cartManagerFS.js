const { writeFile, utimes } = require("fs");

const fs = require("fs").promises;

class CartManager {
  constructor() {
   
    this.cartsFile = "./back_ecommerce/src/Carts.json";
    
    this.productsBD = "./back_ecommerce/src/Products.json";
  }
  
  async creatCart() {
    try {
    
      const carts = await this.readCart();
      
      const ultimoId =
        carts.length > 0 ? Math.max(...carts.map((prod) => prod.id)) : 0;
    
      const carrito = {
        id: ultimoId + 1,
        products: [],
      };
      
      const existCart = carts.find((cart) => cart.id === carrito.id);
      
      if (!existCart) {
        carts.push(carrito);
        fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
        console.log("Se ha creado un nuevo 🛒");
      }
      if (existCart) {
        console.error("Ya existe el 🛒", error);
      }
    } catch (error) {
      console.error("No se puede crear el 🛒");
    }
  }
  
  async getProductsForCart(id) {
    try {
     
      const carts = await this.readCart();
      
      const existCart = carts.find((cart) => cart.id === id);
      
      if (existCart) {
        return existCart.products;
      } else {
        return console.log("No existe 🛒");
      }
    } catch (error) {
      console.error("No se puede crear el 🛒");
    }
  }

  
  async addToCart(idP, idC) {
    try {
      
      const product = await this.addProduct(idP);
      
      const carts = await this.readCart();
      
      const existCart = carts.find((cart) => cart.id === idC);
     
      if (!existCart) {
       
        const ultimoId =
          carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) : 0;
       
        const newCart = {
          id: idC || ultimoId + 1,
          products: [{ product: product, quantity: 1 }],
        };
        carts.push(newCart);
        await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
      }
     
      if (existCart) {
        
        const cartIndex = carts.findIndex((cart) => cart.id === idC);
        
        const existingProductIndex = carts[cartIndex].products.findIndex(
          (prod) => prod.product === idP
        );
        
        if (existingProductIndex !== -1) {
          carts[cartIndex].products[existingProductIndex].quantity++;
        } else {
          carts[cartIndex].products.push({ product: product, quantity: 1 });
        }
        await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
      }
    } catch (error) {
      console.error("No se puede agregar producto o crear carrito", error);
    }
  }
  
  async addProduct(id) {
    try {
      const bd = await this.readBD();
      const existProduct = bd.find((prod) => prod.id === id);
      if (existProduct) {
        return existProduct.id;
      } else {
        console.log(`Producto con id: ${id} inexistente`);
      }
    } catch (error) {
      console.error("No existe producto en la base de datos", error);
    }
  }
  
  async readBD() {
    try {
      const bd = await fs.readFile(this.productsBD, "utf8");
      const products = JSON.parse(bd);
      return products;
    } catch (error) {
      console.error("No se puede acceder al archivo de los productos", error);
    }
  }
  
  async readCart() {
    try {
      const cart = await fs.readFile(this.cartsFile, "utf8");
      const productsInCart = JSON.parse(cart);
      return productsInCart;
    } catch (error) {
      console.error("No se puede acceder al archivo del carrito", error);
    }
  }
}


module.exports = CartManager;