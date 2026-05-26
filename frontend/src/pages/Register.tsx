import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { FormEvent } from 'react'
import { api } from '../api/axios'
import { MessageSquare, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/signup', { username, email, password });
            navigate('/login');
        } catch (err: any) {
            const msg = err?.response?.data?.message;
            setError(msg ?? 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#050a14] text-white overflow-hidden items-center justify-center px-4">

            {/* Ambient glow */}
            <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-blue-600/[0.08] blur-[80px]" />
            <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[180px] h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

                {/* Card */}
                <div className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 backdrop-blur-sm">
                    <h1 className="text-2xl font-light tracking-tight text-center mb-1">
                        Register an account
                    </h1>

                    <form onSubmit={handleRegister} className="flex flex-col gap-3">
                        {/* Username */}
                        <div className="relative">
                            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.03] transition-all duration-200"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.03] transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.03] transition-all duration-200"
                            />
                        </div>

                        {/* Confirm password */}
                        <div className="relative">
                            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirm}
                                required
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-blue-500/[0.03] transition-all duration-200"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-400/80 text-xs px-1">{error}</p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 active:scale-[0.98] transition-all duration-150 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? <Loader2 size={15} className="animate-spin" />
                                : <>Create account <ArrowRight size={14} /></>
                            }
                        </button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-xs text-white/30">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;