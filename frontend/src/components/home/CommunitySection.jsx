import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const POSTS = [
    { id: 1, title: 'How I Sold My Old Furniture in 2 Days on Marketplace!', category: 'Success Story', author: 'Rajan K.', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', readTime: '3 min', emoji: '🎉' },
    { id: 2, title: 'New Metro Line in Bengaluru — Property Prices Skyrocket!', category: 'City Update', author: 'NewsDesk', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80', readTime: '4 min', emoji: '🏙️' },
    { id: 3, title: 'Top 5 Tips to Spot a Fake Online Seller', category: 'Safety Tips', author: 'Priya M.', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80', readTime: '6 min', emoji: '🔒' },
    { id: 4, title: 'Chennai Local Business Fair — Nov 15-17', category: 'Event', author: 'EventsTeam', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80', readTime: '2 min', emoji: '📅' },
];

const categoryColors = {
    'Success Story': 'bg-green-100 text-green-700',
    'City Update': 'bg-blue-100 text-blue-700',
    'Safety Tips': 'bg-red-100 text-red-700',
    'Event': 'bg-purple-100 text-purple-700',
};

const CommunitySection = () => (
    <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">🤝 Community Hub</h2>
                    <p className="text-gray-500 text-sm mt-2">City updates, success stories, events & tips from our community</p>
                </div>
                <Link to="/community" className="btn-primary flex items-center gap-2 w-fit">
                    Join Community <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {POSTS.map(post => (
                    <Link key={post.id} to={`/community/${post.id}`} className="card-premium group overflow-hidden block">
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                            <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-700'}`}>
                                {post.category}
                            </span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors">{post.emoji} {post.title}</h3>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>By {post.author}</span>
                                <span>{post.readTime} read</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);

export default CommunitySection;
