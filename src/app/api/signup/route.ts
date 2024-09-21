// src/app/api/signUp/route.ts
import { NextResponse } from 'next/server';
import { account } from '../../lib/appwrite'; // correct relative path


export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    try {
        const response = await account.create('unique()', email, password, name);
        return NextResponse.json(response, { status: 201 });
    } catch (error: unknown) {
        // Type guard to check if the error is an instance of Error
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        // If it's not an Error object, return a generic error message
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
