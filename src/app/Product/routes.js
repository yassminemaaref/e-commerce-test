const express = require("express");
const router = express.Router();
const productController = require("./controller");
const multerInstance = require('../../config/multer');

// Import MySQL database connection
const pool = require('../../config/mysqlPool');

// Route to create a product
router.post("/", multerInstance.upload.single('image'), (req, res) => {
    const { name, price, image } = req.body;
    const category = req.file;

    if (!name || !price || !image || !category) {
        return res.status(400).json({ error: 'Name, price, image, and category are required' });
    }

    const sql = 'INSERT INTO products (name, price, image, category) VALUES (?, ?, ?, ?)';
    pool.query(sql, [name, price, image.path, category], (err, result) => {
        if (err) {
            console.error('Error creating product:', err);
            return res.status(500).json({ error: 'Failed to create product' });
        }
        res.status(200).json({
            status: true,
            data: { id: result.insertId, name, price, image: image.path, category },
        });
    });
});

// Route to get all products
router.get("/", (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error getting products:', err);
            return res.status(500).json({ error: 'Failed to retrieve products' });
        }
        res.status(200).json({
            status: true,
            data: results,
        });
    });
});

// Route to get a product by ID
router.get("/:id", (req, res) => {
    const productId = req.params.id;
    pool.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error getting product:', err);
            return res.status(500).json({ error: 'Failed to retrieve product' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            status: true,
            data: results[0],
        });
    });
});

// Route to delete a product by ID
router.delete("/:id", (req, res) => {
    const productId = req.params.id;
    pool.query('DELETE FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            status: true,
            data: results,
        });
    });
});

module.exports = router;