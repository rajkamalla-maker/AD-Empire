import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Contact2, Share2, UploadCloud, Clock, IndianRupee, Tags } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BusinessListingForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '', businessCategory: '', description: '', establishedYear: '',
        contactPhone: '', contactWhatsapp: '', contactEmail: '', website: '',
        country: 'India', state: '', city: '', address: '', pincode: '',
        workingHours: '', servicesOffered: '', priceRange: '', gstNumber: '',
        facebook: '', instagram: '', linkedin: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Setup structured payload matching backend schema
            const payload = {
                businessName: formData.businessName,
                businessCategory: formData.businessCategory,
                description: formData.description,
                establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
                contactDetails: {
                    phone: formData.contactPhone,
                    whatsapp: formData.contactWhatsapp,
                    email: formData.contactEmail,
                    website: formData.website,
                },
                locationId: {
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    address: formData.address,
                    pincode: formData.pincode,
                },
                servicesOffered: formData.servicesOffered.split(',').map(s => s.trim()).filter(Boolean),
                workingHours: formData.workingHours,
                priceRange: formData.priceRange,
                gstNumber: formData.gstNumber,
                socialLinks: {
                    facebook: formData.facebook,
                    instagram: formData.instagram,
                    linkedin: formData.linkedin,
                }
            };

            const token = localStorage.getItem('marketplace_token');
            const res = await fetch('/api/business', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Business Listing created successfully and is pending approval.");
                navigate('/dashboard');
            } else {
                const data = await res.json();
                alert(data.message || 'Error creating business listing');
            }
        } catch (error) {
            console.error(error);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Professional Business Profile</h1>
                    <p className="text-gray-500">List your business in the local directory to attract premium customers.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4 text-primary font-semibold text-lg">
                            <Building2 className="w-5 h-5" /> Basic Information
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                <input required type="text" name="businessName" onChange={handleChange} className="input-field" placeholder="E.g., Sri Ganesh Electricals" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Category *</label>
                                <select required name="businessCategory" onChange={handleChange} className="input-field bg-white">
                                    <option value="">Select Category</option>
                                    <option value="Plumber">Plumber</option>
                                    <option value="Electrician">Electrician</option>
                                    <option value="Salon">Salon & Spa</option>
                                    <option value="Restaurant">Restaurant</option>
                                    <option value="Cleaning">Cleaning Service</option>
                                    <option value="Legal">Legal Advisor</option>
                                    <option value="Other">Other Services</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">About the Business *</label>
                                <textarea required name="description" rows="4" onChange={handleChange} className="input-field" placeholder="Provide a detailed description of your services..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                                <input type="number" name="establishedYear" onChange={handleChange} className="input-field" placeholder="e.g., 2010" />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4 text-primary font-semibold text-lg">
                            <MapPin className="w-5 h-5" /> Location Details
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <input required type="text" name="city" onChange={handleChange} className="input-field" placeholder="E.g., Chennai" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input type="text" name="state" onChange={handleChange} className="input-field" placeholder="Tamil Nadu" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                                <input required type="text" name="address" onChange={handleChange} className="input-field" placeholder="Shop No. 12, Main Road..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                <input type="text" name="pincode" onChange={handleChange} className="input-field" placeholder="600001" />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Hours */}
                    <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4 text-primary font-semibold text-lg">
                            <Contact2 className="w-5 h-5" /> Contact & Operations
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input required type="text" name="contactPhone" onChange={handleChange} className="input-field" placeholder="+91" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                <input type="text" name="contactWhatsapp" onChange={handleChange} className="input-field" placeholder="+91" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                                <input type="email" name="contactEmail" onChange={handleChange} className="input-field" placeholder="contact@business.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                <input type="url" name="website" onChange={handleChange} className="input-field" placeholder="https://" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Tags className="w-4 h-4" /> Services Offered (Comma separated)</label>
                                <input type="text" name="servicesOffered" onChange={handleChange} className="input-field" placeholder="e.g. Home Cleaning, Office Sanitization, Pest Control" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Clock className="w-4 h-4" /> Working Hours</label>
                                <input type="text" name="workingHours" onChange={handleChange} className="input-field" placeholder="e.g. Mon-Sat: 9 AM - 8 PM" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><IndianRupee className="w-4 h-4" /> Price Range (Optional)</label>
                                <input type="text" name="priceRange" onChange={handleChange} className="input-field" placeholder="e.g. ₹500 - ₹5000" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="btn-outline px-8 shrink-0">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-10">
                            {loading ? 'Submitting...' : 'Submit Profile for Approval'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessListingForm;
