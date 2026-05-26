import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { FormEvent } from 'react'
import { api } from '../api/axios'
import { jwtDecode } from "jwt-decode";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);

            const decoded = jwtDecode<{ username: string }>(response.data.token);

            navigate('/dashboard', {
                state: { username: decoded.username }
            });

        } catch (error) {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl"
            >
                <h1 className="text-3xl font-light tracking-tight text-center mb-2">
                    Welcome back
                </h1>

                <p className="text-center text-white/50 text-sm mb-8">
                    Sign in to continue
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-500/90 hover:bg-blue-500 transition text-white font-medium"
                >
                    Login
                </button>

                <p className="text-center mt-6 text-sm text-white/50">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-400 hover:text-blue-300 transition"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;