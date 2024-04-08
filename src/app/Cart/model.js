const pool = require('../../config/mysqlPool');

class Cart {
    static async addItem(productId, quantity, price, total) {
        try {
            const [rows, fields] = await pool.execute(
                'INSERT INTO cartitem (cart_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
                [1, productId, quantity, price, total] // Assuming cart_id is 1 for now, you may need to adjust this according to your application logic
            );
            return rows.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getItems(cartId) {
        try {
            const [rows, fields] = await pool.execute(
                'SELECT * FROM cartitem WHERE cart_id = ?',
                [cartId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async updateSubtotal(cartId) {
        try {
            const [rows, fields] = await pool.execute(
                'UPDATE carts c ' +
                'INNER JOIN (SELECT cart_id, SUM(total) AS sub_total FROM cartitem WHERE cart_id = ? GROUP BY cart_id) ci ' +
                'ON c.id = ci.cart_id ' +
                'SET c.sub_total = ci.sub_total',
                [cartId]
            );
            return rows.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Cart;
