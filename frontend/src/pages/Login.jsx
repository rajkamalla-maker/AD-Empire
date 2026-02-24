import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary via-[#1374bc] to-[#0a4a7c] p-12">
                <div>
                    <div className="flex items-center gap-2 mb-16">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-2xl">M</div>
                        <span className="font-bold text-2xl text-white">Marketplace</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                        Welcome Back to India's #1 Local Marketplace
                    </h2>
                    <p className="text-blue-100/90 text-lg">Access thousands of listings near you, chat with sellers, and post your own ads in minutes.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[['50K+', 'Active Listings'], ['500+', 'Cities'], ['20K+', 'Sellers'], ['100+', 'Categories']].map(([val, label]) => (
                        <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="text-2xl font-bold text-white">{val}</div>
                            <div className="text-blue-200/80 text-sm mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel – Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                <div className="w-full max-w-md animate-slide-up">
                    <div className="bg-white rounded-2xl shadow-premium p-8">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <LogIn className="h-7 w-7 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
                            <p className="text-gray-500 text-sm mt-2">Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register Free</Link></p>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                <span className="text-red-500">⚠</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    className="input-field pl-10"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    className="input-field pl-10 pr-10"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />
                                <button type="button" className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                    <input type="checkbox" className="accent-primary" /> Remember me
                                </label>
                                <Link to="/forgot-password" className="text-primary hover:underline font-medium">Forgot password?</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <><span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                                ) : (
                                    <><LogIn className="h-5 w-5" /> Sign In</>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                            By signing in, you agree to our{' '}
                            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
