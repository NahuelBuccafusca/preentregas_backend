const fs = require('fs');

class CartManager {
    constructor(filePath) {
        this.filePath = "carts.json";
        this.carts = [];
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.carts = JSON.parse(data);
            console.log("BD de Carritos: ", data);
        } catch (error) {
            this.carts = [];
            console.log("Error al cargar base de datos de carritos", error);
        }
    }

    saveCarts() {
        const data = JSON.stringify(this.carts, null, 2);
        try {
            fs.writeFileSync(this.filePath, data);
            console.log("Carrito agregado exitosamente.");
        } catch (error) {
            console.log("Error al agregar el carrito.", error);
        }
    }

    createCart() {
        const id = this.carts.length + 1;
        const newCart = {
            id,
            products: []
        };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            return false;
        }

        const existingProduct = cart.products.find(item => item.productId === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        this.saveCarts();
        return true;
    }
}


module.exports = CartManager;