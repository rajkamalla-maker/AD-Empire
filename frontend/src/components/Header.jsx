import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, PlusCircle, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

const Header = ({ onOpenCitySelector }) => {
    const { user, logout } = useAuth();
    const { location } = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="bg-white shadow-soft sticky top-0 z-40 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo & Location */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                M
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-gray-900 hidden sm:block">
                                Ad Empire 360
                            </span>
                        </Link>

                        <button
                            onClick={onOpenCitySelector}
                            className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors bg-gray-50 py-2 px-3 rounded-lg border border-gray-100 hover:border-primary/30"
                        >
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium truncate max-w-[120px]">
                                {location ? location.city : 'Select City'}
                            </span>
                        </button>
                    </div>

                    {/* Right Navigation */}
                    <div className="hidden md:flex items-center space-x-6">

                        <Link to="/post-ad" className="btn-primary flex items-center space-x-2 animate-fade-in group">
                            <PlusCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span>Post Free Ad</span>
                        </Link>

                        {user ? (
                            <div className="relative group flex items-center space-x-3 cursor-pointer p-2 border border-transparent rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-gray-800">{user.fullName.split(' ')[0]}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden">
                                    {user.avatar?.url ? (
                                        <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                            {user.fullName.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Dropdown menu */}
                                <div className="absolute top-full right-0 w-48 bg-white rounded-xl shadow-premium border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="p-2 space-y-1">
                                        <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span>My Profile</span>
                                        </Link>
                                        {(user.role === 'admin' || user.role === 'super_admin') && (
                                            <Link to="/admin" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">
                                                <User className="h-4 w-4 text-purple-400" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <button onClick={logout} className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 text-red-600 text-sm font-medium transition-colors">
                                            <LogOut className="h-4 w-4 text-red-500" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-gray-600 hover:text-primary font-medium px-2 py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-outline text-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button onClick={onOpenCitySelector} className="text-primary hover:bg-primary/5 p-2 rounded-lg">
                            <MapPin className="h-5 w-5" />
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-primary transition-colors">
                            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-slide-up shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        {user ? (
                            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-bold">{user.fullName.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{user.fullName}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex space-x-3 pb-4 border-b border-gray-100">
                                <Link to="/login" className="flex-1 btn-outline text-center" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="flex-1 btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                            </div>
                        )}

                        <Link to="/post-ad" className="btn-primary w-full flex justify-center items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                            <PlusCircle className="h-5 w-5" />
                            <span>Post Free Ad</span>
                        </Link>

                        {user && (
                            <>
                                <Link to="/profile" className="w-full py-2 text-left text-gray-700 font-medium flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                                    <User className="h-5 w-5" />
                                    <span>My Profile</span>
                                </Link>
                                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full py-2 text-left text-red-600 font-medium flex items-center space-x-2 mt-2">
                                    <LogOut className="h-5 w-5 text-red-500" />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
