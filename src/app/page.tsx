// src/app/page.tsx (Your homepage)
import Link from 'next/link';

export default function HomePage() {
    return (
        <div>
            <h1>Welcome to GitConnect!</h1>
            <Link href="/signup">
                <a className="text-blue-500">Go to Sign Up</a>
            </Link>
        </div>
    );
}
