import { useState, useEffect } from 'react';
import { Users, FileText, CreditCard, TrendingUp, Eye, MapPin, Star, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getPosts, getPostStats } from '../../utils/demoData';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    sold: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
};

const AdminOverview = () => {
    const { getAllUsers } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, activePosts: 0, pendingPosts: 0, soldPosts: 0, activeUsers: 0 });
    const [recentPosts, setRecentPosts] = useState([]);
    const [cityCounts, setCityCounts] = useState([]);

    useEffect(() => {
        // Derive all stats from actual data
        const users = getAllUsers ? getAllUsers() : [];
        const posts = getPosts();
        const postStats = getPostStats();

        const approvedUsers = users.filter(u => u.isApproved).length;
        const soldPosts = posts.filter(p => p.status === 'sold').length;

        // City distribution from real posts
        const cityMap = {};
        posts.filter(p => p.status === 'approved').forEach(p => {
            cityMap[p.cityName] = (cityMap[p.cityName] || 0) + 1;
        });
        const cityArr = Object.entries(cityMap)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        const maxCity = cityArr[0]?.count || 1;

        setStats({
            totalUsers: users.length,
            activeUsers: approvedUsers,
            totalPosts: postStats.total,
            activePosts: postStats.active,
            pendingPosts: postStats.pending,
            soldPosts,
        });

        setCityCounts(cityArr.map(c => ({ ...c, pct: Math.round((c.count / maxCity) * 100) })));

        // Recent posts sorted by date
        const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        setRecentPosts(sorted.map(p => ({
            id: p._id,
            title: p.title,
            user: p.sellerName,
            city: p.cityName,
            status: p.status,
            time: getTimeAgo(p.createdAt),
        })));
    }, []);

    const STAT_CARDS = [
        { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'from-blue-500 to-blue-600' },
        { icon: FileText, label: 'Total Posts', value: stats.totalPosts.toLocaleString(), color: 'from-green-500 to-green-600' },
        { icon: TrendingUp, label: 'Active Ads', value: stats.activePosts.toLocaleString(), color: 'from-purple-500 to-purple-600' },
        { icon: Activity, label: 'Pending Approval', value: stats.pendingPosts.toLocaleString(), color: 'from-orange-500 to-orange-600' },
    ];

    const RECENT_PAYMENTS = [
        { user: 'Arun K.', amount: '₹999', type: 'Homepage Featured', status: 'completed' },
        { user: 'Meera V.', amount: '₹499', type: 'City Spotlight', status: 'completed' },
        { user: 'Tech Solutions', amount: '₹1,999', type: '30 Day Boost', status: 'pending' },
        { user: 'Ravi M.', amount: '₹299', type: 'Pinned Post 7d', status: 'completed' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                    <p className="text-zinc-400 text-sm mt-1">Welcome back! Here's your live platform summary.</p>
                </div>
                <div className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1.5 rounded-lg">
                    Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {STAT_CARDS.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-[#1a2236] rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-premium group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{value}</div>
                        <div className="text-sm text-zinc-400">{label}</div>
                    </div>
                ))}
            </div>

            {/* Extra stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#1a2236] rounded-xl p-4 border border-zinc-800">
                    <p className="text-2xl font-bold text-green-400">{stats.activeUsers}</p>
                    <p className="text-xs text-zinc-400 mt-1">Active Users</p>
                </div>
                <div className="bg-[#1a2236] rounded-xl p-4 border border-zinc-800">
                    <p className="text-2xl font-bold text-purple-400">{stats.soldPosts}</p>
                    <p className="text-xs text-zinc-400 mt-1">Deals Closed</p>
                </div>
                <div className="bg-[#1a2236] rounded-xl p-4 border border-zinc-800">
                    <p className="text-2xl font-bold text-blue-400">{stats.totalUsers + stats.totalPosts}</p>
                    <p className="text-xs text-zinc-400 mt-1">Total Visitors (est.)</p>
                </div>
                <div className="bg-[#1a2236] rounded-xl p-4 border border-zinc-800">
                    <p className="text-2xl font-bold text-yellow-400">{stats.pendingPosts}</p>
                    <p className="text-xs text-zinc-400 mt-1">Awaiting Review</p>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-[#1a2236] rounded-2xl p-6 border border-zinc-800">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-white">Posts Distribution</h3>
                            <p className="text-xs text-zinc-400 mt-1">Ads per category (live data)</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-2 h-40">
                        {(() => {
                            const posts = getPosts().filter(p => p.status === 'approved');
                            const cats = ['vehicles', 'mobiles', 'real-estate', 'jobs', 'furniture', 'fashion', 'pets', 'services', 'education', 'sports'];
                            const catLabels = ['🚗', '📱', '🏠', '💼', '🛋️', '👗', '🐶', '🔧', '📚', '⚽'];
                            const catCounts = cats.map(c => posts.filter(p => p.category === c).length);
                            const max = Math.max(...catCounts, 1);
                            return cats.map((c, i) => (
                                <div key={c} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs text-zinc-500">{catCounts[i]}</span>
                                    <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-blue-400 transition-all hover:from-blue-400 hover:to-blue-300 cursor-pointer" style={{ height: `${Math.max((catCounts[i] / max) * 100, 5)}%` }} />
                                    <span className="text-[12px]">{catLabels[i]}</span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Top Cities */}
                <div className="bg-[#1a2236] rounded-2xl p-6 border border-zinc-800">
                    <h3 className="font-semibold text-white mb-5">Top Cities by Ads</h3>
                    <div className="space-y-3">
                        {cityCounts.length > 0 ? cityCounts.map(({ city, count, pct }) => (
                            <div key={city}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-zinc-300 font-medium">{city}</span>
                                    <span className="text-zinc-500">{count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        )) : (
                            <p className="text-zinc-500 text-sm">No city data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Posts & Payments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Recent Posts */}
                <div className="bg-[#1a2236] rounded-2xl p-6 border border-zinc-800">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-white">Recent Posts</h3>
                        <a href="/admin/posts" className="text-xs text-primary hover:underline">View all</a>
                    </div>
                    <div className="space-y-3">
                        {recentPosts.map(post => (
                            <div key={post.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                    {post.user?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white">{post.title}</p>
                                    <p className="text-xs text-zinc-500">{post.user} · {post.city}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[post.status] || 'bg-gray-100 text-gray-700'}`}>{post.status}</span>
                                    <span className="text-[10px] text-zinc-600">{post.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-[#1a2236] rounded-2xl p-6 border border-zinc-800">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-white">Recent Payments</h3>
                        <a href="/admin/payments" className="text-xs text-primary hover:underline">View all</a>
                    </div>
                    <div className="space-y-3">
                        {RECENT_PAYMENTS.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">
                                    ₹
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-zinc-200 truncate">{p.user}</p>
                                    <p className="text-xs text-zinc-500">{p.type}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-bold text-white">{p.amount}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default AdminOverview;
