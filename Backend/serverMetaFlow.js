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

// Serve static files from 'public' directory
app.use(express.static('public'));

// Route to fetch user data
app.get('/user', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const user = await User.findOne({ username });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
