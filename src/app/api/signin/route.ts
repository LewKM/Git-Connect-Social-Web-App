import { NextResponse } from 'next/server';
import { Client, Account } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('66edfdd5002e0a4843be'); // Your Project ID

const account = new Account(client);

export async function POST(req: Request) {
    const { email, password } = await req.json();

    try {
        // Check if email and password are provided
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        // Create a session for the user
        const sessionResponse = await account.createEmailPasswordSession(email, password);

        // Log the session details (successful sign-in)
        console.log('Session created:', sessionResponse);

        // Return successful response
        return NextResponse.json({ session: sessionResponse }, { status: 200 });
    } catch (error) {
        console.error('Sign-in error:', error);
        
        // Handle specific Appwrite errors
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        
        // Default error response
        return NextResponse.json({ error: 'An unknown error occurred during sign-in' }, { status: 500 });
    }
}
