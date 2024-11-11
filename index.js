const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
