import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const PromoBanner = () => (
    <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Promote Ad CTA */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#1374bc] p-8 flex flex-col justify-between min-h-[160px]">
                    <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full" />
                    <div className="absolute right-10 bottom-4 w-20 h-20 bg-white/5 rounded-full" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
                            <Zap className="h-3 w-3 fill-gray-900" /> Boost Your Ad
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Get 10x More Visibility!</h3>
                        <p className="text-blue-100/90 text-sm">Feature your ad on the homepage and get more buyers faster.</p>
                    </div>
                    <Link to="/plans" className="relative z-10 mt-5 inline-flex items-center gap-2 bg-white text-primary font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 hover:text-gray-900 transition-all duration-300 shadow-lg w-fit text-sm">
                        View Promotion Plans →
                    </Link>
                </div>

                {/* Post Free Ad CTA */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col justify-between min-h-[160px]">
                    <div className="absolute -left-8 -top-8 w-36 h-36 bg-white/5 rounded-full" />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-green-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
                            ✓ 100% Free
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Post Your First Ad Free!</h3>
                        <p className="text-gray-400 text-sm">Reach thousands of buyers in your city instantly. No charge to post.</p>
                    </div>
                    <Link to="/post-ad" className="relative z-10 mt-5 inline-flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg w-fit text-sm">
                        + Post Free Ad →
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

export default PromoBanner;
