import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    ChevronRight, ChevronLeft, Upload, X, MapPin, Clock, Phone,
    Tag, FileText, IndianRupee, Image as ImageIcon, Video,
    CheckCircle, RotateCcw, AlertCircle, Camera, Plus, Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addPost } from '../utils/demoData';

// ── Categories ──────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'vehicles', label: 'Cars & Bikes', icon: '🚗', sub: ['Car', 'Bike', 'Scooter', 'Truck', 'Bus', 'Other Vehicle'] },
    { id: 'mobiles', label: 'Mobiles & Electronics', icon: '📱', sub: ['Mobile', 'Tablet', 'Laptop', 'Camera', 'TV', 'Other Electronics'] },
    { id: 'real-estate', label: 'Real Estate', icon: '🏠', sub: ['House for Sale', 'Flat for Sale', 'House for Rent', 'Flat for Rent', 'Plot', 'PG/Hostel'] },
    { id: 'jobs', label: 'Jobs', icon: '💼', sub: ['Full-time', 'Part-time', 'Freelance', 'Internship', 'Work from Home'] },
    { id: 'furniture', label: 'Furniture & Home', icon: '🛋️', sub: ['Sofa', 'Bed', 'Table', 'Almirah', 'Kitchen', 'Other Furniture'] },
    { id: 'fashion', label: 'Fashion & Clothing', icon: '👗', sub: ["Men's", "Women's", "Kids'", 'Accessories', 'Footwear'] },
    { id: 'services', label: 'Services', icon: '🔧', sub: ['Business Listings', 'Home Repair', 'Cleaning', 'Tuition', 'Event Management', 'Other'] },
    { id: 'pets', label: 'Pets & Animals', icon: '🐶', sub: ['Dog', 'Cat', 'Bird', 'Fish', 'Other Pet'] },
    { id: 'sports', label: 'Sports & Hobbies', icon: '⚽', sub: ['Cricket', 'Football', 'Gym Equipment', 'Books', 'Musical Instruments'] },
    { id: 'education', label: 'Education', icon: '📚', sub: ['Books', 'Courses', 'Coaching', 'Certificates'] },
    { id: 'other', label: 'Other', icon: '🗂️', sub: ['Miscellaneous'] },
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'For Parts'];
const TIME_SLOTS = ['Anytime', 'Morning (8am-12pm)', 'Afternoon (12pm-4pm)', 'Evening (4pm-8pm)', 'Night (8pm-10pm)', 'Weekends Only'];
const DRAFT_KEY = 'marketplace_post_draft';

const STEPS = [
    { label: 'Category', icon: Tag },
    { label: 'Ad Details', icon: FileText },
    { label: 'Photos & Video', icon: Camera },
    { label: 'Location', icon: MapPin },
    { label: 'Contact', icon: Phone },
    { label: 'Review & Post', icon: CheckCircle },
];

const PostAd = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [hasDraft, setHasDraft] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [locationSearch, setLocationSearch] = useState('');
    const [mapLoaded] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [mediaSuccessVisible, setMediaSuccessVisible] = useState('');
    const fileInputRef = useRef();
    const videoInputRef = useRef();

    const EMPTY_FORM = {
        category: '', subCategory: '',
        title: '', description: '', price: '', negotiable: false, condition: 'Good', adType: 'sell',
        images: [], video: null,
        address: '', cityName: '', state: '', pincode: '', lat: '', lng: '',
        sellerName: user?.fullName || '', phone: user?.phone || '', email: user?.email || '',
        preferredTime: 'Anytime', showPhone: true,
    };

    const [form, setForm] = useState(() => {
        try {
            const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
            if (draft && draft.title) { setHasDraft(true); return { ...EMPTY_FORM, ...draft }; }
        } catch { }
        return EMPTY_FORM;
    });

    // Auto-save draft
    useEffect(() => {
        const { images, video, ...saveable } = form;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(saveable));
        setHasDraft(!!(form.title || form.category));
    }, [form]);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        set(name, type === 'checkbox' ? checked : value);
    };

    const clearDraft = () => {
        localStorage.removeItem(DRAFT_KEY);
        setForm(EMPTY_FORM);
        setPreviewImages([]);
        setPreviewVideo(null);
        setStep(0);
        setHasDraft(false);
    };

    // ── Image upload ─────────────────────────────────────────────────
    const handleImages = async (e) => {
        const files = Array.from(e.target.files);
        const valid = files.filter(f => f.type.startsWith('image/'));
        if (previewImages.length + valid.length > 10) {
            alert('Maximum 10 images allowed.'); return;
        }
        if (valid.length === 0) return;

        setUploadingMedia(true);
        await new Promise(r => setTimeout(r, 800)); // Simulate upload

        valid.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => setPreviewImages(prev => [...prev, { url: ev.target.result, name: file.name, file }]);
            reader.readAsDataURL(file);
        });
        set('images', [...form.images, ...valid]);
        setUploadingMedia(false);
        setMediaSuccessVisible('Images Uploaded ✓');
        setTimeout(() => setMediaSuccessVisible(''), 2500);
    };

    const removeImage = (idx) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== idx));
        set('images', form.images.filter((_, i) => i !== idx));
    };

    const handleVideo = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 100 * 1024 * 1024) { alert('Video must be under 100MB.'); return; }

        setUploadingMedia(true);
        await new Promise(r => setTimeout(r, 1200)); // Simulate longer upload

        const url = URL.createObjectURL(file);
        setPreviewVideo({ url, name: file.name, file });
        set('video', file);
        setUploadingMedia(false);
        setMediaSuccessVisible('Video Uploaded ✓');
        setTimeout(() => setMediaSuccessVisible(''), 2500);
    };

    // ── Drag & Drop ──────────────────────────────────────────────────
    const [dragging, setDragging] = useState(false);
    const handleDrop = (e) => {
        e.preventDefault(); setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const images = files.filter(f => f.type.startsWith('image/'));
        const video = files.find(f => f.type.startsWith('video/'));
        if (images.length) handleImages({ target: { files: images } });
        if (video) handleVideo({ target: { files: [video] } });
    };

    // ── Location search (mock Google Maps style) ─────────────────────
    const POPULAR_PLACES = ['Chennai, Tamil Nadu', 'Puducherry, Tamil Nadu', 'Bengaluru, Karnataka', 'Mumbai, Maharashtra', 'Delhi', 'Hyderabad, Telangana', 'Coimbatore, Tamil Nadu', 'Madurai, Tamil Nadu'];
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const handleLocationSearch = (val) => {
        setLocationSearch(val);
        if (val.length > 1) {
            setLocationSuggestions(POPULAR_PLACES.filter(p => p.toLowerCase().includes(val.toLowerCase())));
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };
    const selectLocation = (place) => {
        const parts = place.split(', ');
        set('cityName', parts[0]);
        set('state', parts[1] || '');
        setLocationSearch(place);
        setShowSuggestions(false);
    };

    // ── Validation ───────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (step === 0 && !form.category) e.category = 'Please select a category';
        if (step === 1) {
            if (!form.title.trim()) e.title = 'Title is required';
            if (form.title.trim().length < 10) e.title = 'Title must be at least 10 characters';
        }
        if (step === 3 && !form.cityName) e.cityName = 'Location is required';
        if (step === 4 && !form.phone) e.phone = 'Phone number is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => { if (validate()) setStep(s => Math.min(s + 1, 5)); };
    const prev = () => setStep(s => Math.max(s - 1, 0));

    // ── Submit ───────────────────────────────────────────────────────
    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1800));

        addPost({
            title: form.title, description: form.description, price: form.price,
            category: form.category, subCategory: form.subCategory, adType: form.adType, condition: form.condition,
            negotiable: form.negotiable, cityName: form.cityName, state: form.state, address: form.address,
            sellerName: form.sellerName, phone: form.phone,
            images: previewImages.length > 0 ? [previewImages[0].url] : ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&q=80']
        });

        localStorage.removeItem(DRAFT_KEY);
        setSubmitting(false);
        setSubmitted(true);
    };

    // ── Success screen ───────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-premium p-10 max-w-md w-full text-center animate-slide-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad Submitted! 🎉</h2>
                    <p className="text-gray-500 mb-6">Your ad "<strong>{form.title}</strong>" is pending review. You'll be notified once approved.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/" className="btn-primary flex-1 py-3 text-center">View Homepage</Link>
                        <button onClick={() => { setSubmitted(false); clearDraft(); }} className="btn-outline flex-1 py-3">Post Another Ad</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Post Your Ad</h1>
                        <p className="text-gray-500 text-sm mt-1">Fill in details to reach buyers near you</p>
                    </div>
                    <div className="flex gap-2">
                        {hasDraft && (
                            <button onClick={clearDraft} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-all border border-red-100">
                                <RotateCcw className="h-4 w-4" /> Fresh Start
                            </button>
                        )}
                    </div>
                </div>

                {/* Stepper */}
                <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
                    <div className="flex items-center justify-between overflow-x-auto gap-1">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <button
                                    key={s.label}
                                    onClick={() => i < step && setStep(i)}
                                    className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all min-w-[70px] ${i === step ? 'bg-primary/10' : i < step ? 'cursor-pointer hover:bg-gray-50' : 'opacity-40 cursor-not-allowed'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < step ? 'bg-green-500' : i === step ? 'bg-primary' : 'bg-gray-200'}`}>
                                        {i < step ? <CheckCircle className="h-4 w-4 text-white" /> : <Icon className={`h-4 w-4 ${i === step ? 'text-white' : 'text-gray-500'}`} />}
                                    </div>
                                    <span className={`text-[10px] font-medium leading-tight text-center ${i === step ? 'text-primary' : i < step ? 'text-green-600' : 'text-gray-400'}`}>{s.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500" style={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }} />
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-6 min-h-[400px]">

                    {/* ── STEP 0: Category ────────────────────────────────────── */}
                    {step === 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Select Category</h2>
                            <p className="text-gray-500 text-sm mb-6">What are you selling?</p>
                            {errors.category && <div className="mb-4 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{errors.category}</div>}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { set('category', cat.id); set('subCategory', ''); }}
                                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all hover:-translate-y-0.5 ${form.category === cat.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'}`}
                                    >
                                        <span className="text-3xl mb-2">{cat.icon}</span>
                                        <span className={`text-xs font-semibold text-center leading-tight ${form.category === cat.id ? 'text-primary' : 'text-gray-700'}`}>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                            {form.category && (
                                <div className="mt-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Sub-category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.find(c => c.id === form.category)?.sub.map(sub => (
                                            <button key={sub} onClick={() => {
                                                if (sub === 'Business Listings') navigate('/business/new');
                                                else set('subCategory', sub);
                                            }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${form.subCategory === sub ? 'bg-primary text-white border-primary shadow-sm' : 'border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary'}`}>
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 1: Ad Details ──────────────────────────────────── */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Ad Details</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="label-field">Ad Title *</label>
                                    <input name="title" type="text" placeholder="e.g. iPhone 15 Pro 256GB – Excellent Condition" className="input-field" value={form.title} onChange={handleChange} maxLength={100} />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                    <p className="text-xs text-gray-400 mt-1">{form.title.length}/100 characters</p>
                                </div>

                                <div>
                                    <label className="label-field">Description</label>
                                    <textarea name="description" rows={4} placeholder="Describe your item in detail — age, brand, reasons for selling, any defects..." className="input-field resize-none" value={form.description} onChange={handleChange} maxLength={2000} />
                                    <p className="text-xs text-gray-400 mt-1">{form.description.length}/2000 characters</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-field">Ad Type</label>
                                        <div className="flex gap-2 mt-1">
                                            {['sell', 'rent', 'free', 'wanted'].map(t => (
                                                <button key={t} onClick={() => set('adType', t)}
                                                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${form.adType === t ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40'}`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label-field">Condition</label>
                                        <select name="condition" className="input-field" value={form.condition} onChange={handleChange}>
                                            {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="label-field">Price (₹) {form.adType === 'free' ? '— Offering Free' : ''}</label>
                                    <div className="flex gap-3 items-center">
                                        <div className="relative flex-1">
                                            <IndianRupee className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                            <input name="price" type="number" placeholder="Enter price" className="input-field pl-10" value={form.price} onChange={handleChange} disabled={form.adType === 'free'} min={0} />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer shrink-0">
                                            <input type="checkbox" name="negotiable" checked={form.negotiable} onChange={handleChange} className="accent-primary" />
                                            Negotiable
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: Photos & Video ──────────────────────────────── */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Photos & Video</h2>
                            <p className="text-sm text-gray-500 mb-6">Ads with photos get 3× more responses. Upload up to 10 images + 1 video.</p>

                            {/* Image Upload Area */}
                            {mediaSuccessVisible && (
                                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl flex items-center justify-center gap-2 mb-4 animate-fade-in shadow-sm font-medium">
                                    <CheckCircle className="h-5 w-5" /> {mediaSuccessVisible}
                                </div>
                            )}
                            {uploadingMedia && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 mb-4 rounded-xl flex items-center justify-center gap-3 animate-fade-in shadow-sm font-medium">
                                    <Loader className="h-5 w-5 animate-spin" /> Uploading & Compressing...
                                </div>
                            )}

                            <div
                                className={`border-2 border-dashed rounded-2xl p-8 text-center mb-5 transition-all cursor-pointer ${dragging ? 'border-primary bg-primary/5' : uploadingMedia ? 'opacity-50 pointer-events-none border-gray-200 bg-gray-50' : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'}`}
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => !uploadingMedia && fileInputRef.current?.click()}
                            >
                                <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <p className="font-semibold text-gray-600">Drag & drop images here</p>
                                <p className="text-sm text-gray-400 mt-1">or click to browse — JPG, PNG, WEBP (max 5MB each)</p>
                                <button type="button" className="mt-4 bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors">
                                    <Plus className="h-4 w-4 inline mr-1" /> Add Photos
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                            </div>

                            {/* Image Previews */}
                            {previewImages.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-5">
                                    {previewImages.map((img, i) => (
                                        <div key={i} className="relative group aspect-square">
                                            <img src={img.url} alt={img.name} className="w-full h-full object-cover rounded-xl border-2 border-gray-100" />
                                            {i === 0 && <div className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">Cover</div>}
                                            <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {previewImages.length < 10 && (
                                        <button onClick={() => fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all">
                                            <Plus className="h-6 w-6" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Video Upload */}
                            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Video className="h-5 w-5 text-purple-500" />
                                        <span className="font-semibold text-gray-700 text-sm">Add Video (Optional)</span>
                                        <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">Max 100MB</span>
                                    </div>
                                    {previewVideo && <button onClick={() => { setPreviewVideo(null); set('video', null); }} className="text-red-500 text-xs hover:underline">Remove</button>}
                                </div>
                                {previewVideo ? (
                                    <video src={previewVideo.url} controls className="w-full rounded-lg max-h-48" />
                                ) : (
                                    <button onClick={() => !uploadingMedia && videoInputRef.current?.click()} disabled={uploadingMedia} className="w-full border-2 border-dashed border-purple-200 rounded-xl py-4 text-purple-500 hover:bg-purple-50 hover:border-purple-400 disabled:opacity-50 transition-all text-sm font-medium flex items-center justify-center gap-2">
                                        <Upload className="h-4 w-4" /> {uploadingMedia ? 'Uploading...' : 'Upload Video (MP4, MOV)'}
                                    </button>
                                )}
                                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Location ────────────────────────────────────── */}
                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Location Details</h2>

                            {/* Google Maps Embed (search + map) */}
                            <div className="mb-5">
                                <label className="label-field">Search Location *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Type your city or area..."
                                        className="input-field pl-10"
                                        value={locationSearch}
                                        onChange={e => handleLocationSearch(e.target.value)}
                                        onFocus={() => locationSearch.length > 1 && setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                    {showSuggestions && locationSuggestions.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full z-20 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                                            {locationSuggestions.map(p => (
                                                <button key={p} onMouseDown={() => selectLocation(p)} className="w-full text-left px-4 py-3 text-sm hover:bg-primary/5 hover:text-primary flex items-center gap-2 border-b border-gray-50 last:border-0">
                                                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" /> {p}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.cityName && <p className="text-red-500 text-xs mt-1">{errors.cityName}</p>}
                            </div>

                            {/* Google Maps Iframe */}
                            <div className="rounded-2xl overflow-hidden border border-gray-200 mb-5 shadow-soft">
                                <iframe
                                    title="Google Maps"
                                    className="w-full h-56"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3PgA&q=${encodeURIComponent(locationSearch || form.cityName || 'India')}&zoom=12`}
                                />
                                <div className="bg-blue-50 px-4 py-2 border-t border-blue-100 text-xs text-blue-600 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Click the map to pinpoint your exact location (add Google Maps API key)
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-field">City / Area *</label>
                                    <input name="cityName" type="text" placeholder="e.g. Puducherry" className="input-field" value={form.cityName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="label-field">State</label>
                                    <input name="state" type="text" placeholder="e.g. Tamil Nadu" className="input-field" value={form.state} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="label-field">Full Address</label>
                                    <input name="address" type="text" placeholder="Street, locality..." className="input-field" value={form.address} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="label-field">Pincode</label>
                                    <input name="pincode" type="text" placeholder="605001" maxLength={6} className="input-field" value={form.pincode} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: Contact & Time ──────────────────────────────── */}
                    {step === 4 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Details</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="label-field">Your Name *</label>
                                        <input name="sellerName" type="text" className="input-field" value={form.sellerName} onChange={handleChange} required />
                                    </div>
                                    <div>
                                        <label className="label-field">Phone Number *</label>
                                        <input name="phone" type="tel" placeholder="10-digit mobile" maxLength={10} className="input-field" value={form.phone} onChange={handleChange} required />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="label-field">Email (Optional)</label>
                                    <input name="email" type="email" className="input-field" value={form.email} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="label-field flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" /> Preferred Contact Time
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                        {TIME_SLOTS.map(t => (
                                            <button key={t} onClick={() => set('preferredTime', t)}
                                                className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${form.preferredTime === t ? 'bg-primary text-white border-primary shadow-sm' : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <input type="checkbox" name="showPhone" checked={form.showPhone} onChange={handleChange} className="accent-primary w-4 h-4" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Show phone number publicly</p>
                                        <p className="text-xs text-gray-400">Buyers will see your number on the ad</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 5: Review & Post ───────────────────────────────── */}
                    {step === 5 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Review Your Ad</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Preview */}
                                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-soft">
                                    {previewImages.length > 0 && (
                                        <img src={previewImages[0].url} alt="cover" className="w-full h-40 object-cover" />
                                    )}
                                    <div className="p-4">
                                        <span className="text-xs font-semibold text-primary uppercase">{CATEGORIES.find(c => c.id === form.category)?.label} {form.subCategory && `› ${form.subCategory}`}</span>
                                        <h3 className="font-bold text-gray-800 mt-1 text-lg">{form.title || 'Your Ad Title'}</h3>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {form.adType === 'free' ? <span className="text-green-500">FREE</span> : form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : 'Price not set'}
                                            {form.negotiable && <span className="text-sm text-gray-400 ml-2">(Negotiable)</span>}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><MapPin className="h-3 w-3" /> {form.cityName || 'Location not set'}{form.state && `, ${form.state}`}</p>
                                        <p className="text-xs text-gray-400 mt-1">{form.description?.slice(0, 80)}...</p>
                                    </div>
                                </div>
                                {/* Summary */}
                                <div className="space-y-3">
                                    {[
                                        { label: 'Category', val: `${CATEGORIES.find(c => c.id === form.category)?.label || '—'} ${form.subCategory ? '› ' + form.subCategory : ''}` },
                                        { label: 'Condition', val: form.condition },
                                        { label: 'Photos', val: `${previewImages.length} uploaded${previewVideo ? ' + 1 video' : ''}` },
                                        { label: 'Location', val: `${form.cityName || '—'}${form.state ? ', ' + form.state : ''}${form.pincode ? ' - ' + form.pincode : ''}` },
                                        { label: 'Contact', val: form.phone || '—' },
                                        { label: 'Preferred Time', val: form.preferredTime },
                                    ].map(({ label, val }) => (
                                        <div key={label} className="flex items-start justify-between py-2 border-b border-gray-50">
                                            <span className="text-sm text-gray-500">{label}</span>
                                            <span className="text-sm text-gray-800 font-medium text-right max-w-[60%]">{val}</span>
                                        </div>
                                    ))}
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700 flex gap-2 mt-2">
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        Your ad will be reviewed within 24h and notified via SMS.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between gap-4">
                    <button onClick={prev} disabled={step === 0} className="flex items-center gap-2 btn-outline px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed">
                        <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <div className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</div>
                    {step < 5 ? (
                        <button onClick={next} className="btn-primary flex items-center gap-2 px-8 py-3">
                            Continue <ChevronRight className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-70 bg-green-600 hover:bg-green-700"
                        >
                            {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <><CheckCircle className="h-4 w-4" /> Submit Ad</>}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PostAd;
