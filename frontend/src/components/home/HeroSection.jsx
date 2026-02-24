import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, TrendingUp, Tag } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { getPosts } from '../../utils/demoData';

const TRENDING = ['iPhone 15', 'Honda Activa', 'Software Engineer Jobs', '2BHK Flat', 'MacBook Pro'];

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const { location } = useLocation();
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (val) => {
        setQuery(val);
        if (val.trim().length > 1) {
            const posts = getPosts().filter(p => p.status === 'approved');

            // Build dynamic suggestions (categories + titles)
            const matchedPosts = posts.filter(p => p.title.toLowerCase().includes(val.toLowerCase()) || p.category.toLowerCase().includes(val.toLowerCase()));

            // Group and count by category
            const categories = {};
            matchedPosts.forEach(p => {
                categories[p.category] = (categories[p.category] || 0) + 1;
            });

            const dropdown = [];
            // Push matched categories first
            Object.keys(categories).forEach(cat => {
                if (cat.toLowerCase().includes(val.toLowerCase()) || matchedPosts.some(p => p.category === cat)) {
                    dropdown.push({ type: 'category', text: cat, count: categories[cat] });
                }
            });

            // Push top specific post titles
            matchedPosts.slice(0, 4).forEach(p => {
                dropdown.push({ type: 'post', text: p.title, id: p._id });
            });

            setSuggestions(dropdown);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
        setShowSuggestions(false);
    };

    // Array of collage-style category background images for the carousel
    const BG_IMAGES = [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80", // Tech/Shopping
        "https://images.unsplash.com/photo-1542496658-e325027419a4?w=1600&q=80", // Real Estate/Cars
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&q=80"  // Jobs/Office
    ];

    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(prev => (prev + 1) % BG_IMAGES.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            className="relative overflow-hidden bg-gray-900 transition-all duration-1000 ease-in-out"
            style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(13, 31, 45, 0.75), rgba(10, 25, 47, 0.85)), url('${BG_IMAGES[bgIndex]}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Animated background shapes overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-overlay">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,1) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
                <div className="text-center mb-10 animate-slide-up">
                    {location && (
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full px-4 py-1.5 text-sm mb-5 border border-white/15">
                            <MapPin className="h-3.5 w-3.5" />
                            Showing ads near <span className="font-semibold">{location.city}</span>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                        List, Buy & Sell Anything
                        <br />
                        <span className="text-yellow-300">Near You</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto">
                        India's premium location-based classified platform — jobs, cars, electronics, real estate & more.
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-3xl mx-auto animate-slide-up relative" ref={searchRef}>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl relative z-20">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for jobs, cars, properties..."
                                className="w-full bg-white text-gray-900 py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/30 text-base shadow-sm font-medium"
                                value={query}
                                onChange={e => handleSearchChange(e.target.value)}
                                onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0"
                        >
                            <Search className="h-5 w-5" /> Search
                        </button>
                    </form>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden z-30 animate-slide-up">
                            {suggestions.length > 0 ? (
                                <ul className="py-2">
                                    {suggestions.map((sug, i) => (
                                        <li key={i}>
                                            <button
                                                onClick={() => {
                                                    if (sug.type === 'category') {
                                                        navigate(`/category/${sug.text}`);
                                                    } else {
                                                        navigate(`/post/${sug.id}`);
                                                    }
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full text-left px-5 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <span className="flex items-center gap-3 text-sm text-gray-700 font-medium group-hover:text-primary">
                                                    {sug.type === 'category' ? <Tag className="h-4 w-4 text-gray-400" /> : <Search className="h-4 w-4 text-gray-400" />}
                                                    <span className={sug.type === 'category' ? 'capitalize' : ''}>{sug.text}</span>
                                                </span>
                                                {sug.type === 'category' && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md group-hover:bg-primary/10 group-hover:text-primary">{sug.count} results</span>}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-5 text-center text-sm text-gray-500">
                                    No direct matches found. Press search to see all results.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Trending searches */}
                    <div className="flex flex-wrap items-center gap-2 mt-5 justify-center">
                        <div className="flex items-center gap-1.5 text-white/70 text-sm">
                            <TrendingUp className="h-4 w-4 text-yellow-400" />
                            <span>Trending:</span>
                        </div>
                        {TRENDING.map(t => (
                            <button
                                key={t}
                                onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                                className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-full border border-white/15 transition-all duration-200 backdrop-blur-sm"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    {[
                        { label: 'Active Ads', value: '50,000+' },
                        { label: 'Cities Covered', value: '500+' },
                        { label: 'Verified Sellers', value: '20,000+' },
                        { label: 'Categories', value: '100+' },
                    ].map(stat => (
                        <div key={stat.label} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
                            <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                            <div className="text-blue-200/80 text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
