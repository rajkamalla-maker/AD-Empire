import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

const USERS_KEY = 'marketplace_registered_users';

const DEMO_ADMINS = {
    'admin@marketplace.com': true,
    'cityadmin@marketplace.com': true,
};

const getRegisteredUsers = () => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
};

const saveRegisteredUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0=enter email, 1=reset password, 2=success
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [foundUser, setFoundUser] = useState(null);

    // Step 1: Verify email exists
    const handleVerifyEmail = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) return setError('Please enter your email address.');

        const emailLower = email.toLowerCase().trim();

        // Check demo admins
        if (DEMO_ADMINS[emailLower]) {
            setFoundUser({ email: emailLower, isAdmin: true });
            setStep(1);
            return;
        }

        // Check registered users
        const users = getRegisteredUsers();
        const user = users.find(u => u.email.toLowerCase() === emailLower);

        if (!user) {
            return setError('No account found with this email address. Please check and try again.');
        }

        setFoundUser(user);
        setStep(1);
    };

    // Step 2: Set new password
    const handleResetPassword = (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 8) {
            return setError('Password must be at least 8 characters long.');
        }

        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match. Please re-enter.');
        }

        setLoading(true);

        // Simulate a small delay
        setTimeout(() => {
            if (foundUser.isAdmin) {
                // Can't reset demo admin passwords in this demo
                setLoading(false);
                setError('Admin passwords cannot be reset in demo mode. Contact the system administrator.');
                return;
            }

            // Update the password in localStorage
            const users = getRegisteredUsers();
            const updatedUsers = users.map(u => {
                if (u.email.toLowerCase() === foundUser.email.toLowerCase()) {
                    return { ...u, _password: newPassword };
                }
                return u;
            });

            saveRegisteredUsers(updatedUsers);
            setLoading(false);
            setStep(2);
        }, 1000);
    };

    // Step 3: Success
    if (step === 2) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white rounded-2xl shadow-premium p-10 max-w-md w-full text-center animate-slide-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful! 🔐</h2>
                    <p className="text-gray-500 mb-2">Your password has been updated for <strong>{email}</strong>.</p>
                    <p className="text-sm text-gray-400 mb-8">You can now sign in with your new password.</p>
                    <Link to="/login" className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
                        <KeyRound className="h-5 w-5" /> Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center bg-gradient-to-br from-primary via-[#1374bc] to-[#0a4a7c] p-12">
                <div className="flex items-center gap-2 mb-16">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-2xl">M</div>
                    <span className="font-bold text-2xl text-white">Marketplace</span>
                </div>
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        {[
                            { label: 'Enter Email', active: step === 0, done: step > 0 },
                            { label: 'New Password', active: step === 1, done: step > 1 },
                            { label: 'Done', active: step === 2, done: false },
                        ].map((s, i) => (
                            <div key={s.label} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${s.done ? 'bg-green-400 border-green-400 text-white' : s.active ? 'bg-white border-white text-primary' : 'bg-transparent border-white/30 text-white/40'}`}>
                                    {s.done ? '✓' : i + 1}
                                </div>
                                <span className={`text-sm font-medium ${s.active ? 'text-white' : s.done ? 'text-green-300' : 'text-white/40'}`}>{s.label}</span>
                                {i < 2 && <div className="w-8 h-0.5 bg-white/20 mx-1"></div>}
                            </div>
                        ))}
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Reset Your Password</h2>
                <p className="text-blue-100/90 text-lg">Enter your registered email to verify your account, then create a new secure password.</p>

                <div className="mt-10 space-y-3">
                    {['Your data remains safe and encrypted', 'Password is updated instantly', 'Login immediately after reset'].map(f => (
                        <div key={f} className="flex items-center gap-3 text-blue-100/80 text-sm">
                            <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
                            {f}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                <div className="w-full max-w-md animate-slide-up">
                    <div className="bg-white rounded-2xl shadow-premium p-8">

                        {/* Step 0: Enter Email */}
                        {step === 0 && (
                            <>
                                <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 text-sm">
                                    <ArrowLeft className="h-4 w-4" /> Back to Login
                                </Link>

                                <div className="text-center mb-8">
                                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <KeyRound className="h-7 w-7 text-orange-500" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
                                    <p className="text-gray-500 text-sm mt-2">Enter the email you registered with and we'll let you reset it.</p>
                                </div>

                                {error && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                        <span className="text-red-500">⚠</span> {error}
                                    </div>
                                )}

                                <form onSubmit={handleVerifyEmail} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your registered email"
                                            className="input-field pl-10"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            autoFocus
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
                                        <Mail className="h-5 w-5" /> Verify Email
                                    </button>
                                </form>

                                <p className="text-center text-sm text-gray-400 mt-6">
                                    Remember your password? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                                </p>
                            </>
                        )}

                        {/* Step 1: Create New Password */}
                        {step === 1 && (
                            <>
                                <button onClick={() => { setStep(0); setError(''); setNewPassword(''); setConfirmPassword(''); }} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 text-sm">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </button>

                                <div className="text-center mb-8">
                                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Lock className="h-7 w-7 text-green-600" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">Create New Password</h1>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Account verified for <strong className="text-gray-800">{email}</strong>
                                    </p>
                                </div>

                                <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                    <span className="text-sm text-green-700 font-medium">Email verified successfully!</span>
                                </div>

                                {error && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                        <span className="text-red-500">⚠</span> {error}
                                    </div>
                                )}

                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Minimum 8 characters"
                                                className="input-field pl-10 pr-10"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                required
                                                minLength={8}
                                                autoFocus
                                            />
                                            <button type="button" className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Re-enter your new password"
                                                className="input-field pl-10"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                        {confirmPassword && newPassword && (
                                            <p className={`text-xs mt-1.5 flex items-center gap-1 ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                                {newPassword === confirmPassword ? (
                                                    <><CheckCircle className="h-3.5 w-3.5" /> Passwords match</>
                                                ) : (
                                                    <>⚠ Passwords do not match</>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password strength indicator */}
                                    {newPassword && (
                                        <div className="space-y-1.5">
                                            <p className="text-xs text-gray-500 font-medium">Password strength:</p>
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3, 4].map(i => {
                                                    const strength = (newPassword.length >= 8 ? 1 : 0) + (/[A-Z]/.test(newPassword) ? 1 : 0) + (/[0-9]/.test(newPassword) ? 1 : 0) + (/[^A-Za-z0-9]/.test(newPassword) ? 1 : 0);
                                                    const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
                                                    return <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength ? colors[strength - 1] : 'bg-gray-200'}`} />;
                                                })}
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                                                <span className={newPassword.length >= 8 ? 'text-green-600' : ''}>8+ chars</span>
                                                <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>Uppercase</span>
                                                <span className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>Number</span>
                                                <span className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''}>Special char</span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                                        className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <><span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating Password...</>
                                        ) : (
                                            <><ShieldCheck className="h-5 w-5" /> Reset Password</>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
