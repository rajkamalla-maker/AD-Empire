import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, Lock, Eye, EyeOff,
    MapPin, UserPlus, CheckCircle, MessageSquare, RefreshCw, ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/* ─── Demo OTP (replace with MSG91 / Twilio in prod) ─── */
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
let DEMO_OTP = '';

const STEPS = ['Account Info', 'Verify Phone', 'Done'];

const Register = () => {
    const navigate = useNavigate();
    const { addDemoUser, login } = useAuth();

    const [step, setStep] = useState(0); // 0=form, 1=otp, 2=success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [sentOtp, setSentOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const otpRefs = useRef([]);

    const [form, setForm] = useState({
        fullName: '', email: '', phone: '', password: '',
        confirmPassword: '', cityName: '', state: '',
    });
    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // ── Step 1: Send OTP ─────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.fullName || !form.email || !form.phone || !form.password || !form.cityName) {
            return setError('Please fill all required fields.');
        }
        if (!/^[0-9]{10}$/.test(form.phone)) {
            return setError('Enter a valid 10-digit mobile number.');
        }
        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (form.password.length < 8) {
            return setError('Password must be at least 8 characters.');
        }

        setLoading(true);
        DEMO_OTP = generateOTP();
        setSentOtp(DEMO_OTP);

        // Simulate SMS delay
        await new Promise(r => setTimeout(r, 1200));

        // For DEMO: show OTP in a non-intrusive banner
        console.log(`📱 OTP for ${form.phone}: ${DEMO_OTP}`);
        setLoading(false);
        setStep(1);

        // Countdown resend timer
        setResendTimer(30);
        const timer = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) { clearInterval(timer); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    // ── OTP input handling ───────────────────────────────────────────
    const handleOtpChange = (val, idx) => {
        if (!/^[0-9]?$/.test(val)) return;
        const digits = [...otpDigits];
        digits[idx] = val;
        setOtpDigits(digits);
        if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    };
    const handleOtpKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
            otpRefs.current[idx - 1]?.focus();
        }
    };

    // ── Step 2: Verify OTP & Register ───────────────────────────────
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        const enteredOtp = otpDigits.join('');
        if (enteredOtp.length < 6) return setError('Enter the 6-digit OTP.');

        if (enteredOtp !== sentOtp) {
            return setError('Incorrect OTP. Please try again.');
        }

        setLoading(true);
        try {
            // Try real backend first
            await axios.post('/auth/register', {
                fullName: form.fullName, email: form.email, phone: form.phone,
                password: form.password, cityName: form.cityName, state: form.state,
                isPhoneVerified: true,
            });
        } catch {
            // Demo mode: store locally
            if (addDemoUser) {
                addDemoUser({
                    _id: 'user_' + Date.now(),
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    _password: form.password,
                    cityName: form.cityName,
                    state: form.state || form.cityName,
                    role: 'user',
                    isApproved: true,
                    isEmailVerified: false,
                    isPhoneVerified: true,
                    isActive: true,
                    posts: 0,
                    joined: new Date().toISOString().slice(0, 10),
                });
            }
        }

        // Auto-login the user immediately
        try {
            await login(form.email, form.password);
        } catch {
            // If auto-login fails, still show success
        }

        setLoading(false);
        setStep(2);
    };

    const handleResendOtp = () => {
        if (resendTimer > 0) return;
        DEMO_OTP = generateOTP();
        setSentOtp(DEMO_OTP);
        console.log(`📱 Resent OTP for ${form.phone}: ${DEMO_OTP}`);
        setResendTimer(30);
        const timer = setInterval(() => {
            setResendTimer(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
        }, 1000);
    };

    // ── Success Screen — auto-redirect to home ──────────────────────
    if (step === 2) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="bg-white rounded-2xl shadow-premium p-10 max-w-md w-full text-center animate-slide-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Marketplace! 🎉</h2>
                    <p className="text-gray-500 mb-2">Your account is ready, <strong>{form.fullName}</strong>!</p>
                    <p className="text-sm text-gray-400 mb-8">You are now logged in and can start posting ads immediately.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/post-ad" className="btn-primary flex-1 py-3 text-center">Post Your First Ad</Link>
                        <Link to="/" className="btn-outline flex-1 py-3 text-center">Explore Marketplace</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-2/5 flex-col justify-center bg-gradient-to-br from-primary via-[#1374bc] to-[#0a4a7c] p-12">
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-2xl">M</div>
                    <span className="font-bold text-2xl text-white">Marketplace</span>
                </div>
                {/* Stepper */}
                <div className="mb-10">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i < step ? 'bg-green-400 border-green-400 text-white' : i === step ? 'bg-white border-white text-primary' : 'bg-transparent border-white/30 text-white/40'}`}>
                                {i < step ? '✓' : i + 1}
                            </div>
                            <span className={`text-sm font-medium ${i === step ? 'text-white' : i < step ? 'text-green-300' : 'text-white/40'}`}>{s}</span>
                        </div>
                    ))}
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Join India's Biggest Local Marketplace</h2>
                <ul className="space-y-3 mt-4">
                    {['Post free ads instantly', 'Connect with local buyers', 'Get OTP-verified badge', 'Trusted admin-approved platform'].map(f => (
                        <li key={f} className="flex items-center gap-3 text-blue-100/90 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-400 shrink-0" /> {f}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-lg animate-slide-up py-8">

                    {/* ── STEP 0: Registration Form ─────────────────────────── */}
                    {step === 0 && (
                        <div className="bg-white rounded-2xl shadow-premium p-8">
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <UserPlus className="h-7 w-7 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Create your free account</h1>
                                <p className="text-gray-500 text-sm mt-2">Already registered? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link></p>
                            </div>

                            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2"><span>⚠</span> {error}</div>}

                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input name="fullName" type="text" placeholder="Full Name *" className="input-field pl-10" value={form.fullName} onChange={handle} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input name="email" type="email" placeholder="Email *" className="input-field pl-10" value={form.email} onChange={handle} required />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input name="phone" type="tel" placeholder="10-digit Mobile *" maxLength={10} className="input-field pl-10" value={form.phone} onChange={handle} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input name="cityName" type="text" placeholder="City *" className="input-field pl-10" value={form.cityName} onChange={handle} required />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                        <input name="state" type="text" placeholder="State" className="input-field pl-10" value={form.state} onChange={handle} />
                                    </div>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password (min. 8 chars) *" className="input-field pl-10 pr-10" value={form.password} onChange={handle} required />
                                    <button type="button" className="absolute right-3 top-3.5 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password *" className="input-field pl-10" value={form.confirmPassword} onChange={handle} required />
                                </div>
                                <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" required className="accent-primary mt-0.5 shrink-0" />
                                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                </label>
                                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60">
                                    {loading ? <><span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP...</> : <><MessageSquare className="h-5 w-5" /> Send OTP to Mobile</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ── STEP 1: OTP Verification ──────────────────────────── */}
                    {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-premium p-8">
                            <button onClick={() => { setStep(0); setOtpDigits(['', '', '', '', '', '']); setError(''); }} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 text-sm">
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="h-7 w-7 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Verify Your Mobile</h2>
                                <p className="text-gray-500 text-sm mt-2">
                                    A 6-digit OTP was sent to <strong className="text-gray-800">+91 {form.phone}</strong>
                                </p>
                                {/* Demo helper */}
                                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 inline-block">
                                    <p className="text-amber-700 text-xs font-medium flex items-center gap-2">
                                        📱 Demo OTP: <span className="text-2xl font-mono font-bold text-amber-800 tracking-widest">{sentOtp}</span>
                                    </p>
                                </div>
                            </div>

                            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">Enter OTP</label>
                                    <div className="flex gap-3 justify-center">
                                        {otpDigits.map((d, i) => (
                                            <input
                                                key={i}
                                                ref={el => otpRefs.current[i] = el}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={d}
                                                onChange={e => handleOtpChange(e.target.value, i)}
                                                onKeyDown={e => handleOtpKeyDown(e, i)}
                                                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-500">
                                    {resendTimer > 0 ? (
                                        <span>Resend OTP in <strong className="text-primary">{resendTimer}s</strong></span>
                                    ) : (
                                        <button type="button" onClick={handleResendOtp} className="text-primary font-semibold hover:underline flex items-center gap-1 mx-auto">
                                            <RefreshCw className="h-3.5 w-3.5" /> Resend OTP
                                        </button>
                                    )}
                                </div>

                                <button type="submit" disabled={loading || otpDigits.join('').length < 6} className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60">
                                    {loading ? <><span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</> : <><CheckCircle className="h-5 w-5" /> Verify & Create Account</>}
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Register;
