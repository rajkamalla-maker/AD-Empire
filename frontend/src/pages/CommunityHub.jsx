import { useState, useEffect } from 'react';
import { Users, MessageSquare, HandHeart, Calendar, Send, CornerDownRight } from 'lucide-react';
import { SectionHeader } from '../components/home/FeaturedAds';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';

const INITIAL_THREADS = [
    { id: 1, title: 'Best second-hand laptop for coding under ₹40k?', user: 'Rahul Dev', time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), replies: [{ id: 101, user: 'TechGuru', text: 'Look for refurbished ThinkPads T-series.', time: new Date(Date.now() - 1000 * 60 * 60).toISOString() }] },
    { id: 2, title: 'Tips for spotting a fake iPhone 15', user: 'TechieMumbaikar', time: new Date(Date.now() - 1000 * 60 * 300).toISOString(), replies: [] },
    { id: 3, title: 'Any upcoming flea markets in Koramangala this weekend?', user: 'Sneha B.', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), replies: [] },
    { id: 4, title: 'Need recommendations for reliable packers and movers', user: 'Aman199', time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), replies: [] },
];

const CommunityHub = () => {
    const { user } = useAuth();
    const [threads, setThreads] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('marketplace_community_threads');
        if (stored) {
            setThreads(JSON.parse(stored));
        } else {
            localStorage.setItem('marketplace_community_threads', JSON.stringify(INITIAL_THREADS));
            setThreads(INITIAL_THREADS);
        }
    }, []);

    const saveThreads = (updated) => {
        setThreads(updated);
        localStorage.setItem('marketplace_community_threads', JSON.stringify(updated));
    };

    const handlePostQuestion = (e) => {
        e.preventDefault();
        if (!newQuestion.trim() || !user) return;
        const newThread = {
            id: Date.now(),
            title: newQuestion,
            user: user.fullName,
            time: new Date().toISOString(),
            replies: []
        };
        saveThreads([newThread, ...threads]);
        setNewQuestion('');
    };

    const handlePostReply = (e, threadId) => {
        e.preventDefault();
        if (!replyText.trim() || !user) return;
        const updated = threads.map(t => {
            if (t.id === threadId) {
                return {
                    ...t,
                    replies: [...t.replies, {
                        id: Date.now(),
                        user: user.fullName,
                        text: replyText,
                        time: new Date().toISOString()
                    }]
                };
            }
            return t;
        });
        saveThreads(updated);
        setReplyText('');
        setReplyingTo(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16 animate-fade-in">
            {/* Hero Section */}
            <section className="bg-primary pt-16 pb-24 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Marketplace Community</h1>
                    <p className="text-lg md:text-xl text-blue-100">Connect, interact, and grow with buyers and sellers in your city.</p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Users, title: 'Local Groups', desc: 'Join groups in your area to buy/sell niche items.', color: 'bg-blue-500', link: '/community/local-groups' },
                        { icon: MessageSquare, title: 'Discussions', desc: 'Ask questions and get advice from top sellers.', color: 'bg-green-500', link: '/community' },
                        { icon: HandHeart, title: 'Trust Center', desc: 'Learn how to trade safely and report scams.', color: 'bg-red-500', link: '/community/trust-center' },
                        { icon: Calendar, title: 'Events', desc: 'Local garage sales and community meetups.', color: 'bg-purple-500', link: '/community/events' }
                    ].map(card => (
                        <Link to={card.link} key={card.title} className="bg-white rounded-2xl shadow-premium p-6 hover:-translate-y-1 transition-transform border border-gray-100 block">
                            <div className={`w-12 h-12 rounded-xl text-white ${card.color} flex items-center justify-center shadow-lg mb-4`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{card.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">{card.desc}</p>
                            <span className="text-primary font-semibold text-sm hover:underline">Explore →</span>
                        </Link>
                    ))}
                </div>

                {/* Popular Threads feed */}
                <div className="mt-16 bg-white rounded-3xl shadow-soft p-8 border border-gray-100">
                    <SectionHeader title="🔥 Community Discussions" subtitle="Ask a question or help solve others' issues" />

                    {/* Ask Question Box */}
                    {user ? (
                        <form onSubmit={handlePostQuestion} className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Ask the community anything..."
                                className="flex-1 bg-white border border-gray-200 text-gray-900 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                            />
                            <button type="submit" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
                                <Send className="w-4 h-4" /> Post Question
                            </button>
                        </form>
                    ) : (
                        <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center text-center">
                            <MessageSquare className="w-8 h-8 text-blue-400 mb-2" />
                            <h3 className="text-blue-900 font-semibold mb-1">Join the Conversation</h3>
                            <p className="text-blue-700 text-sm mb-4">Please log in to ask questions or reply to existing threads.</p>
                            <Link to="/login" className="btn-primary text-sm px-6">Log In to Participate</Link>
                        </div>
                    )}

                    <div className="space-y-4">
                        {threads.map((thread) => (
                            <div key={thread.id} className="flex flex-col p-5 rounded-2xl border border-gray-200 hover:border-primary/30 transition-colors bg-white shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-lg mb-1">{thread.title}</h4>
                                        <p className="text-xs text-gray-500">
                                            Posted by <span className="font-semibold text-gray-700">{thread.user}</span> • {timeAgo(thread.time)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setReplyingTo(replyingTo === thread.id ? null : thread.id)}
                                        className="mt-2 sm:mt-0 flex items-center justify-center gap-2 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        {thread.replies.length} {thread.replies.length === 1 ? 'Reply' : 'Replies'}
                                    </button>
                                </div>

                                {/* Replies Section */}
                                {(thread.replies.length > 0 || replyingTo === thread.id) && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 pl-2 lg:pl-6 space-y-4">
                                        {thread.replies.map(reply => (
                                            <div key={reply.id} className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <CornerDownRight className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{reply.user} <span className="text-xs font-normal text-gray-500 ml-2">{timeAgo(reply.time)}</span></p>
                                                    <p className="text-sm text-gray-700 mt-1">{reply.text}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {replyingTo === thread.id && (
                                            user ? (
                                                <form onSubmit={(e) => handlePostReply(e, thread.id)} className="flex gap-3 mt-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Write a helpful reply..."
                                                        className="flex-1 bg-white border border-gray-200 text-gray-900 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm shadow-sm"
                                                        value={replyText}
                                                        onChange={e => setReplyText(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button type="submit" className="bg-gray-900 hover:bg-black text-white px-5 rounded-xl text-sm font-semibold transition-colors">Reply</button>
                                                </form>
                                            ) : (
                                                <p className="text-sm text-red-500 font-medium mt-2 text-center bg-red-50 p-2 rounded-lg">You must be logged in to reply to this thread.</p>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;
