const LinkedList = require('../classes/LinkedList');
const Account = require('../classes/Account');


class Bank {
    constructor() {
        this.accounts = []; // Store all accounts
    }

    // Generate a unique 10-digit account number
    generateAccountNumber() {
        let accountNumber;
        do {
            accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        } while (this.accounts.some(account => account.accountNumber === accountNumber));
        return accountNumber;
    }

    accountExists(accountNumber) {
        return this.accounts.some(account => account.accountNumber === accountNumber);
    }

    createAccount({ name, email, password }) {
        const accountNumber = this.generateAccountNumber();
        const newAccount = { accountNumber, name, email, password, balance: 0.0 };
        this.accounts.push(newAccount);
        return newAccount;
    }


    findAccount(accountNumber) {
        // Ensure the accountNumber is a string if that’s how your accounts are stored
        return this.accounts.find(account => account.accountNumber === accountNumber);
    }

    getAccount(accountNumber) {
        return this.accounts.find(account => account.accountNumber === accountNumber);
    }

    transferFunds(fromAccountNumber, toAccountNumber, amount) {
        const fromAccount = this.findAccount(fromAccountNumber);
        const toAccount = this.findAccount(toAccountNumber);
    
        // Ensure both accounts exist and check for sufficient funds
        if (fromAccount && toAccount && fromAccount.balance >= amount) {
            fromAccount.balance -= amount;  // Deduct from sender
            toAccount.balance += amount;     // Add to recipient
            return true;  // Transfer successful
        }
        return false;  // Transfer failed
    }

    
    checkBalance(accountNumber) {
        const account = this.findAccount(accountNumber);
        if (account) {
            return account.getBalance();
        }
        return null;  // Account not found
    }

    authenticate(accountNumber, password) {
        const user = this.accounts.find(acc => acc.accountNumber === accountNumber && acc.password === password);
        return user || null; // Return user if found, otherwise null
    }

    getBalance(accountNumber) {
        const account = this.accounts.find(account => account.accountNumber === accountNumber);
        return account ? account.balance : null; // Return balance if account exists, otherwise null
    }
  
   

    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false; // Insufficient funds
    }

}

module.exports = Bank;
