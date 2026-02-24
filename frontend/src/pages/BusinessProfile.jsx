import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Star, Mail, Globe, Clock, CheckCircle, Share2, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BusinessProfile = () => {
    const { id } = useParams(); // URL might be /business/:id or /city/:slug, for now using /business/:id for simplicity
    const { user } = useAuth();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                // In a real app we'd fetch from `/api/business/${id}`
                // For demo, we simulate a successful mock response based on the schema if it's not found locally
                const res = await fetch(`/api/business/${id}`);
                if (res.ok) {
                    const json = await res.json();
                    setBusiness(json.data);
                } else {
                    // MOCK fallback for demo visual presentation
                    setBusiness({
                        _id: id || 'mock123',
                        businessName: id ? id.replace(/-/g, ' ').toUpperCase() : 'Sri Ganesh Electricals',
                        businessCategory: 'Electrician',
                        description: 'We provide top-notch electrical repair and installations for residential and commercial spaces with over 10 years of trusted experience.',
                        establishedYear: 2010,
                        rating: 4.8, reviewCount: 124,
                        isVerified: true,
                        contactDetails: { phone: '+91 9876543210', whatsapp: '+91 9876543210', email: 'hello@sriganesh.com', website: 'https://sriganesh.com' },
                        locationId: { city: 'Chennai', address: '123 Main Street, Anna Nagar', pincode: '600040' },
                        workingHours: 'Mon-Sat: 9 AM - 8 PM',
                        servicesOffered: ['Wiring', 'Appliance Repair', 'Inverter Installation', 'Lighting Setup'],
                        media: {
                            coverImage: 'https://images.unsplash.com/photo-1542496658-e325027419a4?w=1200&q=80',
                            gallery: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80']
                        }
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    if (!business) return <div className="min-h-screen flex items-center justify-center">Business Not Found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Cover Photo */}
            <div className="w-full h-64 md:h-80 bg-gray-800 relative">
                <img
                    src={business.media?.coverImage || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80'}
                    className="w-full h-full object-cover opacity-80" alt="Cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-24">
                <div className="bg-white rounded-2xl shadow-premium p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">

                    {/* Left/Main Content */}
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    {business.businessName}
                                    {business.isVerified && <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-50" />}
                                </h1>
                                <p className="text-primary font-semibold mt-1">{business.businessCategory}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 border rounded-full hover:bg-gray-50 text-gray-600"><Share2 className="w-5 h-5" /></button>
                                <button className="p-2 border rounded-full hover:bg-red-50 text-red-500"><Heart className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 flex-wrap">
                            <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 font-bold px-2 py-1 rounded">
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {business.rating} ({business.reviewCount} Reviews)
                            </span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {business.locationId?.city}, {business.locationId?.pincode}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> {business.workingHours || 'Contact for hours'}</span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">About Business</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{business.description}</p>
                            {business.establishedYear && <p className="text-sm text-gray-500 mt-3 font-medium">Established in {business.establishedYear}</p>}
                        </div>

                        {business.servicesOffered?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Services Offered</h3>
                                <div className="flex flex-wrap gap-2">
                                    {business.servicesOffered.map((s, i) => (
                                        <span key={i} className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery Mock */}
                        {business.media?.gallery?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Photos</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {business.media.gallery.map((img, i) => (
                                        <img key={i} src={img} className="w-full h-32 object-cover rounded-xl" alt={`Gallery ${i + 1}`} />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">User Reviews</h3>
                            <div className="bg-gray-50 p-6 rounded-2xl text-center border border-gray-100">
                                <p className="text-gray-500 mb-4">No reviews yet. Be the first to leave a review!</p>
                                <button className="btn-outline px-6">Write a Review</button>
                            </div>
                        </div>
                    </div>

                    {/* Right/Sidebar Contact Panel */}
                    <div className="w-full md:w-80 shrink-0 space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">Contact Business</h3>

                            <div className="space-y-4 text-sm">
                                {business.contactDetails?.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Call Now</p>
                                            <a href={`tel:${business.contactDetails.phone}`} className="font-bold text-gray-900">{business.contactDetails.phone}</a>
                                        </div>
                                    </div>
                                )}
                                {business.contactDetails?.whatsapp && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">
                                            <MessageCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">WhatsApp</p>
                                            <a href={`https://wa.me/${business.contactDetails.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="font-bold text-gray-900 tracking-wide">Connect on WA</a>
                                        </div>
                                    </div>
                                )}
                                {business.contactDetails?.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-gray-500 text-xs">Email</p>
                                            <a href={`mailto:${business.contactDetails.email}`} className="font-bold text-gray-900 truncate block">{business.contactDetails.email}</a>
                                        </div>
                                    </div>
                                )}
                                {business.contactDetails?.website && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div className="truncate">
                                            <p className="text-gray-500 text-xs">Website</p>
                                            <a href={business.contactDetails.website} target="_blank" rel="noreferrer" className="font-bold text-primary truncate block hover:underline">Visit Website</a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="w-full btn-primary mt-6 py-3 shadow-md flex justify-center items-center gap-2">
                                <MessageCircle className="w-5 h-5" /> Chat via AdEmpire
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin className="text-primary w-5 h-5" /> Address
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{business.locationId?.address}, {business.locationId?.city} - {business.locationId?.pincode}</p>
                            <div className="h-32 bg-gray-200 rounded-xl w-full flex items-center justify-center text-gray-400 text-sm overflow-hidden border border-gray-300">
                                <iframe
                                    title="Google Maps Profile"
                                    className="w-full h-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3PgA&q=${encodeURIComponent(`${business.businessName}, ${business.locationId?.city}`)}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessProfile;
