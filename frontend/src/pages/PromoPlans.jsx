import { Star, Zap, Crown, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromoPlans = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sell Faster with Premium Ads</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">Stand out from the crowd. Our promoted listings get up to 10x more visibility and sell in half the time.</p>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
                    {/* Basic Plan */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft hover:-translate-y-2 transition-transform h-full flex flex-col justify-between relative group">
                        <div className="absolute top-0 right-0 p-6 text-gray-300 group-hover:text-blue-500 transition-colors">
                            <Zap className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Boost Ad</h3>
                            <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">Quick push to the top of listings.</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-extrabold text-gray-900">₹299</span>
                                <span className="text-gray-500 ml-2">/24 hrs</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Pushed to top once a day',
                                    'Highlighted border',
                                    '2x More Views',
                                    'Analytics Dashboard'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-600 gap-3">
                                        <CheckCircle className="h-5 w-5 text-blue-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="w-full btn-outline border-blue-200 hover:border-blue-500 hover:text-blue-600 text-blue-600 font-bold py-3">Select Boost</button>
                    </div>

                    {/* Featured Plan */}
                    <div className="bg-gradient-to-br from-primary to-[#0a4a7c] rounded-3xl p-8 shadow-[0_20px_40px_-15px_rgba(20,116,188,0.5)] transform scale-105 z-10 hover:-translate-y-2 transition-transform h-full flex flex-col justify-between relative border border-white/20">
                        <div className="absolute top-0 right-0 p-6 text-yellow-400">
                            <Star className="h-8 w-8 fill-yellow-400" />
                        </div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            Most Popular
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Featured Ad</h3>
                            <p className="text-blue-200 text-sm mb-6 pb-6 border-b border-white/20">Maximum visibility on Homepage.</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-extrabold text-white">₹799</span>
                                <span className="text-blue-200 ml-2">/7 days</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Featured in Homepage Carousel',
                                    'Gold "Featured" Badge',
                                    'Always top 5 in Search',
                                    '5x More Impressions',
                                    'Priority Support'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center text-sm text-blue-50 gap-3">
                                        <CheckCircle className="h-5 w-5 text-yellow-400" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-xl transition-colors shadow-lg shadow-yellow-400/20">Select Featured</button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-soft hover:-translate-y-2 transition-transform h-full flex flex-col justify-between relative group">
                        <div className="absolute top-0 right-0 p-6 text-gray-300 group-hover:text-purple-500 transition-colors">
                            <Crown className="h-8 w-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">City Spotlight</h3>
                            <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">Total dominance in your city.</p>
                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-extrabold text-gray-900">₹1,499</span>
                                <span className="text-gray-500 ml-2">/30 days</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Banner across City Category',
                                    'Premium Crown Badge',
                                    'Top Spot in Notifications',
                                    '10x Ultimate Visibility',
                                    'Dedicated Account Manager'
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center text-sm text-gray-600 gap-3">
                                        <CheckCircle className="h-5 w-5 text-purple-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="w-full btn-outline border-purple-200 hover:border-purple-500 hover:text-purple-600 text-purple-600 font-bold py-3">Select Spotlight</button>
                    </div>
                </div>
            </div>

            <div className="text-center mt-20 max-w-2xl mx-auto px-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Need a custom plan for business?</h3>
                <p className="text-gray-500 mb-6">If you're a dealer or agency looking to list multiple properties or vehicles, contact us for bulk pricing.</p>
                <Link to="/" className="text-primary font-semibold hover:underline">Contact Sales →</Link>
            </div>
        </div>
    );
};

export default PromoPlans;
