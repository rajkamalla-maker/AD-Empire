import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PostCard } from '../components/home/FeaturedAds';
import { getPosts } from '../utils/demoData';
import { useLocation } from '../context/LocationContext';

const CATEGORIES_FILTER = ['All', 'Mobiles', 'Cars', 'Electronics', 'Furniture', 'Jobs', 'Properties', 'Fashion', 'Services'];
const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'most_viewed', label: 'Most Viewed' },
];

const SearchPage = () => {
    const { location } = useLocation();
    const [params, setParams] = useSearchParams();
    const [query, setQuery] = useState(params.get('q') || '');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sort, setSort] = useState('latest');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    const [results, setResults] = useState([]);

    useEffect(() => {
        let qs = getPosts().filter(p => p.status === 'approved' && (!location || p.cityName === location.city));

        const searchQ = params.get('q')?.toLowerCase();
        if (searchQ) {
            qs = qs.filter(p => p.title.toLowerCase().includes(searchQ) || p.description?.toLowerCase().includes(searchQ));
        }

        if (activeCategory !== 'All') {
            qs = qs.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
        }

        setResults(qs);
    }, [params, activeCategory, location]);

    const handleSearch = (e) => {
        e.preventDefault();
        setParams(query ? { q: query } : {});
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search bar */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 shadow-soft"
                                placeholder="Search ads..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary px-6">Search</button>
                        <button type="button" onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:border-primary/40 hover:text-primary transition-all shadow-soft font-medium">
                            <SlidersHorizontal className="h-5 w-5" /> Filters
                        </button>
                    </form>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`w-72 shrink-0 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6 sticky top-24">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
                                <button onClick={() => { setActiveCategory('All'); setMinPrice(''); setMaxPrice(''); setCondition(''); }} className="text-xs text-primary hover:underline">Clear All</button>
                            </div>

                            {/* Category */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Category</h4>
                                <div className="space-y-2">
                                    {(() => {
                                        const allPosts = getPosts().filter(p => p.status === 'approved');
                                        const catMap = { 'All': allPosts.length };
                                        CATEGORIES_FILTER.forEach(cat => {
                                            if (cat !== 'All') {
                                                const slug = cat.toLowerCase().replace(/ /g, '-');
                                                catMap[cat] = allPosts.filter(p =>
                                                    p.category?.toLowerCase() === slug ||
                                                    p.category?.toLowerCase() === cat.toLowerCase()
                                                ).length;
                                            }
                                        });
                                        return CATEGORIES_FILTER.map(cat => (
                                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex items-center justify-between w-full text-sm py-2 px-3 rounded-lg transition-all ${activeCategory === cat ? 'bg-primary text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}>
                                                <span>{cat}</span>
                                                <span className={`text-xs rounded-full px-2 py-0.5 ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    {catMap[cat] || 0}
                                                </span>
                                            </button>
                                        ));
                                    })()}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Price Range (₹)</h4>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Min" className="input-field text-sm py-2" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                                    <input type="number" placeholder="Max" className="input-field text-sm py-2" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                                </div>
                            </div>

                            {/* Condition */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Condition</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {['All', 'New', 'Used', 'Refurbished'].map(c => (
                                        <button key={c} onClick={() => setCondition(c)} className={`text-sm py-2 rounded-lg border transition-all font-medium ${condition === c ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-600 hover:border-primary/40'}`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="btn-primary w-full py-2.5">Apply Filters</button>
                        </div>
                    </aside>

                    {/* Results */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                            <p className="text-gray-600 text-sm">
                                Showing <span className="font-semibold text-gray-900">{results.length}</span> results
                                {params.get('q') && <span> for "<span className="text-primary font-semibold">{params.get('q')}</span>"</span>}
                            </p>
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                className="bg-white border border-gray-200 text-sm text-gray-700 py-2 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary shadow-soft"
                            >
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>

                        {results.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-2xl shadow-soft">
                                <p className="text-5xl mb-4">🔍</p>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
                                <p className="text-gray-500">Try a different keyword or adjust the filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {results.map(ad => <PostCard key={ad._id} ad={ad} />)}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${n === 1 ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:border-primary hover:text-primary border border-gray-200 shadow-soft'}`}>
                                        {n}
                                    </button>
                                ))}
                                <button className="w-10 h-10 rounded-xl font-medium text-sm bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary shadow-soft">→</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
