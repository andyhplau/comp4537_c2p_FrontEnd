const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to serve stats page
app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

// Route to serve bot page
app.get('/bot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bot.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
