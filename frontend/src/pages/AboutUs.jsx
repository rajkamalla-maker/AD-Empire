import { Link } from 'react-router-dom';
import { Users, TrendingUp, ShieldCheck, Target } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-16 animate-fade-in">
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 to-[#1a2236] text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px]" />
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-[80px]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-xl mx-auto mb-6">
                        M
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Building the Future of <br /><span className="text-yellow-400">Local Commerce</span></h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">Ad Empire 360 is India's most trusted classfieds platform, safely connecting thousands of buyers and sellers every single day.</p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="bg-white rounded-2xl shadow-premium p-8 md:p-12 border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">We believe that local commerce should be simple, free, and incredibly safe. We're on a mission to democratize the entire localized buying, selling, and recruiting ecosystem.</p>
                        <p className="text-gray-600 leading-relaxed">Whether you are a college student looking for a second-hand laptop, or a growing business trying to hire fresh talent, Ad Empire 360 provides the digital storefront to make it happen instantly.</p>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        {[
                            { value: '500+', label: 'Cities Active', icon: Target, c: 'text-blue-500', bg: 'bg-blue-50' },
                            { value: '2M+', label: 'Happy Users', icon: Users, c: 'text-green-500', bg: 'bg-green-50' },
                            { value: '50K+', label: 'Daily Verified Ads', icon: ShieldCheck, c: 'text-purple-500', bg: 'bg-purple-50' },
                            { value: '100%', label: 'Yearly Growth', icon: TrendingUp, c: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map((s, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${s.bg} ${s.c}`}>
                                    <s.icon className="h-6 w-6" />
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{s.value}</div>
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to action */}
            <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to join the empire?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link to="/register" className="btn-primary py-3 px-8 text-lg shadow-lg">Create Free Account</Link>
                    <Link to="/post-ad" className="btn-outline py-3 px-8 text-lg border-gray-300">Post an Ad Now</Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
