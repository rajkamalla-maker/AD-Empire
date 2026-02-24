import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowLeft, MapPin, Plus } from 'lucide-react';

const INITIAL_GROUPS = [
    { id: 1, name: 'Mumbai Buy & Sell', city: 'Mumbai', members: 1240, desc: 'The biggest buy/sell group for Mumbai locals.' },
    { id: 2, name: 'Bengaluru Tech Deals', city: 'Bengaluru', members: 890, desc: 'Electronics and gadgets community in Bengaluru.' },
    { id: 3, name: 'Chennai Auto Mart', city: 'Chennai', members: 670, desc: 'Cars, bikes and auto accessories in Chennai.' },
    { id: 4, name: 'Delhi Fashion Hub', city: 'Delhi', members: 530, desc: 'Clothing and fashion items trading in Delhi NCR.' },
    { id: 5, name: 'Pune Furniture Exchange', city: 'Pune', members: 320, desc: 'Second-hand furniture deals in Pune.' },
];

const LocalGroups = () => {
    const [groups, setGroups] = useState(INITIAL_GROUPS);
    const [joined, setJoined] = useState(new Set());

    const toggleJoin = (id) => {
        const next = new Set(joined);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setJoined(next);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16 animate-fade-in">
            <section className="bg-blue-600 pt-12 pb-20 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-3">Local Groups</h1>
                    <p className="text-blue-100 text-lg">Join groups in your area to buy and sell niche items with locals.</p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
                <Link to="/community" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 bg-white px-4 py-2 rounded-xl shadow-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Community
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {groups.map(g => (
                        <div key={g.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft hover:shadow-premium transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg">{g.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {g.city} · {g.members.toLocaleString()} members</p>
                                    <p className="text-sm text-gray-600 mt-2">{g.desc}</p>
                                    <button
                                        onClick={() => toggleJoin(g.id)}
                                        className={`mt-4 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${joined.has(g.id) ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-primary text-white hover:bg-primary-dark'}`}
                                    >
                                        {joined.has(g.id) ? '✓ Joined' : 'Join Group'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocalGroups;
