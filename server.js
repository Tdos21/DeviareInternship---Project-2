const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
// const bcrypt = require('bcrypt');
const Admin = require('./controller/Admin');
const AdminManager = require('./controller/adminManager');
const admin = new AdminManager();
const flash = require('connect-flash');

const authRoutes = require('./routes/auth'); // Import the auth routes

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use the auth routes
app.use('/auth', authRoutes);

// Root route ("/")
app.get('/', (req, res) => {
    res.redirect('/auth/login'); // Redirect to login or render a homepage
});

// Home route for logged-in users
app.get('/bank/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('home', { user: req.session.user });
});

app.get('/admin/dashboard', (req, res) => {
    if (!req.session.admin) { // Assuming 'admin' is stored in the session after login
        return res.redirect('/auth/adminLogin'); // Redirect to the admin login page
    }
    res.render('adminDashboard', { admin: req.session.admin }); // Render the admin's home page
});

app.use(flash());

// Middleware to make flash messages available in views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

async function createAdmin() {
    const plaintextPassword = '1111'; // Use the plaintext password directly
    const admin1 = new Admin('AdminName', 'admin@example.com', plaintextPassword);
    admin.addAdmin(admin1);
}


// Call createAdmin once during app startup
(async function initializeAdmin() {
    await createAdmin();
    console.log('Admin created at startup');
})();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
