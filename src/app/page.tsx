'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="relative min-h-screen bg-signup-bg bg-cover bg-center text-white">
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            
            {/* Hero Section */}
            <header className="relative z-10 flex flex-col items-center justify-center h-screen px-4 text-center">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                    Welcome to GitConnect!
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-xl">
                    A platform where developers connect, share ideas, collaborate on projects, and help each other grow.
                </p>
                <div className="flex space-x-4">
                    <Link href="/signup">
                        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold transition-transform transform hover:scale-105 hover:shadow-lg">
                            Sign Up Now
                        </button>
                    </Link>
                    <Link href="/login">
                        <button className="bg-white text-black px-8 py-4 rounded-full font-semibold transition-transform transform hover:scale-105 hover:shadow-lg">
                            Log In
                        </button>
                    </Link>
                </div>
            </header>

            {/* Features Section */}
            <section className="relative z-10 bg-gray-900 py-16 px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-10 text-white">Why GitConnect?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-blue-500">Collaborate</h3>
                            <p className="text-gray-400">
                                Work together with developers from around the globe on exciting open-source projects.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-blue-500">Learn</h3>
                            <p className="text-gray-400">
                                Improve your skills by interacting with experienced developers and gaining new insights.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-semibold mb-4 text-blue-500">Grow</h3>
                            <p className="text-gray-400">
                                Build your portfolio, showcase your work, and get feedback to grow as a developer.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="relative z-10 py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-center text-white">
                <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                <p className="text-lg mb-8">
                    Join GitConnect and become a part of a thriving community of developers today!
                </p>
                <Link href="/signup">
                    <button className="bg-white text-black px-10 py-4 rounded-full font-semibold transition-transform transform hover:scale-105 hover:shadow-lg">
                        Join Now
                    </button>
                </Link>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-10 bg-gray-800 text-center text-gray-400">
                <p>© 2024 GitConnect. All rights reserved.</p>
                <p>Made with 💙 by developers, for developers.</p>
            </footer>
        </div>
    );
}
