
const pool = require('../../config/mysqlPool');

const createProductTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL
    )
`;

// Initialize the product table
pool.query(createProductTableQuery, (err) => {
    if (err) {
        console.error('Error initializing product table:', err.stack);
        return;
    }
    console.log('Product table initialized');
});

// Define the Product model
class Product {
    constructor(name, price, image, category) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
    }

    // Method to save a new product
    static create(product, callback) {
        const { name, price, image , category } = product;
        const insertProductQuery = 'INSERT INTO products (name, price, image ,category ) VALUES (?, ?, ?,?)';
        pool.query(insertProductQuery, [name, price, image, category], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, { id: result.insertId, name, price, image, category });
        });
    }
}

module.exports = Product;
