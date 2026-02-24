import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Heart, Eye } from 'lucide-react';
import { getPosts } from '../../utils/demoData';
import { timeAgo } from '../../utils/timeAgo';
import { useLocation } from '../../context/LocationContext';

const PostCard = ({ ad }) => (
    <Link to={`/post/${ad._id}`} className="card-premium group overflow-hidden flex flex-col h-[380px] hover:shadow-premium animate-fade-in relative bg-white">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
            <img
                src={ad.images?.[0] || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&q=80'}
                alt={ad.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />
            {/* Overlays */}
            {ad.isFeatured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-gray-900" /> Featured
                </div>
            )}
            <div className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-md capitalize ${ad.condition === 'New' || ad.condition === 'new' ? 'bg-green-500 text-white' : 'bg-gray-700/80 text-white shadow-sm'}`}>
                {ad.adType === 'free' ? 'Free' : ad.condition || 'Used'}
            </div>
            <button
                className="absolute bottom-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500 shadow-md"
                onClick={e => { e.preventDefault(); }}
                aria-label="Save"
            >
                <Heart className="h-4 w-4" />
            </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
            <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{ad.category?.replace('-', ' ')}</p>
            <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-tight mb-2 group-hover:text-primary transition-colors flex-1">{ad.title}</h3>

            <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">
                        {ad.adType === 'free' ? <span className="text-green-500">FREE</span> : `₹${Number(ad.price || 0).toLocaleString('en-IN')}`}
                    </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100/50 text-xs text-gray-400">
                    <span className="flex items-center gap-1 truncate max-w-[45%]">
                        <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{ad.cityName}</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0 text-amber-600/80 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Clock className="h-3 w-3" /> {timeAgo(ad.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    </Link>
);

const FeaturedAds = () => {
    const { location } = useLocation();
    const [recentAds, setRecentAds] = useState([]);

    useEffect(() => {
        // Fetch posts from local storage database
        const posts = getPosts().filter(p => p.status === 'approved' && (!location || p.cityName === location.city));

        // Take latest 8 posts to feature on the homepage
        // Randomly marking some as featured for UI demonstration
        const featured = posts.slice(0, 8).map((p, i) => ({ ...p, isFeatured: i < 3 }));
        setRecentAds(featured);
    }, [location]);

    if (recentAds.length === 0) return null;

    return (
        <section className="py-14 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title="⏳ Fresh Recommendations" subtitle="Just uploaded items in your city" link="/search" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {recentAds.map(ad => <PostCard key={ad._id} ad={ad} />)}
                </div>
            </div>
        </section>
    );
};

export const SectionHeader = ({ title, subtitle, link }) => (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {link && (
            <Link to={link} className="text-primary font-semibold text-sm hover:underline underline-offset-2 flex items-center gap-1 shrink-0 group">
                View All <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
        )}
    </div>
);

export default FeaturedAds;
export { PostCard };
