const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cart'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const productQuery = 'SELECT * FROM products WHERE id = ?';
        connection.query(productQuery, [productId], async (err, productResult) => {
            if (err) {
                console.error('Error executing product query:', err);
                return res.status(500).json({
                    error: "Something went wrong"
                });
            }

            const productDetails = productResult[0];
            if (!productDetails) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            const cartQuery = 'SELECT * FROM carts LIMIT 1';
            connection.query(cartQuery, async (err, cartResult) => {
                if (err) {
                    console.error('Error executing cart query:', err);
                    return res.status(500).json({
                        error: "Something went wrong"
                    });
                }

                let cart = cartResult[0];
                const item = {
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    total: productDetails.price * quantity
                };

                if (!cart) {
                    const cartData = {
                        items: JSON.stringify([item]),
                        sub_total: item.total
                    };
                    const insertCartQuery = 'INSERT INTO carts SET ?';
                    connection.query(insertCartQuery, cartData, (err, insertResult) => {
                        if (err) {
                            console.error('Error inserting cart:', err);
                            return res.status(500).json({
                                error: "Something went wrong"
                            });
                        }
                        cart = { id: insertResult.insertId, ...cartData };
                        res.status(200).json({
                            data: cart
                        });
                    });
                } else {
                    const items = JSON.parse(cart.items);
                    const existingItemIndex = items.findIndex(item => item.productId === productId);
                    if (existingItemIndex !== -1) {
                        items[existingItemIndex].quantity += quantity;
                        items[existingItemIndex].total = items[existingItemIndex].quantity * productDetails.price;
                    } else {
                        items.push(item);
                    }
                    const subTotal = items.reduce((acc, item) => acc + item.total, 0);
                    const updateCartQuery = 'UPDATE carts SET items = ?, sub_total = ? WHERE id = ?';
                    connection.query(updateCartQuery, [JSON.stringify(items), subTotal, cart.id], (err, updateResult) => {
                        if (err) {
                            console.error('Error updating cart:', err);
                            return res.status(500).json({
                                error: "Something went wrong"
                            });
                        }
                        cart.items = items;
                        cart.sub_total = subTotal;
                        res.status(200).json({
                            data: cart
                        });
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error in adding item to cart:', error);
        res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cartQuery = 'SELECT * FROM carts LIMIT 1';
        connection.query(cartQuery, (err, result) => {
            if (err) {
                console.error('Error executing cart query:', err);
                return res.status(500).json({
                    error: "Something went wrong"
                });
            }
            const cart = result[0];
            if (!cart) {
                return res.status(404).json({
                    error: "Cart not found"
                });
            }
            res.status(200).json({
                data: cart
            });
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            error: "Something went wrong"
        });
    }
};

exports.emptyCart = async (req, res) => {
    try {
        const emptyCartQuery = 'UPDATE carts SET items = "[]", sub_total = 0';
        connection.query(emptyCartQuery, (err, result) => {
            if (err) {
                console.error('Error emptying cart:', err);
                return res.status(500).json({
                    error: "Something went wrong"
                });
            }
            res.status(200).json({
                message: "Cart has been emptied"
            });
        });
    } catch (error) {
        console.error('Error emptying cart:', error);
        res.status(500).json({
            error: "Something went wrong"
        });
    }
};
