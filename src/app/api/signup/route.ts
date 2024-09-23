import { NextResponse } from 'next/server';
import { account, databases, Permission, Role } from '../../lib/appwrite';

// Appwrite constants
const DATABASE_ID = '66ee6792001cc251b751';  // Replace with your actual Database ID
const DEVELOPERS_COLLECTION_ID = '66f125020038b0271d36';  // Replace with your actual Developers Collection ID

export async function POST(req: Request) {
    const { email, password, name, bio, location, website, github } = await req.json();

    try {
        // Step 1: Create the user account
        const accountResponse = await account.create('unique()', email, password, name);

        // Step 2: Store additional profile information in the Developers collection
        const developerId = accountResponse.$id; // Get the unique user ID from the account creation
        const developerProfile = {
            developer_id: developerId,     // Foreign key linking this profile to the created user
            name: name,
            bio: bio,
            location: location,
            website: website,
            github: github,
        };

        // Insert the developer profile data into the Developers collection
        const profileResponse = await databases.createDocument(
            DATABASE_ID,
            DEVELOPERS_COLLECTION_ID,
            'unique()',          // Unique document ID
            developerProfile,
            [
                Permission.read(Role.any()),                  // Anyone can read this document
                Permission.update(Role.user(developerId)),    // Only the developer can update their profile
                Permission.delete(Role.user(developerId))     // Only the developer can delete their profile
            ]
        );

        // Return a successful response with both account and profile creation data
        return NextResponse.json({ account: accountResponse, profile: profileResponse }, { status: 201 });
    } catch (error: unknown) {
        console.error('Sign up error:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
}
