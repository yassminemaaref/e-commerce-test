const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql'); 
const app = express();
app.use('/files', express.static("files"));
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

require('./routerHandler')(app)
// Register MySQL configuration
require('./config/mysql.js')(app);

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

// Define your routes
app.get('/', (req, res) => {
  res.json({
    message: 'Arise MERN developers'
  });
});

// Start the Express server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Application is running on ${port}`);
});
