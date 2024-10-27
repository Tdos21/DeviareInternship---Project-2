const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'bankingSecret',
    resave: false,
    saveUninitialized: true,
}));

// View engine
app.set('view engine', 'ejs');

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/bank', require('./routes/bankRoutes'));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
