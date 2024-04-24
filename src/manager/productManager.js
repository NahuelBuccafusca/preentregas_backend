const fs = require('fs');

class ProductManager {
    constructor(filePath) {
      this.filePath = "products.json";
      this.products = [];

    }

    loadProducts() {
      try {
        const data = fs.readFileSync(this.filePath, 'utf8')
        this.products = JSON.parse(data);

      } catch (error) {
        this.products = []
        console.log("Error al cargar base de datos", error)        
      }
    }
    saveProducts() {
      const data = JSON.stringify(this.products, null, 2);
      try {
        fs.writeFileSync(this.filePath, data);
        console.log("El producto fué agregado")
      } catch (error) {
        console.log("Error al agregar el producto", error)
        
      } 
    }
    addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
      }

    if (this.products.some(product => product.code === code)) {
        console.log("El producto ya existe");
        return;
      }

    const id = this.products.length + 1;
    const product = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock, 
    };
    this.products.push(product);
    this.saveProducts();
    }
    
    getProducts() {
        return this.products;
    }

    getProductsById(id) {
        const product = this.products.find(product => product.id === id);
        if(!product){
            console.log("Producto no encontrado");
            return;
        }
        return product;
    }

    updateProduct(id, updatedFields) {
      const index = this.products.findIndex(product => product.id === id);
      if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updatedFields };
          this.saveProducts();
          return true;
      }
      return false;
    }   

    deleteProduct(id) {
      const index = this.products.findIndex(product => product.id === id)
      if (index !== -1) {
        this.products.splice(index,1);
        this.saveProducts();
        return true;
      }
      return false;
    }
}

module.exports= ProductManager