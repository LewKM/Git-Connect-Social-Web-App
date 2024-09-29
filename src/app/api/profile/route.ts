import { NextRequest, NextResponse } from 'next/server';
import { databases, Permission, Role } from '../../lib/appwrite';
import { ID, Query } from 'appwrite';

// Appwrite constants
const DATABASE_ID = '66ee6792001cc251b751';  // Replace with your actual Database ID
const DEVELOPERS_COLLECTION_ID = '66f125020038b0271d36';  // Replace with your actual Developers Collection ID
const WORK_COLLECTION_ID = '66f126d00004b6ae2947';  // Replace with your actual Work Experience Collection ID
const EDUCATION_COLLECTION_ID = '66f126000029bb8d8f80';  // Replace with your actual Education Collection ID

// Helper function to handle errors
function handleError(error: unknown) {
    console.error('API error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const developerId = searchParams.get('developerId');

    if (!developerId) {
        return NextResponse.json({ error: 'Developer ID is required' }, { status: 400 });
    }

    try {
        // Fetch developer profile
        const profile = await databases.getDocument(DATABASE_ID, DEVELOPERS_COLLECTION_ID, developerId);

        // Fetch work experiences
        const workExperiences = await databases.listDocuments(DATABASE_ID, WORK_COLLECTION_ID, [
            Query.equal('developer_id', developerId)
        ]);

        // Fetch education experiences
        const educationExperiences = await databases.listDocuments(DATABASE_ID, EDUCATION_COLLECTION_ID, [
            Query.equal('developer_id', developerId)
        ]);

        return NextResponse.json({
            profile,
            workExperiences: workExperiences.documents,
            educationExperiences: educationExperiences.documents
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(req: NextRequest) {
    const { type, data } = await req.json();

    if (!type || !data || !data.developer_id) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    try {
        let response;
        const permissions = [
            Permission.read(Role.user(data.developer_id)),
            Permission.update(Role.user(data.developer_id)),
            Permission.delete(Role.user(data.developer_id))
        ];

        switch (type) {
            case 'work_experience':
                response = await databases.createDocument(DATABASE_ID, WORK_COLLECTION_ID, ID.unique(), data, permissions);
                break;
            case 'education':
                response = await databases.createDocument(DATABASE_ID, EDUCATION_COLLECTION_ID, ID.unique(), data, permissions);
                break;
            default:
                return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
        }

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(req: NextRequest) {
    const { type, id, data } = await req.json();

    if (!type || !id || !data) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    try {
        let response;
        switch (type) {
            case 'profile':
                response = await databases.updateDocument(DATABASE_ID, DEVELOPERS_COLLECTION_ID, id, data);
                break;
            case 'work_experience':
                response = await databases.updateDocument(DATABASE_ID, WORK_COLLECTION_ID, id, data);
                break;
            case 'education':
                response = await databases.updateDocument(DATABASE_ID, EDUCATION_COLLECTION_ID, id, data);
                break;
            default:
                return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
        }

        return NextResponse.json(response);
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
        return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 });
    }

    try {
        switch (type) {
            case 'work_experience':
                await databases.deleteDocument(DATABASE_ID, WORK_COLLECTION_ID, id);
                break;
            case 'education':
                await databases.deleteDocument(DATABASE_ID, EDUCATION_COLLECTION_ID, id);
                break;
            default:
                return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
        }
    
        return NextResponse.json({ message: 'Document deleted successfully' });
    } catch (error) {
        return handleError(error);
    }
}