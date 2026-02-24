import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Send, CheckCircle } from 'lucide-react';

const NEWSLETTER_KEY = 'marketplace_newsletter_emails';

const Footer = () => {
    const [nlEmail, setNlEmail] = useState('');
    const [nlSuccess, setNlSuccess] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!nlEmail.trim()) return;
        const stored = JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || '[]');
        if (!stored.includes(nlEmail.toLowerCase())) {
            stored.push(nlEmail.toLowerCase());
            localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(stored));
        }
        setNlEmail('');
        setNlSuccess(true);
        setTimeout(() => setNlSuccess(false), 3000);
    };
    return (
        <footer className="bg-[#1e293b] text-zinc-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

                    {/* Brand Col */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                    M
                                </div>
                                <span className="font-bold text-2xl tracking-tight text-white">
                                    Ad Empire 360
                                </span>
                            </div>
                            <span className="text-primary italic font-semibold tracking-wide ml-1 text-sm bg-gradient-to-r from-yellow-300 to-yellow-600 bg-clip-text text-transparent inline-block">
                                "Your Advertising Empire Starts Here"
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm text-zinc-400">
                            India's premium location-based platform to buy, sell, and find anything. Connecting local communities with verified sellers and top-quality services.
                        </p>

                        <div className="mt-6 flex space-x-4">
                            <SocialIcon Icon={Facebook} color="hover:bg-blue-600" />
                            <SocialIcon Icon={Twitter} color="hover:bg-sky-500" />
                            <SocialIcon Icon={Instagram} color="hover:bg-pink-600" />
                            <SocialIcon Icon={Linkedin} color="hover:bg-blue-700" />
                            <SocialIcon Icon={Youtube} color="hover:bg-red-600" />
                        </div>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-white font-semibold mb-5 text-lg">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/community">Community Hub</FooterLink>
                            <FooterLink to="/promotions">Premium Ads Pricing</FooterLink>
                            <FooterLink to="/contact">Contact Support</FooterLink>
                            <FooterLink to="/careers">Careers</FooterLink>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-white font-semibold mb-5 text-lg">Categories</h4>
                        <ul className="space-y-3 text-sm">
                            <FooterLink to="/category/cars">Cars & Vehicles</FooterLink>
                            <FooterLink to="/category/real-estate">Real Estate & Properties</FooterLink>
                            <FooterLink to="/category/jobs">Jobs & Hiring</FooterLink>
                            <FooterLink to="/category/electronics">Mobiles & Electronics</FooterLink>
                            <FooterLink to="/category/services">Local Services</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-5 text-lg">Newsletter</h4>
                        <p className="text-sm text-zinc-400 mb-4">Subscribe to get the latest trending local deals directly to your inbox!</p>
                        {nlSuccess ? (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg py-3 px-4 flex items-center gap-2 text-green-400 text-sm animate-fade-in">
                                <CheckCircle className="h-4 w-4" /> Subscribed successfully!
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletterSubmit} className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    value={nlEmail}
                                    onChange={e => setNlEmail(e.target.value)}
                                    required
                                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-zinc-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark text-white p-2 rounded-md transition-colors"
                                    aria-label="Subscribe"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                    <p className="flex-1 text-left">© {new Date().getFullYear()} Ad Empire 360. All rights reserved.</p>
                    <div className="flex-1 text-center bg-zinc-800/50 py-2 px-6 rounded-full border border-zinc-700/50 font-medium">
                        <span className="text-green-400 inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        <span className="text-zinc-300 mr-4">Active Users: 12,402</span>
                        <span className="text-blue-400 inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        <span className="text-zinc-300">Total Visits: 1.4M+</span>
                    </div>
                    <div className="flex flex-1 space-x-6 justify-end">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-zinc-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
            {children}
        </Link>
    </li>
);

const SocialIcon = ({ Icon, color }) => (
    <button type="button" className={`w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 ${color} hover:text-white transition-all duration-300 hover:shadow-lg group shadow-sm`}>
        <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
    </button>
);

export default Footer;
