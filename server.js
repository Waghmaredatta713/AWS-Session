const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

// Dummy user for demonstration
const users = [
    { username: "admin", password: "password123" }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // your HTML/CSS files
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// Middleware to protect secure routes
function authMiddleware(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid credentials. <a href="/login.html">Try again</a>');
    }
});

// Protected route
app.get('/dashboard', authMiddleware, (req, res) => {
    res.send(`<h2>Welcome, ${req.session.user.username}!</h2><a href="/logout">Logout</a>`);
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// Start server
app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
});
