import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Camera, Save, CheckCircle, Edit3, FileText, ArrowLeft } from 'lucide-react';

const USERS_KEY = 'marketplace_registered_users';

const getRegisteredUsers = () => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
};
const saveRegisteredUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const Profile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    const [form, setForm] = useState({
        fullName: '',
        profileName: '',
        email: '',
        phone: '',
        age: '',
        cityName: '',
        state: '',
        address: '',
        password: '',
    });

    useEffect(() => {
        if (!user) return navigate('/login');

        // Load saved profile data
        const savedProfile = JSON.parse(localStorage.getItem(`profile_${user._id}`) || 'null');
        const pic = localStorage.getItem(`profile_pic_${user._id}`);
        if (pic) setProfilePic(pic);

        setForm({
            fullName: savedProfile?.fullName || user.fullName || '',
            profileName: savedProfile?.profileName || user.fullName?.split(' ')[0] || '',
            email: user.email || '',
            phone: savedProfile?.phone || user.phone || '',
            age: savedProfile?.age || '',
            cityName: savedProfile?.cityName || user.cityName || '',
            state: savedProfile?.state || user.state || '',
            address: savedProfile?.address || '',
            password: '',
        });
    }, [user]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handlePicUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setProfilePic(ev.target.result);
            localStorage.setItem(`profile_pic_${user._id}`, ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        // Save to localStorage profile
        const profileData = { ...form };
        delete profileData.password;
        localStorage.setItem(`profile_${user._id}`, JSON.stringify(profileData));

        // Update password if changed
        if (form.password && form.password.length >= 8) {
            const users = getRegisteredUsers();
            const updated = users.map(u => {
                if (u.email.toLowerCase() === user.email.toLowerCase()) {
                    return { ...u, _password: form.password, fullName: form.fullName, phone: form.phone, cityName: form.cityName };
                }
                return u;
            });
            saveRegisteredUsers(updated);
        }

        // Update current user context
        const updatedUser = { ...user, fullName: form.fullName, phone: form.phone, cityName: form.cityName, state: form.state };
        setUser(updatedUser);
        localStorage.setItem('demo_user', JSON.stringify(updatedUser));

        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (!user) return null;

    const initials = (form.fullName || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50 py-10 animate-fade-in">
            <div className="max-w-3xl mx-auto px-4">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                {saved && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
                        <CheckCircle className="h-4 w-4" /> Profile saved successfully!
                    </div>
                )}

                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 h-32 relative"></div>
                    <div className="px-8 pb-6 -mt-14 relative">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            {/* Avatar */}
                            <div className="relative group">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg" />
                                ) : (
                                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                                        {initials}
                                    </div>
                                )}
                                {editing && (
                                    <button
                                        onClick={() => fileRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                    >
                                        <Camera className="h-6 w-6 text-white" />
                                    </button>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePicUpload} />
                            </div>

                            <div className="flex-1 pt-4 sm:pt-8">
                                <h1 className="text-2xl font-bold text-gray-900">{form.fullName}</h1>
                                <p className="text-gray-500 text-sm">@{form.profileName || form.fullName?.toLowerCase().replace(/\s+/g, '')}</p>
                                <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {form.cityName}{form.state ? `, ${form.state}` : ''}</p>
                            </div>

                            <div className="pt-4 sm:pt-8">
                                {!editing ? (
                                    <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
                                        <Edit3 className="h-4 w-4" /> Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
                                            <Save className="h-4 w-4" /> Save
                                        </button>
                                        <button onClick={() => setEditing(false)} className="btn-outline px-4 py-2.5 text-sm border-gray-200">Cancel</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Personal Information</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { name: 'fullName', label: 'Full Name', icon: User, type: 'text' },
                            { name: 'profileName', label: 'Profile Display Name', icon: User, type: 'text' },
                            { name: 'email', label: 'Registered Email', icon: Mail, type: 'email', disabled: true },
                            { name: 'phone', label: 'Contact Number', icon: Phone, type: 'tel' },
                            { name: 'age', label: 'Age', icon: User, type: 'number' },
                            { name: 'cityName', label: 'City / Location', icon: MapPin, type: 'text' },
                            { name: 'state', label: 'State', icon: MapPin, type: 'text' },
                        ].map(field => (
                            <div key={field.name}>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{field.label}</label>
                                <div className="relative">
                                    <field.icon className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        disabled={!editing || field.disabled}
                                        className={`input-field pl-10 text-sm ${!editing || field.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Address - full width */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Full Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                disabled={!editing}
                                rows={2}
                                placeholder="Enter your full address..."
                                className={`input-field pl-10 text-sm resize-none ${!editing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    {editing && (
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Lock className="h-4 w-4" /> Change Password (optional)</h4>
                            <div className="max-w-sm relative">
                                <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="New password (min 8 chars)"
                                    className="input-field pl-10 pr-10 text-sm"
                                    minLength={8}
                                />
                                <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1.5">Leave empty to keep your current password.</p>
                        </div>
                    )}
                </div>

                {/* My Ads section */}
                <div className="mt-6 bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">My Ads</h3>
                    <p className="text-gray-500 text-sm">You can manage your posted ads from here.</p>
                    <Link to="/post-ad" className="btn-primary inline-flex items-center gap-2 mt-4 px-5 py-2.5 text-sm">
                        Post a New Ad
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Profile;
