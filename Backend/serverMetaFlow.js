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

// Serve static files
app.use(express.static('public'));

// Route to fetch user data
app.get('/user', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        await client.connect();
        const database = client.db('NT');
        const users = database.collection('Users');
        const user = await users.findOne({ username });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user data' });
    } finally {
        await client.close();
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
