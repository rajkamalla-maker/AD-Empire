import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ShieldCheck, Share2, Heart, Flag, IndianRupee, ChevronLeft, Phone, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPosts, updatePostStatus } from '../utils/demoData';
import { timeAgo, formatDate } from '../utils/timeAgo';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [contactStatus, setContactStatus] = useState('hidden'); // hidden, pending, revealed
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const posts = getPosts();
        // Allow owner to view even if sold/pending, others only approved
        const found = posts.find(p => p._id === id);
        if (found) setPost(found);
        window.scrollTo(0, 0);
    }, [id]);

    const requestContact = () => {
        setContactStatus('pending');
        // Simulate seller approval delay
        setTimeout(() => {
            setContactStatus('revealed');
        }, 3000);
    };

    const handleMarkAsSold = () => {
        if (window.confirm('Mark this ad as SOLD? It will be removed from public view instantly.')) {
            updatePostStatus(post._id, 'sold');
            alert('Ad marked as sold and removed from public listings.');
            navigate('/');
        }
    };

    const isOwner = user?.fullName === post?.sellerName;

    if (!post || (post.status !== 'approved' && !isOwner)) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ad not found</h2>
                <p className="text-gray-500 mb-6">The ad you're looking for might have been removed or doesn't exist.</p>
                <Link to="/" className="btn-primary flex items-center gap-2"><ChevronLeft className="h-4 w-4" /> Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-16 animate-fade-in">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center text-xs text-gray-500 gap-2">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <Link to={`/category/${post.category}`} className="hover:text-primary capitalize">{post.category.replace('-', ' ')}</Link>
                        <span>/</span>
                        <span className="text-gray-800 truncate">{post.title}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* Main Content (Left) */}
                    <div className="flex-1 space-y-6">

                        {/* Image Gallery */}
                        <div className="bg-black rounded-2xl overflow-hidden relative aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center shadow-soft">
                            <img src={post.images?.[0] || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80'} alt={post.title} className="max-h-full max-w-full object-contain" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md text-gray-700 hover:text-primary transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                                <button onClick={() => setSaved(!saved)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:text-red-500 transition-colors">
                                    <Heart className={`h-5 w-5 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-soft">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
                                    <p className="text-sm font-medium text-gray-500 flex items-center gap-4">
                                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {post.cityName}{post.state ? `, ${post.state}` : ''}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {timeAgo(post.createdAt)}</span>
                                    </p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-3xl font-bold text-gray-900 flex items-center sm:justify-end">
                                        {post.adType === 'free' ? <span className="text-green-500 uppercase">FREE</span> : <><IndianRupee className="h-6 w-6" /> {Number(post.price).toLocaleString('en-IN')}</>}
                                    </p>
                                    {post.negotiable && <p className="text-sm text-gray-400 mt-1">Negotiable</p>}
                                </div>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100 my-6">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Category</p>
                                    <p className="text-sm font-semibold text-gray-800 capitalize">{post.category.replace('-', ' ')}</p>
                                </div>
                                {post.subCategory && (
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Type</p>
                                        <p className="text-sm font-semibold text-gray-800">{post.subCategory}</p>
                                    </div>
                                )}
                                {post.condition && (
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Condition</p>
                                        <p className="text-sm font-semibold text-gray-800">{post.condition}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ad Type</p>
                                    <p className="text-sm font-semibold text-gray-800 capitalize">{post.adType}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">{post.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="w-full lg:w-80 space-y-6">

                        {/* Contact Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md">
                                    {post.sellerName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{post.sellerName}</h3>
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                                        <CheckCircle className="h-3.5 w-3.5" /> Identity Verified
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">Member since {new Date(post.createdAt).getFullYear()}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {isOwner && post.status === 'approved' && (
                                    <button onClick={handleMarkAsSold} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mb-2">
                                        <CheckCircle className="h-5 w-5" /> Mark as Sold / Deal Closed
                                    </button>
                                )}

                                {contactStatus === 'revealed' || isOwner ? (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center animate-fade-in">
                                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">Phone Number</p>
                                        <p className="text-2xl font-bold text-gray-900 tracking-wider">+91 {post.phone}</p>
                                    </div>
                                ) : contactStatus === 'pending' ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center text-sm font-semibold text-yellow-700 animate-fade-in shadow-sm">
                                        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin inline-block mx-auto mb-2"></div>
                                        <p>Contact Request Sent.</p>
                                        <p className="text-xs font-normal mt-1 opacity-80">Waiting for seller approval via chat...</p>
                                    </div>
                                ) : (
                                    <button onClick={requestContact} className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                        <Phone className="h-5 w-5" /> Request Contact (via Chat)
                                    </button>
                                )}
                                <button className="w-full py-3.5 border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                                    <Mail className="h-5 w-5" /> Chat with Seller
                                </button>
                            </div>

                            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                    <h4 className="flex items-center gap-1.5 text-amber-800 font-semibold text-sm mb-2"><ShieldCheck className="h-4 w-4" /> Safety Tips</h4>
                                    <ul className="text-xs text-amber-700/80 space-y-1.5 list-disc pl-4">
                                        <li>Meet in a safe public place</li>
                                        <li>Check the item before buying</li>
                                        <li>Pay only after collecting item</li>
                                    </ul>
                                </div>
                                <button className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-red-500 transition-colors py-2">
                                    <Flag className="h-3 w-3" /> Report this Ad
                                </button>
                            </div>
                        </div>

                        {/* Location Map Placeholder */}
                        <div className="bg-white rounded-2xl p-6 shadow-soft">
                            <h3 className="font-bold text-gray-900 mb-3">Location</h3>
                            <p className="text-sm text-gray-600 mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {post.cityName}{post.state ? `, ${post.state}` : ''}</p>
                            <div className="rounded-xl overflow-hidden border border-gray-200 h-40">
                                <iframe
                                    title="map"
                                    className="w-full h-full"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3PgA&q=${encodeURIComponent(post.cityName)}`}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
