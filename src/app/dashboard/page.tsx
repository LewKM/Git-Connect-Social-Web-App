'use client';

import { useState, useEffect, useRef } from 'react';
import { databases } from '../lib/appwrite'; // Import Appwrite Databases instance
import Link from 'next/link';

// Define Post type for TypeScript
interface Post {
    $id: string;
    title: string;
    content: string;
    $createdAt: string;
    likes?: number;
}

export default function LandingPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [limit] = useState<number>(5); // Number of posts per fetch
    const [offset, setOffset] = useState<number>(0); // Offset for pagination
    const [hasMore, setHasMore] = useState<boolean>(true); // Infinite scroll condition
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Fetch posts from the Appwrite backend
    const fetchPosts = async () => {
        if (!hasMore) return;

        try {
            setLoading(true);
            const response = await databases.listDocuments(
                'databaseId', // Replace with your database ID
                'postsCollectionId', // Replace with your posts collection ID
                [], // Filters (optional)
                limit, // Limit
                offset // Offset for pagination
            );

            if (response.documents.length === 0) {
                setHasMore(false);
            } else {
                setPosts(prevPosts => [...prevPosts, ...response.documents as unknown as Post[]]);
                setOffset(prevOffset => prevOffset + limit);
            }
        } catch (err) {
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    // Infinite scroll logic
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading) {
                fetchPosts();
            }
        }
    };

    useEffect(() => {
        fetchPosts(); // Initial fetch
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [loading, hasMore]);

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
                        <Link href="/profile" className=" text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-gray-700 hover:text-orange-600">
                            Profile
                        </Link>
                        <button className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 text-gray-700 hover:text-orange-600">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl mx-auto p-4 overflow-y-auto mt-16" ref={scrollRef}>
                <h1 className="text-3xl font-bold mb-6 text-white-900 text-center relative z-10">
                    Latest Posts
                </h1>

                {/* Posts */}
                {loading ? (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.$id}
                            className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 relative z-10 transition-transform transform hover:scale-105"
                        >
                            <h2 className="text-2xl font-semibold text-blue-500 mb-2">
                                {post.title}
                            </h2>
                            <p className="text-gray-300 mb-4">{post.content}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-400">
                                    {new Date(post.$createdAt).toLocaleDateString()}
                                </span>
                                <div className="text-blue-500 text-sm">
                                    {post.likes || 0} Likes
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-300 text-center relative z-10">
                        No posts available.
                    </p>
                )}

                {/* Error Message */}
                {error && showError && (
                    <p className={`animate-ping text-red-600 text-center mt-4 transition-all duration-300 transform ${showError ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        {error}
                    </p>
                )}

            </div>

            {/* Fixed Footer */}
            <footer className="bg-gray-900 shadow-lg sticky top-0 z-50 p-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} GitConnect. All Rights Reserved.</p>
                    <Link href="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> | 
                    <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
                </div>
            </footer>
        </div>
    );
}
