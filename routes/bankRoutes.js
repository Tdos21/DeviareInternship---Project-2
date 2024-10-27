const express = require('express');
const router = express.Router();
const Bank = require('../controllers/Bank');
const bank = new Bank();  // Create bank instance

// Check balance route
router.get('/balance', (req, res) => {
    const accountNumber = req.session.accountNumber;
    const balance = bank.checkBalance(accountNumber);
    if (balance !== null) {
        res.render('balance', { balance });
    } else {
        res.status(404).send('Account not found.');
    }
});

// Transfer funds route
router.post('/transfer', (req, res) => {
    const { fromAccount, toAccount, amount } = req.body;
    const transferSuccessful = bank.transferFunds(fromAccount, toAccount, parseFloat(amount));
    if (transferSuccessful) {
        res.redirect('/bank/balance');
    } else {
        res.status(400).send('Transfer failed. Insufficient funds or invalid account.');
    }
});

module.exports = router;
