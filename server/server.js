const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser=require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../src/app/services/middleware');
const crypto = require('crypto'); 

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'root', // replace with your MySQL password
    database: 'store'
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to database');
});

// GET all items
app.get('/api/products', (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// GET 
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;  // Get 'id' from the route parameter

    connection.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).send(err); // Handle any query errors
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found'); // Handle case where no product was found
        }
        res.json(results[0]); // Send the first result (as only one product should be returned)
    });
});



//Login
const JWT_SECRET = crypto.randomBytes(32).toString('hex');  

app.post('/api/login/:id', (req, res) => {
  const { id } = req.params; 
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE id = ?';  
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0]; 

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Password matches, generate a JWT token
      const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: '1h' });

      // Send the token back to the client
      res.json({ message: 'Login successful', token: token });
    });
  });
});




// POST 
app.post('/api/products', (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    // Check if required fields are missing
    if (!name || !description || !price || !imageUrl) {
        return res.status(400).send('Missing required fields');
    }

    connection.query('INSERT INTO products (name, description, price, imageUrl) VALUES (?,?,?,?)', 
    [name, description, price, imageUrl], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: results.insertId, name, description, price, imageUrl });
    });
});

//Registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the hashed password into the database, NOT the plain password
        connection.query('INSERT INTO users (username, password) VALUES (?, ?)', 
            [username, hashedPassword], (err, results) => {
                if (err) {
                    return res.status(500).send(err);  // Handle database error
                }
                // Send a response after successfully inserting the user
                res.status(201).json({
                    id: results.insertId,  // Return the user ID generated in the DB
                    username,
                    message: 'User registered successfully',
                });
            });

    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});
  

// PUT 
app.put('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, price, imageUrl } = req.body;

    // Check if required fields are missing
    if (!name || !description || !price || !imageUrl) {
        return res.status(400).send('Missing required fields');
    }

    connection.query('UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?', 
    [name, description, price, imageUrl, id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.affectedRows === 0) return res.status(404).send('Product not found');
        res.json({ id, name, description, price, imageUrl });
    });
});

// DELETE 
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.affectedRows === 0) return res.status(404).send('Product not found');
        res.status(204).send();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
