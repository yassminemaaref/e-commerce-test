const mysql = require('mysql');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'cart', 
    connectionLimit: 10 
});

// Retrieve all products from the database
exports.products = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM products', (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
};

// Retrieve a product by its ID from the database
exports.productById = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            if (results.length === 0) {
                resolve(null); 
            } else {
                resolve(results[0]); 
            }
        });
    });
};

// Create a new product in the database
exports.createProduct = async (payload) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO products SET ?', payload, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ id: results.insertId, ...payload });
        });
    });
};

// Remove a product from the database by its ID
exports.removeProduct = async (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results.affectedRows > 0);
        });
    });
};

module.exports = pool; // Export the pool for use in other modules
