const express = require('express');
const router = express.Router();
const Bank = require('../controller/Bank');
const Admin = require('../controller/Admin');
const AdminManager = require('../controller/adminManager');
const bank = new Bank();
const admin  = new Admin();
const adminInstance = new Admin();
const LinkedList = require('../classes/LinkedList');
const accountList = new LinkedList();
const flash = require('connect-flash');
const app = express();

router.use(flash());

// Check balance route
router.get('/balance', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); // Redirect to login if not authenticated
    }

    const user = req.session.user;
    const balance = bank.getBalance(user.accountNumber); // Use bank instance to get balance

    res.render('balance', { balance }); // Render balance page with balance data
});

router.get('/balance', (req, res) => {
    const accountNumber = req.session.user.accountNumber;
    const balance = bank.getBalance(accountNumber);

    if (balance === null) {
        return res.render('error', { error: 'Account not found' });
    }

    res.render('balance', { balance });
});

// Transfer route (GET: show form, POST: process transfer)
router.get('/transfer', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    res.render('transfer'); // Render the transfer form
});

// Define the initiateFundsToUser function
// function initiateFundsToUser(user, amount, req) {
//     user.balance = amount;
//     req.session.user = user;
//     console.log(`Funds initiated. User's balance is now ${req.session.user.balance}`);
// }

// Admin route to initiate funds
router.post('/transfer', (req, res) => {
    const { recipientAccountNumber, amount } = req.body;
    const sender = req.session.user;

    // Log initial session user balance to debug
    console.log("Sender data at transfer start:", sender);
    console.log(`Sender balance before transfer: ${sender.balance}`);

    // Convert the amount to a number
    const transferAmount = parseFloat(amount);
    console.log(`Transfer amount: ${transferAmount}`);

    // Validation for amount
    if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.send('Please enter a valid transfer amount.');
    }

    // Ensure the sender's balance is a number for comparison
    if (typeof sender.balance !== 'number') {
        console.log(`Incorrect balance type: ${typeof sender.balance}`);
        return res.send('Invalid sender balance. Please check your account.');
    }

    // Check if the sender has sufficient funds
    if (sender.balance < transferAmount) {
        console.log(`Insufficient funds: Sender balance is ${sender.balance}`);
        return res.send(`Insufficient funds. Your current balance is ${sender.balance}`);
    }

    // Retrieve recipient account details
    const recipient = bank.getAccount(recipientAccountNumber);
    if (!recipient) {
        return res.send('Recipient account not found.');
    }

    // Perform the transfer using the bank instance
    const transferSuccessful = bank.transferFunds(sender.accountNumber, recipientAccountNumber, transferAmount);

    if (!transferSuccessful) {
        return res.send('Transfer could not be completed. Please try again.');
    }

    // Update sender's balance after successful transfer
    sender.balance -= transferAmount; // Deduct the transferred amount from sender's balance
    req.session.user.balance = sender.balance; // Update the session with the new balance

    // Log balance after transfer for debugging
    console.log(`Balance after transfer: ${req.session.user.balance}`);

    // Redirect to home after successful transfer
    res.redirect('/bank/home');
});




router.get('/login', (req, res) => {
    res.render('login', { error: null }); // Pass error as null initially
});

// POST login route: Authenticates the user
router.post('/login', (req, res) => {
    const { accountNumber, password } = req.body;

    // Use the bank instance to authenticate the user (assuming bank.authenticate returns user data or null)
    const user = bank.authenticate(accountNumber, password);

    if (!user) {
        // If authentication fails, re-render the login form with an error message
        return res.render('login', { error: 'Invalid account number or password' });
    }

    // If successful, store the user in the session and redirect to the bank home page
    req.session.user = user;

    res.redirect('/bank/home'); // Redirect to the bank home page after successful login
});

router.get('/register', (req, res) => {
    res.render('register', { error: null }); // Initially pass error as null
});

// POST register route: Handles user registration
// Registration route
router.post('/register', (req, res) => {
    const { password, confirmPassword, name, email } = req.body;

    if (password !== confirmPassword) {
        return res.render('register', { error: 'Passwords do not match' });
    }

    // Check if an account already exists with the given email
    if (bank.accounts.some(account => account.email === email)) {
        return res.render('register', { error: 'An account with this email already exists' });
    }

    const newUser = bank.createAccount({ name, email, password });
    if (!newUser) {
        return res.render('register', { error: 'Failed to create account. Please try again.' });
    }

    req.session.user = newUser;
    res.redirect('/bank/home');
});


router.get('/logout', (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        if (err) {
            return res.render('error', { error: 'Failed to log out. Please try again.' });
        }
        
        // Redirect to the login page after successful logout
        res.redirect('/auth/login');
    });
});

router.get('/session-data', (req, res) => {
    if (req.session.user) {
        // If the user is logged in, display session data
        res.json({
            message: 'User session data',
            session: req.session.user
        });
    } else {
        // If the user is not logged in
        res.json({ message: 'No user session found' });
    }
});



router.post('/adminLogin', async (req, res) => {
    const { email, password } = req.body; // Ensure you're capturing these values

    // Retrieve the admin by email
    const admin = adminInstance.authenticate(email , password);
    if (!admin) {
        return res.status(401).send('Admin not found');
    }

    if (email === 'admin@example.com' && password === '1111') {
        // Simulate successful login
        req.session.admin = { name: 'AdminName', email: 'admin@example.com' };
        return res.redirect('/admin/dashboard');
    }
    // Compare the password (no hashing, just direct comparison)
    if (admin.password === password) {
        req.flash('success_msg', 'You are now logged in!');
        req.session.admin = admin;
        res.redirect('/admin/dashboard');
         
    } else {
        req.flash('error_msg', 'Invalid email or password!');
        res.redirect('/auth/adminLogin');
    }
});

function initiateFundsToUser(user, amount, req) {
    user.balance = amount;  // Set the balance for the user
    req.session.user = user; // Update the session with the user
    console.log(`Funds initiated. User's balance is now ${req.session.user.balance}`);
}


router.post('/adminInitiate-funds', (req, res) => {
    const { accountNumber, amount } = req.body;

    // Assuming userId corresponds to accountNumber, you might want to adjust this logic
    const user = bank.getAccount(accountNumber);
    const initialAmount = parseFloat(amount);

    if (user) {
        // Set the balance for the user
        user.balance = (user.balance || 0) + initialAmount; // Ensure we add to existing balance
        req.session.user = user; // Update the session
        console.log(`Funds initiated. User's balance is now ${req.session.user.balance}`);
        res.send(`Funds successfully initiated. User's balance is now ${req.session.user.balance}`);
    } else {
        res.send(`Account number ${accountNumber} not found. Please check the number and try again.`);
    }
});

    // account.balance += initialAmount; // Update the account balance

    // // Update the user’s balance in the session
    // req.session.user = user; // Update the session to reflect changes

    // // Call the function to set the user's initial balance if needed
    // initiateFundsToUser(user, initialAmount, req);// Make sure the user's balance is updated in the session

    // message = `Successfully added ${amount} to account ${accountNumber}.`;

    // res.send(`Funds successfully initiated. User's balance is now ${req.session.user.balance}`);

    // Render the initiateFunds view with the feedback message
   

router.get('/adminLogin', (req, res) => {
    res.render('adminLogin'); // Render the admin login view
});


// Admin Registration Page
router.get('/adminRegister', (req, res) => {
    res.render('adminRegister'); // Render the admin registration view
});

// Admin Registration Logic
router.post('/adminRegister', (req, res) => {
    const { name, email, password } = req.body;

    // Here you would implement the logic to create a new admin account
    // For example, save the admin to the database or in memory
    const newAdmin = admin.createAdmin({name,email,password}); // Assuming Admin class is defined
    // Add the admin to the bank or some storage system

    if (newAdmin) {
        res.redirect('/auth/adminLogin'); // Redirect to admin login after successful registration
    } else {
        res.render('adminRegister', { error: 'Failed to register admin. Please try again.' });
    }
});

router.get('/adminLogout', (req, res) => {
    // Destroy the session for the admin
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/adminDashboard'); // Redirect back to dashboard if error occurs
        }
        // Redirect to login page after successful logout
        res.redirect('/adminLogin');
    });
});

router.get('/adminInitiate-funds', (req, res) => {
    // Check if admin is logged in
    if (!req.session.admin) {
        return res.redirect('/adminLogin'); // Redirect to login if not authenticated
    }
    
    // Render the initiate funds form view
    res.render('initiateFunds', { error: null });
});

accountList.add({ accountNumber: '1234567890', holderName: 'John Doe', balance: 1500.00 });
accountList.add({ accountNumber: '0987654321', holderName: 'Jane Smith', balance: 2500.50 });

router.get('/viewAccounts', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/auth/adminLogin'); // Redirect if admin is not logged in
    }

    // Call the getAllAccounts method to retrieve all accounts
    const accounts = accountList.getAllAccounts();

    // Render the view with the retrieved accounts
    res.render('viewAccounts', { accounts });
});

router.use((req, res) => {
    res.status(404).send('Resource not found'); // Handle 404 errors
});

router.use((req, res, next) => {
    console.log(req.session); // Check if session is initialized
    next();
});


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
module.exports = router;
