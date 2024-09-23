'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [website, setWebsite] = useState('');
    const [github, setGithub] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignUp = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    bio,
                    location,
                    website,
                    github
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const data = await response.json();
            console.log('User signed up:', data);
            window.alert('User signed up successfully!');
        } catch (error) {
            console.error('Error signing up:', error);
            setErrorMessage('Error signing up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-signup-bg bg-cover bg-center flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            
            <div className="relative z-10 bg-gray-900 bg-opacity-90 shadow-2xl rounded-xl p-8 max-w-lg w-full text-white">
                {/* Heading */}
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center mb-8">
                    Create Your Account
                </h1>

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
                        {errorMessage}
                    </div>
                )}

                {/* Name Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Enter your full name"
                    />
                </div>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Enter a strong password"
                    />
                </div>

                {/* Bio Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Tell us about yourself"
                    />
                </div>

                {/* Location Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Enter your location"
                    />
                </div>

                {/* Website Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Enter your website URL"
                    />
                </div>

                {/* GitHub Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">GitHub Profile</label>
                    <input
                        type="url"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        placeholder="Enter your GitHub profile URL"
                    />
                </div>

                {/* Sign-Up Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className={`w-60 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:shadow-lg ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>

                {/* Log In Redirect */}
                <p className="text-center text-white mt-6">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-orange-500 hover:underline ">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
