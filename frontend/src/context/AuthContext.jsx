import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

/* ── Demo accounts (work offline) ──────────────────── */
const DEMO_ADMINS = {
    'admin@marketplace.com': { password: 'Admin@123456', _id: 'demo_super_admin_001', fullName: 'Super Admin', email: 'admin@marketplace.com', phone: '9000000000', role: 'super_admin', cityName: 'Mumbai', isEmailVerified: true, isApproved: true, isActive: true, posts: 0, joined: '2026-01-01' },
    'cityadmin@marketplace.com': { password: 'City@123456', _id: 'demo_city_admin_001', fullName: 'City Admin — Mumbai', email: 'cityadmin@marketplace.com', phone: '9100000000', role: 'city_admin', cityName: 'Mumbai', isEmailVerified: true, isApproved: true, isActive: true, posts: 0, joined: '2026-01-15' },
};
const DEMO_TOKEN_PREFIX = 'DEMO_TOKEN_';
const isDemoToken = (t) => t?.startsWith(DEMO_TOKEN_PREFIX);

const setAxios = (token) => {
    axios.defaults.baseURL = 'http://localhost:5000/api';
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
};

/* ── Persistent registered users in sessionStorage ── */
const USERS_KEY = 'marketplace_registered_users';

const getRegisteredUsers = () => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
};
const saveRegisteredUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registeredUsers, setRegisteredUsers] = useState(getRegisteredUsers);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAxios(token);
            if (isDemoToken(token)) {
                try { setUser(JSON.parse(localStorage.getItem('demo_user') || 'null')); } catch { }
                setLoading(false);
            } else {
                axios.get('/auth/me')
                    .then(r => setUser(r.data.data))
                    .catch(() => { localStorage.removeItem('token'); setAxios(null); })
                    .finally(() => setLoading(false));
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        // Demo admin login (offline)
        const demo = DEMO_ADMINS[email.toLowerCase()];
        if (demo && demo.password === password) {
            const { password: _, ...safe } = demo;
            const token = DEMO_TOKEN_PREFIX + safe._id + '_' + Date.now();
            localStorage.setItem('token', token);
            localStorage.setItem('demo_user', JSON.stringify(safe));
            setAxios(token);
            setUser(safe);
            return { user: safe, isDemo: true };
        }
        // Check locally-registered demo users
        const localUsers = getRegisteredUsers();
        const localUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u._password === password);
        if (localUser) {
            const { _password, ...safe } = localUser;
            const token = DEMO_TOKEN_PREFIX + safe._id + '_' + Date.now();
            localStorage.setItem('token', token);
            localStorage.setItem('demo_user', JSON.stringify(safe));
            setAxios(token);
            setUser(safe);
            return { user: safe, isDemo: true };
        }
        // Real backend
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.removeItem('demo_user');
            setAxios(res.data.token);
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            if (!err.response) {
                const e = new Error();
                e.response = { data: { message: 'Invalid email or password. Please check your credentials and try again.' } };
                throw e;
            }
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('demo_user');
        setAxios(null);
        setUser(null);
    };

    // Called from Register.jsx to persist new users locally
    const addDemoUser = (newUser) => {
        const users = getRegisteredUsers();
        const exists = users.find(u => u.email === newUser.email);
        if (!exists) {
            const withPass = { ...newUser, _password: newUser._password || '' };
            users.push(withPass);
            saveRegisteredUsers(users);
            setRegisteredUsers([...users]);
        }
    };

    // Called from admin dashboard to get all registered + demo users
    const getAllUsers = () => {
        const locals = getRegisteredUsers().map(u => { const { _password, ...s } = u; return s; });
        const admins = Object.values(DEMO_ADMINS).map(({ password: _, ...s }) => s);
        const all = [...admins, ...locals];
        // Deduplicate by email
        const seen = new Set();
        return all.filter(u => { if (seen.has(u.email)) return false; seen.add(u.email); return true; });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser, addDemoUser, getAllUsers, registeredUsers }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
