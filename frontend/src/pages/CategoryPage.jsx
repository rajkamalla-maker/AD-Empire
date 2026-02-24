import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPosts } from '../utils/demoData';
import { PostCard } from '../components/home/FeaturedAds';
import { useLocation } from '../context/LocationContext';

const CategoryPage = () => {
    const { location } = useLocation();
    const { categoryId } = useParams();
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        // Show ALL approved + sold-excluded posts in this category
        // Location filter is optional — don't block category browsing
        let allPosts = getPosts().filter(p => p.status === 'approved');
        if (categoryId) {
            allPosts = allPosts.filter(p => p.category === categoryId);
        }

        // Sort
        if (sort === 'newest') allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sort === 'price-low') allPosts.sort((a, b) => (a.price || 0) - (b.price || 0));
        else if (sort === 'price-high') allPosts.sort((a, b) => (b.price || 0) - (a.price || 0));

        setPosts(allPosts);
        window.scrollTo(0, 0);
    }, [categoryId, sort]);

    const displayTitle = categoryId ? categoryId.replace(/-/g, ' ') : 'All Ads';

    return (
        <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 capitalize">{displayTitle}</h1>
                        <p className="text-gray-500 mt-1">Showing {posts.length} result(s){location ? ` — All cities` : ''}</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="newest">Sort by: Newest</option>
                            <option value="price-low">Sort by: Price (Low to High)</option>
                            <option value="price-high">Sort by: Price (High to Low)</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {posts.map(ad => <PostCard key={ad._id} ad={ad} />)}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-soft">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No ads found</h2>
                        <p className="text-gray-500 mb-6">There are currently no listings in this category.</p>
                        <Link to="/post-ad" className="btn-primary inline-flex">Post an Ad</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
