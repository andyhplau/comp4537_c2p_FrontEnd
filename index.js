const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');

app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(cookieParser());
const bcrypt = require('bcrypt');

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_SECRET = 'your_jwt_secret';
const JWT_EXPIRATION = '1h'; 



// ███████╗ ███████╗ ███████╗ ███████╗ ██╗  ██████╗  ███╗   ██╗ ███████╗
// ██╔════╝ ██╔════╝ ██╔════╝ ██╔════╝ ██║ ██╔═══██╗ ████╗  ██║ ██╔════╝
// ███████╗ █████╗   ███████╗ ███████╗ ██║ ██║   ██║ ██╔██╗ ██║ ███████╗
// ╚════██║ ██╔══╝   ╚════██║ ╚════██║ ██║ ██║   ██║ ██║╚██╗██║ ╚════██║
// ███████║ ███████╗ ███████║ ███████║ ██║ ╚██████╔╝ ██║ ╚████║ ███████║
function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = user;
      next();
    });
  }



// ██████╗  ███████╗ ███████╗  █████╗  ██╗   ██╗ ██╗   ████████╗        ██╗
// ██╔══██╗ ██╔════╝ ██╔════╝ ██╔══██╗ ██║   ██║ ██║   ╚══██╔══╝       ██╔╝
// ██║  ██║ █████╗   █████╗   ███████║ ██║   ██║ ██║      ██║         ██╔╝
// ██║  ██║ ██╔══╝   ██╔══╝   ██╔══██║ ██║   ██║ ██║      ██║        ██╔╝
// ██████╔╝ ███████╗ ██║      ██║  ██║ ╚██████╔╝ ███████╗ ██║       ██╔╝


app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});


// ██╗       ██████╗   ██████╗  ██╗ ███╗   ██╗
// ██║      ██╔═══██╗ ██╔════╝  ██║ ████╗  ██║
// ██║      ██║   ██║ ██║  ███╗ ██║ ██╔██╗ ██║
// ██║      ██║   ██║ ██║   ██║ ██║ ██║╚██╗██║
// ███████╗ ╚██████╔╝ ╚██████╔╝ ██║ ██║ ╚████║
// ╚══════╝  ╚═════╝   ╚═════╝  ╚═╝ ╚═╝  ╚═══╝


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});




//   ██████╗ ███████╗ ██████╗ ██╗███████╗████████╗███████╗██████╗ 
//   ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
//   ██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   █████╗  ██████╔╝
//   ██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══╝  ██╔══██╗
//   ██║  ██║███████╗╚██████╔╝██║███████║   ██║   ███████╗██║  ██║
//   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});



// ██████╗  ██████╗   ██████╗  ████████╗███████╗ ██████╗████████╗███████╗██████╗ 
// ██╔══██╗ ██╔══██╗ ██╔═══██╗ ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗
// ██████╔╝ ██████╔╝ ██║   ██║    ██║   █████╗  ██║        ██║   █████╗  ██║  ██║
// ██╔═══╝  ██╔══██╗ ██║   ██║    ██║   ██╔══╝  ██║        ██║   ██╔══╝  ██║  ██║
// ██║      ██║  ██║ ╚██████╔╝    ██║   ███████╗╚██████╗   ██║   ███████╗██████╔╝
// ╚═╝      ╚═╝  ╚═╝  ╚═════╝     ╚═╝   ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝╚═════╝ 

// app.get('/protected', authenticateToken, (req, res) => {
//     res.status(200).json({ message: `Hello, ${req.user.username}` });
//   });








  app.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logged out successfully' });
  });


// // Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


module.exports = app;