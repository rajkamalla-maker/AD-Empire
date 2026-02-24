import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../utils/demoData';

const CATEGORIES = [
    { name: 'Cars & Bikes', slug: 'vehicles', icon: '🚗', color: 'from-blue-500 to-blue-600' },
    { name: 'Mobiles & Tech', slug: 'mobiles', icon: '📱', color: 'from-green-500 to-green-600' },
    { name: 'Properties', slug: 'real-estate', icon: '🏠', color: 'from-orange-500 to-orange-600' },
    { name: 'Jobs', slug: 'jobs', icon: '💼', color: 'from-purple-500 to-purple-600' },
    { name: 'Furniture', slug: 'furniture', icon: '🛋️', color: 'from-yellow-500 to-yellow-600' },
    { name: 'Fashion', slug: 'fashion', icon: '👗', color: 'from-pink-500 to-pink-600' },
    { name: 'Pets', slug: 'pets', icon: '🐶', color: 'from-amber-500 to-amber-600' },
    { name: 'Services', slug: 'services', icon: '🔧', color: 'from-teal-500 to-teal-600' },
    { name: 'Education', slug: 'education', icon: '📚', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Sports', slug: 'sports', icon: '⚽', color: 'from-lime-500 to-lime-600' },
    { name: 'Other', slug: 'other', icon: '🗂️', color: 'from-gray-500 to-gray-600' },
];

const CategoryGrid = () => {
    const [counts, setCounts] = useState({});

    useEffect(() => {
        const posts = getPosts().filter(p => p.status === 'approved');
        const countsMap = posts.reduce((acc, post) => {
            acc[post.category] = (acc[post.category] || 0) + 1;
            return acc;
        }, {});
        setCounts(countsMap);
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse Categories</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Explore thousands of listings across all popular categories</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map((cat) => {
                        const realCount = counts[cat.slug] || 0;
                        const displayCount = cat.slug === 'other'
                            ? 'Browse All'
                            : `${realCount} Ad${realCount !== 1 ? 's' : ''}`;

                        return (
                            <Link
                                key={cat.slug}
                                to={cat.slug === 'other' ? '/search' : `/category/${cat.slug}`}
                                className="group flex flex-col items-center p-4 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    {cat.icon}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-primary transition-colors">
                                    {cat.name}
                                </span>
                                <span className="text-xs text-gray-400 mt-1">{displayCount}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
