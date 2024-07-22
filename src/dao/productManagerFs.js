const fs = require("fs").promises;

class ProductManager {
  constructor() {
    this.productsFile = "./back_ecommerce/src/Products.json";
  }
  
  async addProduct(
    title,
    description,
    price,
    status = true,
    code,
    stock,
    category
  ) {
    try {
      
      const products = await this.readProducts();
      
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !stock ||
        !category
      ) {
        console.error("Todos los campos son obligatorios");
        return;
      }
    
      if (products.some((prod) => prod.code === code)) {
        console.error("Ya existe un producto con ese código");
        return;
      }
      
      const ultimoId =
        products.length > 0 ? Math.max(...products.map((prod) => prod.id)) : 0;

      const product = {
        id: ultimoId + 1,
        title,
        description,
        price,
        status: status,
        code,
        stock,
        category,
      };
      
      products.push(product);

      fs.writeFile(this.productsFile, JSON.stringify(products));
      console.log(
        `Su producto con el nombre "${product.title}" fue agregado correctamente`
      );
    } catch (error) {
      console.error("No se agregar el producto", error);
    }
  }
  
  async getProducts() {
    try {
      const productos = await this.readProducts();
      console.log(productos);
    } catch (error) {
      console.error("No se encuetran productos en la base de datos");
    }
  }

  async getProductById(id) {
    try {
      const products = await this.readProducts();
      const productById = products.find((prod) => prod.id === id);
      if (productById) {
        return productById;
      } else console.log("No existe ese producto");
    } catch (error) {
      console.error("No se encuentra un producto  en la base de datos", error);
    }
  }
  
  async updateProduct(
    id,
    title,
    description,
    price,
    code,
    stock,
    category
  ) {
    try {
      const products = await this.readProducts();
      const productoEncontrado = products.find((prod) => prod.id === id);
      if (!productoEncontrado) {
        return;
      }
      //Creo el objeto nuevo para agregar con las opciones para que no se borre ninguna propiedad de no pasarla como parámetro
      const productoActualizado = {
        id,
        title: title || productoEncontrado.title,
        description: description || productoEncontrado.description,
        price: price || productoEncontrado.price,
        status: productoEncontrado.status,
        code: code || productoEncontrado.code,
        stock: stock || productoEncontrado.stock,
        category: category || productoEncontrado.category,
      };
      const productosActualizados = products.map((prod) => {
        if (prod.id === id) {
          return productoActualizado;
        }

        return prod;
      });

      await fs.writeFile(
        this.productsFile,
        JSON.stringify(productosActualizados, null, 2),
        "utf8"
      );

      console.log("Producto actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  }
  async deleteProduct(id) {
    try {
      const products = await this.readProducts();
      const newProducts = products.filter((prod) => prod.id != id);
      const deletedProduct = products.find((prod) => prod.id === id);
      if (deletedProduct) {
        fs.writeFile(this.productsFile, JSON.stringify(newProducts, null, 2));
        console.log(`Usted ha eliminado el producto ${deletedProduct.title}`);
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al leer el archivo de productos", error);
    }
  }
  
  async readProducts() {
    try {
      const contenido = await fs.readFile(this.productsFile, "utf8");
      const productos = JSON.parse(contenido);
      return productos;
    } catch (error) {
      console.error("Error al leer el archivo de productos: ", error);
      throw error;
    }
  }
}


module.exports = ProductManager;