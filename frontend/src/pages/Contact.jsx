import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        e.target.reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Have questions about our premium ad services or need help with your account? Our support team is here to assist you 24/7.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 flex flex-col gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Email Support</h3>
                            <p className="text-gray-500 text-sm">Drop us an email and we'll get back to you within 2-4 hours.</p>
                            <a href="mailto:support@adempire360.com" className="text-primary font-semibold hover:underline">support@adempire360.com</a>
                        </div>

                        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 flex flex-col gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-2">
                                <Phone className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Phone Support</h3>
                            <p className="text-gray-500 text-sm">Call us directly during our business hours (9 AM - 6 PM IST).</p>
                            <a href="tel:+919876543210" className="text-green-600 font-semibold hover:underline">+91 98765 43210</a>
                        </div>

                        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 flex flex-col gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">HQ Office</h3>
                            <p className="text-gray-500 text-sm">Ad Empire 360 Tower, IT Park Sector 62, Noida, Uttar Pradesh 201309, India.</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-premium p-8 md:p-10 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            {sent && (
                                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in text-sm font-medium">
                                    Message sent successfully! We will contact you soon.
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Your Name</label>
                                        <input type="text" required className="input-field py-3" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                                        <input type="email" required className="input-field py-3" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Subject</label>
                                    <input type="text" required className="input-field py-3" placeholder="How can we help you?" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Message</label>
                                    <textarea required rows={5} className="input-field py-3 resize-none" placeholder="Type your full message here..."></textarea>
                                </div>
                                <button type="submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-xl transition-all">
                                    <Send className="h-5 w-5" /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
