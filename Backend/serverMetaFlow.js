const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://forcesspecial801:oCqg7zZg0MA95I5b@cluster777.atoevuq.mongodb.net/NT', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  displayName: String
});

const User = mongoose.model('User', userSchema);

app.use(express.static('public')); // Ensure this does not conflict with API routes

// Middleware to set Content-Type for JSON responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});


// Route to fetch user data
app.get('/user', async (req, res) => {
    const username = req.query.username;
    console.log('Request received for username:', req.query.username);

    if (!username) {
      console.log('username required');
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const user = await User.findOne({ username });

        if (user) {
            res.json(user);
            console.log('Sending JSON:', user);
        } else {
            res.status(404).json({ error: 'User not found' });
            console.log('user not found');
        }
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user data' });
        console.log('error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
