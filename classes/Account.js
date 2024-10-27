class Account {
    constructor(accountNumber, balance = 0) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    deposit(amount) {
        this.balance += amount;
    }

    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false; // Insufficient funds
    }

    getBalance() {
        return this.balance;
    }
}

module.exports = Account;
