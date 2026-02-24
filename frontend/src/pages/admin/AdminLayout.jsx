import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileText, CreditCard, MapPin,
    Tag, Image, Settings, BarChart2, Bell, LogOut,
    ChevronLeft, ChevronRight, Shield, Menu, Building2, Newspaper
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import {
    AdminPayments, AdminAnalytics, AdminCategories,
    AdminLocations, AdminBanners, AdminSettings, AdminPages, AdminBusinessListings, AdminNewsletter
} from './AdminSubPages';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: FileText, label: 'Posts', path: '/admin/posts' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: Tag, label: 'Categories', path: '/admin/categories' },
    { icon: Building2, label: 'Businesses', path: '/admin/business-listings' },
    { icon: MapPin, label: 'Locations', path: '/admin/locations' },
    { icon: FileText, label: 'Pages', path: '/admin/pages' },
    { icon: Image, label: 'Banners', path: '/admin/banners' },
    { icon: Newspaper, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const { user, loading, login, logout } = useAuth();
    const location = useLocation();
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    if (loading) {
        return (
            <div className="h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // Show admin login form if not authenticated or not an admin role
    if (!user || !['admin', 'super_admin', 'city_admin'].includes(user.role)) {
        const handleAdminLogin = async (e) => {
            e.preventDefault();
            setLoginError('');
            setLoginLoading(true);
            try {
                await login(loginForm.email, loginForm.password);
            } catch (err) {
                setLoginError(err.response?.data?.message || 'Invalid credentials.');
            } finally {
                setLoginLoading(false);
            }
        };

        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 p-8 w-full max-w-md shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-3xl shadow-lg">M</div>
                        <h1 className="text-2xl font-bold text-white">Admin Panel Login</h1>
                        <p className="text-zinc-400 text-sm mt-1">Enter your admin credentials to continue</p>
                    </div>

                    {loginError && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">⚠ {loginError}</div>
                    )}

                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="admin@marketplace.com"
                                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 py-3 px-4 rounded-xl focus:outline-none focus:border-primary text-sm placeholder-zinc-500"
                                value={loginForm.email}
                                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••••"
                                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 py-3 px-4 rounded-xl focus:outline-none focus:border-primary text-sm placeholder-zinc-500"
                                value={loginForm.password}
                                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                            />
                        </div>

                        {/* Quick fill button */}
                        <button
                            type="button"
                            onClick={() => setLoginForm({ email: 'admin@marketplace.com', password: 'Admin@123456' })}
                            className="w-full text-xs text-zinc-500 hover:text-primary bg-zinc-800/50 border border-dashed border-zinc-700 hover:border-primary/50 py-2.5 rounded-xl transition-all"
                        >
                            🔑 Fill Demo Admin Credentials
                        </button>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                        >
                            {loginLoading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                            ) : 'Sign In to Admin Panel'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-zinc-600 mt-6">
                        Admin access required.
                    </p>
                </div>
            </div>
        );
    }

    const SidebarContent = () => (
        <>
            <div className={`flex items-center gap-3 mb-8 ${collapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
                    M
                </div>
                {!collapsed && (
                    <div>
                        <span className="font-bold text-white text-lg leading-none">Ad Empire 360</span>
                        <p className="text-xs text-zinc-400 mt-0.5 font-medium">Admin Panel</p>
                    </div>
                )}
            </div>

            {!collapsed && (
                <div className="bg-zinc-800 rounded-xl p-3 mb-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {user.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                        <p className="text-xs text-zinc-400 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                </div>
            )}

            <nav className="flex-1 space-y-1">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = path === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary text-white shadow-md shadow-primary/30'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                } ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? label : undefined}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
                            {!collapsed && <span className="font-medium text-sm">{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all mt-4 w-full ${collapsed ? 'justify-center' : ''}`}
            >
                <LogOut className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
        </>
    );

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col bg-[#1a2236] border-r border-zinc-800 transition-all duration-300 shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
                <div className="p-5 flex-1 flex flex-col overflow-y-auto">
                    <SidebarContent />
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 border-t border-zinc-800 transition-all flex items-center justify-center"
                >
                    {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 h-full w-72 bg-[#1a2236] border-r border-zinc-800 pt-5 px-5 flex flex-col">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-[#1a2236] border-b border-zinc-800 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="md:hidden text-zinc-400 hover:text-white"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-white font-semibold hidden sm:block">
                            {navItems.find(n =>
                                n.path === '/admin'
                                    ? location.pathname === '/admin'
                                    : location.pathname.startsWith(n.path)
                            )?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-zinc-400 hover:text-white transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                3
                            </span>
                        </button>
                        <Link
                            to="/"
                            className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-3 py-1.5 rounded-lg hover:border-zinc-500 transition-colors"
                        >
                            ← View Site
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 bg-[#0f172a]">
                    <Routes>
                        <Route index element={<AdminOverview />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="posts" element={<AdminPosts />} />
                        <Route path="payments" element={<AdminPayments />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="business-listings" element={<AdminBusinessListings />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="locations" element={<AdminLocations />} />
                        <Route path="pages" element={<AdminPages />} />
                        <Route path="banners" element={<AdminBanners />} />
                        <Route path="newsletter" element={<AdminNewsletter />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
