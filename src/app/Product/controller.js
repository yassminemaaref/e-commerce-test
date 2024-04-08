const pool = require('../../config/mysqlPool');

exports.createProduct = async (req, res) => {
    try {
        const { name, price, image, category } = req.body;

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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            status: false,
        });
    }
};

exports.getProducts = async (req, res) => {
    try {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            status: false,
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            status: false,
        });
    }
};

exports.removeProduct = async (req, res) => {
    try {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err,
            status: false,
        });
    }
};
