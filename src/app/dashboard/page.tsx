'use client';

import { useState, useEffect, useRef } from 'react';
import { databases } from '@/lib/appwrite'; // Import Appwrite Databases instance
import Link from 'next/link';

export default function LandingPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(5); // Number of posts per fetch
    const [offset, setOffset] = useState(0); // Offset for pagination
    const [hasMore, setHasMore] = useState(true); // Infinite scroll condition
    const scrollRef = useRef(null);

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
                setPosts(prevPosts => [...prevPosts, ...response.documents]);
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

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-lg sticky top-0 z-50 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        GitConnect
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                            Profile
                        </Link>
                        <button className="text-gray-700 hover:text-blue-600">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div
                className="flex-1 max-w-4xl mx-auto p-4 overflow-y-auto"
                ref={scrollRef}
            >
                <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
                    Latest Posts
                </h1>

                {/* Posts */}
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.$id}
                            className="bg-white rounded-lg shadow-md p-6 mb-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {post.title}
                            </h2>
                            <p className="text-gray-700">{post.content}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-500">
                                    {new Date(post.$createdAt).toLocaleDateString()}
                                </span>
                                <div className="text-blue-600 text-sm">
                                    {post.likes || 0} Likes
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 text-center">
                        No posts to display yet.
                    </p>
                )}

                {/* Loading Spinner */}
                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}
