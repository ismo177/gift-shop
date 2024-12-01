// server.js

require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifyToken } = require('./middleware'); // Import the middleware

const app = express();

app.use(express.json());

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secretKey = process.env.SECRET_KEY || generateSecretKey();

// A mock user database for login
const users = [
  { id: 1, username: 'john_doe', password: 'password123' },
  { id: 2, username: 'jane_doe', password: 'mypassword' }
];

// Login route to issue JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the mock database
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token with the user id and username
  const payload = {
    userId: user.id,
    username: user.username
  };

  app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;  // Get 'id' from the route parameter

    connection.query('SELECT * FROM login WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).send(err); // Handle any query errors
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found'); // Handle case where no product was found
        }
        res.json(results[0]); // Send the first result (as only one product should be returned)
    });
});

  // Sign the JWT with the secret key
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  // Send the token to the client
  res.json({ message: 'Login successful', token });
});

// Protected route to verify JWT token using middleware
app.get('/protected', verifyToken, (req, res) => {
  // If middleware allows access, the decoded user will be available here
  res.json({ message: 'Protected resource accessed', user: req.user });
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
