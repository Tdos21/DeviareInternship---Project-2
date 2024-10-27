const LinkedList = require('../classes/LinkedList');
const Account = require('../classes/Account');
const Admin = require('./Admin')


class AdminManager {
    constructor() {
        this.admins = []; // An array to hold admin instances
    }

    addAdmin(admin) {
        this.admins.push(admin);
    }

    getAdmin(email) {
        return this.admins.find(admin => admin.email === email);
    }
}

// Usage
const adminManager = new AdminManager();
const newAdmin = new Admin('AdminName', 'admin@example.com', '1111');
adminManager.addAdmin(newAdmin);
// const adminManager = new Admin();
// const admin1 = new Admin('AdminName', 'admin@example.com', 'hashedAdminPassword');
// adminManager.addAdmin(admin1);

module.exports = AdminManager;
