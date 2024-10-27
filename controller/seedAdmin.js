const bcrypt = require('bcrypt');
const Admin = require('./Admin'); // Adjust path to your Admin class
const admin = new Admin();


async function createAdmin() {
    const plaintextPassword = '1111'; // Use the plaintext password directly
    const admin1 = new Admin('AdminName', 'admin@example.com', plaintextPassword);
    admin.createAdmin(admin1);
}

createAdmin().then(() => {
    console.log('Admin created successfully');
    process.exit();
}).catch(error => {
    console.error('Error creating admin:', error);
    process.exit(1);
});
