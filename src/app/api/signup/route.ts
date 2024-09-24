import { NextResponse } from 'next/server';
import { account, databases, Permission, Role } from '../../lib/appwrite';

// Appwrite constants
const DATABASE_ID = '66ee6792001cc251b751';  // Replace with your actual Database ID
const DEVELOPERS_COLLECTION_ID = '66f125020038b0271d36';  // Replace with your actual Developers Collection ID

export async function POST(req: Request) {
    const { email, password, name, bio, location, website, github } = await req.json();

    try {
        // Step 1: Create the user account in Appwrite Users collection
        const accountResponse = await account.create('unique()', email, password, name);

        // Log the account response to make sure the user is created successfully
        console.log('Account created:', accountResponse);

        // Step 2: Store additional profile information in the Developers collection
        const developerId = accountResponse.$id; // Get the unique user ID from the account creation

        const developerProfile = {
            developer_id: developerId,     // Foreign key linking this profile to the created user
            name: name,
            bio: bio,
            email: email,
            password: password,
            location: location,
            website: website,
            github: github
        };

        // Insert the developer profile data into the Developers collection
        const profileResponse = await databases.createDocument(
            DATABASE_ID,
            DEVELOPERS_COLLECTION_ID,
            'unique()',          // Unique document ID
            developerProfile,
            [
                Permission.read(Role.any()),  // Only the developer can read their profile
                Permission.update(Role.any()), // Only the developer can update their profile
                Permission.delete(Role.any())  // Only the developer can delete their profile
            ]
        );

        // Log the profile response to confirm document creation
        console.log('Profile created:', profileResponse);

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
