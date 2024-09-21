/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('User logged in:', data);
        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-login-bg bg-cover bg-center">
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="relative z-10 bg-white bg-opacity-90 shadow-xl rounded-lg p-8 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-center mb-6">
                    Log In
                </h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="Enter your password"
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-60 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-full font-semibold transition-transform transform hover:scale-105 hover:shadow-lg ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </div>
                <p className="text-center text-white mt-6">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-orange-500 hover:underline ">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
