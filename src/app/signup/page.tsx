'use client';

import { useState } from 'react';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();
            console.log('User signed up:', data);
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-signup-bg bg-cover bg-center" >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="relative z-10 bg-transparent bg-opacity-90 shadow-xl rounded-lg p-8 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center mb-6">
                    Sign Up
                </h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-white-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Enter your password"
                    />
                </div>
                <button
                    onClick={handleSignUp}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                    Sign Up
                </button>
                <p className="text-center text-white-700 mt-4">
                    Already have an account? 
                    <a href="/login" className="text-orange-500 hover:underline"> Login</a>
                </p>
            </div>
        </div>
    );
}
