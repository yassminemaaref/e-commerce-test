const mysql = require('mysql');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'cart', 
});

// Method to get the cart with items
exports.cart = async () => {
    try {
        const result = await pool.query(
            'SELECT * FROM carts c ' +
            'LEFT JOIN cartitem ci ON c.id = ci.cart_id ' +
            'LEFT JOIN products p ON ci.product_id = p.id'
        );

        if (result && result.length > 0) {
            const rows = result[0]; // Extract rows from result object

            // Group items by cart
            const groupedItems = rows.reduce((acc, row) => {
                const { id, sub_total, ...item } = row;
                if (!acc[id]) {
                    acc[id] = { id, sub_total, items: [] };
                }
                if (item.product_id) {
                    acc[id].items.push({
                        productId: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                        name: item.name // Assuming the product name is retrieved from the Product table
                    });
                }
                return acc;
            }, {});

            // Convert grouped items to an array
            const carts = Object.values(groupedItems);
            return carts[0]; // Return the first cart (assuming there's only one cart)
        } else {
            return null; // No carts found
        }
    } catch (error) {
        throw error;
    }
};

// Method to add an item to the cart
exports.addItem = async (productId, quantity, price, total) => {
    try {
        const result = await pool.query(
            'INSERT INTO cartitem (cart_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
            [1, productId, quantity, price, total] // Assuming cart_id is 1 for now, you may need to adjust this based on your application logic
        );
        return result.insertId; // Return the ID of the inserted row
    } catch (error) {
        throw error;
    }
};
