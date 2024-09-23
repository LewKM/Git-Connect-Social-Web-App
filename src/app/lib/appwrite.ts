// lib/appwrite.ts
import { Client, Account, Databases, Storage, Permission, Role } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('66edfdd5002e0a4843be'); // Your Project ID

// Initialize the services you will use
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Export the Permission and Role classes
export { client, account, databases, storage, Permission, Role };
