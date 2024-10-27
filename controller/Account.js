class Account {
    constructor(accountNumber, holderName, balance = 0) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = balance;
    }

    // Method to withdraw funds, returns true if successful
    withdraw(amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false; // Insufficient funds
    }

    // Method to deposit funds
    deposit(amount) {
        this.balance += amount;
    }
}

// Example usage:
const bank = new Bank();
const account1 = new Account("1234567890", "John Doe", 1500);
const account2 = new Account("0987654321", "Jane Smith", 2500);

bank.accounts.push(account1, account2);

if (bank.transferFunds("1234567890", "0987654321", 500)) {
    console.log("Transfer successful!");
} else {
    console.log("Transfer failed!");
}