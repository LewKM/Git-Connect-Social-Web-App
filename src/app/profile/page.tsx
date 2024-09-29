'use client';

import { useState, useEffect } from 'react';
import { databases, account } from '../lib/appwrite';
import { Query } from 'appwrite';
import { FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { Url } from 'next/dist/shared/lib/router/router';

interface Profile {
$id: string;
name: string;
bio: string;
github: Url;
website: Url;
location: string;
}

interface Education {
$id: string;
institution: string;
degree: string;
year: string;
}

interface WorkExperience {
$id: string;
company: string;
position: string;
years: string;
}

export default function ProfilePage() {
const [profile, setProfile] = useState<Profile | null>(null);
const [education, setEducation] = useState<Education[]>([]);
const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [showError, setShowError] = useState<boolean>(false);
const [isEditingProfile, setIsEditingProfile] = useState(false);
const [editableProfile, setEditableProfile] = useState<Profile | null>(null);
const [isAddingEducation, setIsAddingEducation] = useState(false);
const [newEducation, setNewEducation] = useState<Omit<Education, '$id'>>({ institution: '', degree: '', year: '' })
const [isAddingWorkExperience, setIsAddingWorkExperience] = useState(false);
const [newWorkExperience, setNewWorkExperience] = useState<Omit<WorkExperience, '$id'>>({ company: '', position: '', years: '' });

const fetchData = async () => {
    try {
        const user = await account.get();
        const developerId = user.$id;  // Get the developer_id from the user session
        console.log(user.name);

        // Fetch profile data
        const profileResponse = await databases.listDocuments(
            '66ee6792001cc251b751',
            '66f125020038b0271d36',
            [Query.equal('developer_id', developerId)]
        );

        if (profileResponse.documents.length > 0) {
            const profileDoc = profileResponse.documents[0];
            const profile: Profile = {
                $id: profileDoc.$id,
                name: profileDoc.name,
                bio: profileDoc.bio,
                github: profileDoc.github,
                website: profileDoc.website,
                location: profileDoc.location,
            };

            setProfile(profile);
            setEditableProfile(profile);
        }

        // Fetch education data
        const educationResponse = await databases.listDocuments(
            '66ee6792001cc251b751',
            '66f126000029bb8d8f80',
            [Query.equal('developer_id', developerId)]
        );

        interface EducationDocument {
            $id: string;
            institution: string;
            degree: string;
            year: string;
        }

        const education: EducationDocument[] = educationResponse.documents.map((doc) => ({
            $id: doc.$id,
            institution: doc.institution,
            degree: doc.degree,
            year: doc.year,
        }));

        setEducation(education);

        // Fetch work experience data
        const workExperienceResponse = await databases.listDocuments(
            '66ee6792001cc251b751',
            '66f126d00004b6ae2947',
            [Query.equal('developer_id', developerId)]
        );

        interface WorkExperienceDocument {
            $id: string;
            company: string;
            position: string;
            years: string;
        }

        const workExperience: WorkExperienceDocument[] = workExperienceResponse.documents.map((doc) => ({
            $id: doc.$id,
            company: doc.company,
            position: doc.position,
            years: doc.years,
        }));

        setWorkExperience(workExperience);
        
    } catch (error) {
        setError(`Failed to load profile data: ${error}`);
    } finally {
        setLoading(false);
    }
};


useEffect(() => {
    fetchData();
}, []);

const handleEditProfile = () => {
    setIsEditingProfile(true);
};

const handleSaveProfile = async () => {
    if (editableProfile) {
    try {
        await databases.updateDocument(
        '66ee6792001cc251b751',
        '66f125020038b0271d36',
        editableProfile.$id,
        {
            name: editableProfile.name,
            bio: editableProfile.bio,
            github: editableProfile.github,
            website: editableProfile.website,
            location: editableProfile.location,
        }
        );
        setProfile(editableProfile);
        setIsEditingProfile(false);
    } catch (error) {
        setError(`Failed to update profile: ${error}`);
    }
    }
};

const handleProfileInputChange = (field: keyof Profile, value: string) => {
    setEditableProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
};

const handleAddEducation = async () => {
    try {
    const response = await databases.createDocument(
        '66ee6792001cc251b751',
        '66f126000029bb8d8f80',
        'unique()',
        newEducation
    );
    setEducation([...education, { ...newEducation, $id: response.$id }]);
    setNewEducation({ institution: '', degree: '', year: '' });
    setIsAddingEducation(false);
    } catch (error) {
    setError(`Failed to add education: ${error}`);
    }
};

const handleDeleteEducation = async (id: string) => {
    try {
    await databases.deleteDocument('66ee6792001cc251b751', '66f126000029bb8d8f80', id);
    setEducation(education.filter((edu) => edu.$id !== id));
    } catch (error) {
    setError(`Failed to delete education: ${error}`);
    }
};

const handleAddWorkExperience = async () => {
    try {
    const response = await databases.createDocument(
        '66ee6792001cc251b751',
        '66f126d00004b6ae2947',
        'unique()',
        newWorkExperience
    );
    setWorkExperience([...workExperience, { ...newWorkExperience, $id: response.$id }]);
    setNewWorkExperience({ company: '', position: '', years: '' });
    setIsAddingWorkExperience(false);
    } catch (error) {
        setError(`Failed to add work experience: ${error}`);
    }
};

const handleDeleteWorkExperience = async (id: string) => {
    try {
    await databases.deleteDocument('66ee6792001cc251b751', '66f126d00004b6ae2947', id);
    setWorkExperience(workExperience.filter((work) => work.$id !== id));
    } catch (error) {
        setError(`Failed to delete work experience: ${error}`);
    }
};

useEffect(() => {
    if (error) {
        setShowError(true);
        const timer = setTimeout(() => setShowError(false), 10000); // Hide after 3 seconds
        return () => clearTimeout(timer);
    }
}, [error]);

return (
    <div className="relative min-h-screen bg-signup-bg bg-cover bg-fixed bg-center text-white flex flex-col">
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-95"></div>

        {/* Fixed Top Navigation Bar */}
        <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 p-4 text-">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                GitConnect
            </Link>
            <div className="flex items-center space-x-6">
                <Link href="/profile" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-gray-700 hover:text-orange-600">
                Profile
                </Link>
                <button className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-gray-700 hover:text-orange-600">Logout</button>
            </div>
            </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto p-6 overflow-y-auto mt-16 relative z-10">
            <h1 className="text-4xl font-bold text-white mb-6">Developer Profile</h1>

            {loading ? (
            <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
            ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
            ) : (
            <>
                {/* Profile Section */}
                {profile && (
                <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 w-full">
                    <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-blue-500 mb-2">
                        {isEditingProfile ? (
                        <input
                            type="text"
                            className="bg-gray-700 text-white rounded px-3 py-1"
                            value={editableProfile?.name || ''}
                            onChange={(e) => handleProfileInputChange('name', e.target.value)}
                        />
                        ) : (
                        profile.name
                        )}
                    </h2>
                    <div>
                        {isEditingProfile ? (
                        <FaSave className="text-green-500 cursor-pointer" onClick={handleSaveProfile} />
                        ) : (
                        <FaEdit className="text-blue-400 cursor-pointer" onClick={handleEditProfile} />
                        )}
                    </div>
                    </div>
                    {isEditingProfile ? (
                    <textarea
                        className="bg-gray-700 text-white rounded px-3 py-1 mb-4 w-full"
                        value={editableProfile?.bio || ''}
                        onChange={(e) => handleProfileInputChange('bio', e.target.value)}
                    />
                    ) : (
                    <p className="text-gray-300 mb-4">{profile.bio}</p>
                    )}
                    {isEditingProfile ? (
                        <input
                            type="text"
                            className="bg-gray-700 text-white rounded px-3 py-1 w-full"
                            value={editableProfile?.github.toString() || ''}
                            onChange={(e) => handleProfileInputChange('github', e.target.value)}
                        />
                    ) : (
                        profile.github ? (
                            <a
                                href={profile.github.toString()}
                                target="_blank"
                                className="text-blue-400 underline"
                                rel="noopener noreferrer"
                            >
                                View GitHub
                            </a>
                        ) : (
                            <span className="text-gray-400">No GitHub profile</span>  // Display fallback message
                        )
                    )}
                    {/* Adds the website url */}
                    {isEditingProfile ? (
                        <input
                            type="text"
                            className="bg-gray-700 text-white rounded px-3 py-1 w-full"
                            value={editableProfile?.website.toString() || ''}
                            onChange={(e) => handleProfileInputChange('website', e.target.value)}
                        />
                    ) : (
                        profile.website ? (
                            <a
                                href={profile.website.toString()}
                                target="_blank"
                                className="text-blue-400 underline"
                                rel="noopener noreferrer"
                            >
                                View Website
                            </a>
                        ) : (
                            <span className="text-gray-400">No website</span>  // Display fallback message
                        )
                    )}
                    {/* // Adds the location section */}
                    {isEditingProfile ? (
                        <input
                            type="text"
                            className="bg-gray-700 text-white rounded px-3 py-1 w-full"
                            value={editableProfile?.location || ''}
                            onChange={(e) => handleProfileInputChange('location', e.target.value)}
                        /> 
                    ) : (
                        profile.location ? (
                            <p className="text-gray-300">{profile.location}</p>
                        ) : (
                            <span className="text-gray-400">No location</span>  // Display fallback message
                        )
                    )}

                </div>
                )}

                {/* Education Section */}
                <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-blue-500">Education</h2>
                    <FaPlus
                    className="text-blue-400 cursor-pointer hover:text-blue-600"
                    onClick={() => setIsAddingEducation(true)}
                    />
                </div>
                {education.length > 0 ? (
                    education.map((edu) => (
                    <div key={edu.$id} className="mb-4 flex justify-between items-center">
                        <div>
                        <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                        <p className="text-gray-300">{edu.institution}</p>
                        <p className="text-gray-400">{edu.year}</p>
                        </div>
                        <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteEducation(edu.$id)}
                        />
                    </div>
                    ))
                ) : (
                    <p className="text-gray-400">No education details available.</p>
                )}
                {isAddingEducation && (
                    <div className="mt-4">
                    <input
                        type="text"
                        className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full"
                        placeholder="Institution"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                    />
                    <input
                        type="text"
                        className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full"
                        placeholder="Degree"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    />
                    <input
                        type="text"
                        className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full"
                        placeholder="Year"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                    />
                    <button
                        className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                        onClick={handleAddEducation}
                    >
                        Add Education
                    </button>
                    </div>
                )}
                </div>

                {/* Work Experience Section */}
                <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-blue-500">Work Experience</h2>
                    <FaPlus
                    className="text-blue-400 cursor-pointer hover:text-blue-600"
                    onClick={() => setIsAddingWorkExperience(true)}
                    />
                </div>
                {workExperience.length > 0 ? (
                    workExperience.map((work) => (
                    <div key={work.$id} className="mb-4 flex justify-between items-center">
                        <div>
                        <h3 className="text-lg font-bold text-white">{work.position}</h3>
                        <p className="text-gray-300">{work.company}</p>
                        <p className="text-gray-400">{work.years}</p>
                        </div>
                        <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteWorkExperience(work.$id)}
                        />
                    </div>
                    ))
                ) : (
                    <p className="text-gray-400">No work experience details available.</p>
                )}
                {isAddingWorkExperience && (
                    <div className="mt-4">
                    <input
                        type="text"
                        className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full"
                        placeholder="Company"
                        value={newWorkExperience.company}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, company: e.target.value })}
                    />
                    <input
                        type="text"
                        className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full"
                        placeholder="Position"
                        value={newWorkExperience.position}
                        onChange={(e) => setNewWorkExperience({ ...newWorkExperience, position: e.target.value })}
                    />
                    <input
                        type="text"
                        className="bg-gray-700 text-white rounded px-3 py-1 mb-2 w-full"
                        placeholder="Years"
                            value={newWorkExperience.years}
                            onChange={(e) => setNewWorkExperience({ ...newWorkExperience, years: e.target.value })}
                        />
                        <button
                            className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
                            onClick={handleAddWorkExperience}
                        >
                            Add Work Experience
                        </button>
                        </div>
                    )}
                    </div>
                </>
                )}
                {/* Error Message */}
                {error && showError && (
                    <p className={`animate-ping text-red-600 text-center mt-4 transition-all duration-300 transform ${showError ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        {error}
                    </p>
                )}
            </div>
        
            {/* Fixed Footer */}
            <footer className="bg-gray-900 shadow-lg sticky bottom-0 z-50 p-4">
                <div className="max-w-7xl mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} GitConnect. All Rights Reserved.</p>
                <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> | 
                <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
                </div>
            </footer>
        </div>
    );
}