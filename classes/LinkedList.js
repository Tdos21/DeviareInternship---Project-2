const Node = require('./Node');

class LinkedList {
    constructor() {
        this.head = null;
    }

    // Add a node to the linked list
    append(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    // Find a node in the linked list
    find(accountNumber) {
        let current = this.head;
        while (current) {
            if (current.data.accountNumber === accountNumber) {
                return current.data;
            }
            current = current.next;
        }
        return null;
    }

    getAdminByEmail(email) {
        let currentNode = this.head;
        
        // Traverse the linked list
        while (currentNode !== null) {
            if (currentNode.data.email === email) {
                return currentNode.data; // Return the admin data if email matches
            }
            currentNode = currentNode.next;
        }
    
        // If the email isn't found, return null or undefined
        return null;
    }


    getAllAccounts() {
        const accounts = [];
        let current = this.head;
        while (current) {
            accounts.push(current.account); // Add account to the array
            current = current.next; // Move to the next node
        }
        return accounts; // Return the array of accounts
    }


    add(account) {
        const node = new Node(account);
        if (!this.head) {
            this.head = node; // If the list is empty, set head to the new node
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next; // Traverse to the last node
            }
            current.next = node; // Add the new node at the end
        }
        this.size++; // Increment the size of the list
    }
}

module.exports = LinkedList;
