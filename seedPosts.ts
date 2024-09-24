import { databases } from '../../src/lib/appwrite'; // Import Appwrite Databases instance

// Sample post data
const samplePosts = [
    {
        $id: '1',
        title: 'Getting Started with Next.js',
        content: 'Next.js is a React framework that enables functionality such as server-side rendering and generating static websites for React-based web applications. In this post, we will explore how to get started with Next.js and build our first application.',
        $createdAt: '2024-09-20T10:00:00Z',
        likes: 10,
    },
    {
        $id: '2',
        title: 'Understanding TypeScript',
        content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. This post covers the basics of TypeScript and how to integrate it into your projects for better type safety and code clarity.',
        $createdAt: '2024-09-21T12:30:00Z',
        likes: 5,
    },
    {
        $id: '3',
        title: 'Exploring Tailwind CSS',
        content: 'Tailwind CSS is a utility-first CSS framework that allows for rapid UI development. In this post, we will dive into its features and how to use Tailwind CSS in your projects.',
        $createdAt: '2024-09-22T09:15:00Z',
        likes: 15,
    },
    {
        $id: '4',
        title: 'Best Practices for React Development',
        content: 'In this article, we discuss some best practices for developing React applications, including component structure, state management, and performance optimization techniques.',
        $createdAt: '2024-09-23T14:45:00Z',
        likes: 8,
    },
    {
        $id: '5',
        title: 'Building RESTful APIs with Django',
        content: 'Django is a powerful web framework that makes it easy to build web applications quickly. This post will cover how to create RESTful APIs using Django and Django Rest Framework.',
        $createdAt: '2024-09-24T11:20:00Z',
        likes: 12,
    },
    {
        $id: '6',
        title: 'Understanding React Hooks',
        content: 'React Hooks allow you to use state and other React features without writing a class. In this post, we will explore the most common hooks and how to use them effectively.',
        $createdAt: '2024-09-25T08:00:00Z',
        likes: 20,
    },
    {
        $id: '7',
        title: 'A Guide to GraphQL',
        content: 'GraphQL is a query language for APIs that allows clients to request only the data they need. This post introduces GraphQL and how it differs from RESTful APIs.',
        $createdAt: '2024-09-26T13:30:00Z',
        likes: 18,
    },
    {
        $id: '8',
        title: 'Introduction to Progressive Web Apps',
        content: 'Progressive Web Apps (PWAs) provide a native app-like experience on the web. This post discusses the benefits of PWAs and how to get started building one.',
        $createdAt: '2024-09-27T15:00:00Z',
        likes: 7,
    },
    {
        $id: '9',
        title: 'Exploring Microservices Architecture',
        content: 'Microservices architecture is an approach to software development where a large application is divided into smaller services. This post covers the advantages and challenges of microservices.',
        $createdAt: '2024-09-28T17:45:00Z',
        likes: 10,
    },
    {
        $id: '10',
        title: 'An Introduction to DevOps',
        content: 'DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). In this post, we explore the key principles of DevOps and how to implement them.',
        $createdAt: '2024-09-29T10:15:00Z',
        likes: 14,
    },
];


// Function to create posts in the database
const createPosts = async () => {
    const databaseId = 'your_database_id'; // Replace with your actual database ID
    const collectionId = 'your_posts_collection_id'; // Replace with your posts collection ID

    for (const post of samplePosts) {
        try {
            await databases.createDocument(databaseId, collectionId, post.$id, post);
            console.log(`Post "${post.title}" created successfully!`);
        } catch (error) {
            console.error(`Error creating post "${post.title}":`, error);
        }
    }
};

// Call the function to create posts
createPosts();
