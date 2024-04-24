const express = require('express');
const router = express.Router();
const ProductManager = require('../manager/productManager.js');
const productManager= new ProductManager();
 


router.get('/products', (req, res) => {
    const limit = req.query.limit;
    if (limit) {
        const limitedProducts = productManager.getProducts().slice(0, limit);
        res.json(limitedProducts);
    } else {
        res.json(productManager.getProducts());
    }
});


router.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductsById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


router.post('/products', (req, res) => {
    const { title, description, price, code, stock, category, thumbnails } = req.body;
    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    productManager.addProduct(title, description, price, code, stock, category, thumbnails);
    res.status(201).json({ message: 'Producto agregado exitosamente' });
});


router.put('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    const success = productManager.updateProduct(productId, updatedFields);
    if (success) {
        res.json({ message: 'Producto actualizado exitosamente' });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


router.delete('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const success = productManager.deleteProduct(productId);
    if (success) {
        res.json({ message: 'Producto eliminado exitosamente' });
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

module.exports = router;