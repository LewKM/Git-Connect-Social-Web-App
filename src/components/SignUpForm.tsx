// components/SignUpForm.tsx
import { useState } from 'react';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await fetch('/api/signUp', {
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
        <div>
            <h1>Sign Up</h1>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpForm;
