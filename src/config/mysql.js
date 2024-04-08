const mysql = require('mysql');
module.exports = (app) => {
    // MySQL database connection configuration
    const connection = mysql.createConnection({
        host: 'localhost', 
        user: 'root', 
        password: '', 
        database: 'cart' 
    });

    // Connect to MySQL
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database:', err.stack);
            return;
        }
        console.log('Connected to MySQL database as id', connection.threadId);
    });

    // Handle cleanup on process exit
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('SIGHUP', cleanup);

    if (app) {
        app.set('mysqlConnection', connection);
    }
};

function cleanup() {
    // Close MySQL connection and exit process
    connection.end(function (err) {
        if (err) {
            console.error('Error closing MySQL connection:', err.stack);
            return;
        }
        console.log('MySQL connection closed');
        process.exit(0);
    });
}
