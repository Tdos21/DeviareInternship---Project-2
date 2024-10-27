const LinkedList = require('../classes/LinkedList');
const Account = require('../classes/Account');
const Bank = require('./Bank');
const bank = new Bank();

class Admin {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.admins = [];
    }

    authenticate(email, password) {
        const admin = this.getAdmin(email); // Call directly on this instance
        if (!admin) {
            return { error: 'Admin not found' };
        }
        if (admin.password !== password) {
            return { error: 'Incorrect password' };
        }
        return { success: 'Authenticated' };
    }

    initiateFunds(accountNumber, amount) {
        // Assuming bank is accessible here
        const account = bank.accounts.find(acc => acc.accountNumber === accountNumber);
        if (!account) {
            return 'Account not found';
        }
        account.balance += amount;
        return `Funds successfully added to account ${accountNumber}. New balance: ${account.balance}`;
    }

    createAdmin({ name, email, password }) {
        const admin = { id: this.admins.length + 1, name, email, password, role: 'admin' };
        this.admins.push(admin);
        return admin;
    }

    getAdmin(email) {
        return this.admins.find(admin => admin.email === email);
    }

    // Method to validate login for admin
    // getAdminByEmail(email) {
    //     console.log('Checking for admin with email:', email);
    //     return this.admins.find(admin => admin.email === email);
    // }

    // addAdmin(admin) {
    //     this.admins.push(admin);
    // }

    
}


class AdminManager {
    constructor() {
        this.admins = []; // An array to hold admin instances
    }

    addAdmin(admin) {
        this.admins.push(admin);
    }

    getAdminByEmail(email) {
        return this.admins.find(admin => admin.email === email);
    }
}

// Usage
const adminManager = new AdminManager();
const newAdmin = new Admin('AdminName', 'admin@example.com', 'adminPassword');
adminManager.addAdmin(newAdmin);
// const adminManager = new Admin();
// const admin1 = new Admin('AdminName', 'admin@example.com', 'hashedAdminPassword');
// adminManager.addAdmin(admin1);

module.exports = Admin;
