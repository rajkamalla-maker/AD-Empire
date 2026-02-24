import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users } from 'lucide-react';

const INITIAL_EVENTS = [
    { id: 1, title: 'Weekend Flea Market', city: 'Mumbai', date: '2026-03-01', time: '10:00 AM - 6:00 PM', location: 'BKC Grounds, Bandra', desc: 'Shop from 200+ vendors. Vintage goods, handmade crafts, street food.', attendees: 340 },
    { id: 2, title: 'Tech Garage Sale', city: 'Bengaluru', date: '2026-03-08', time: '11:00 AM - 4:00 PM', location: 'Indiranagar Community Hall', desc: 'Second-hand laptops, phones, accessories. Great deals from verified sellers.', attendees: 180 },
    { id: 3, title: 'Auto Expo Pop-up', city: 'Chennai', date: '2026-03-15', time: '9:00 AM - 5:00 PM', location: 'Trade Centre, Nandambakkam', desc: 'Pre-owned cars exhibition. Test drives available. Finance partners on-site.', attendees: 520 },
    { id: 4, title: 'Community Swap Meet', city: 'Delhi', date: '2026-03-22', time: '12:00 PM - 7:00 PM', location: 'Select Citywalk Mall', desc: 'Bring items to swap. Books, clothes, electronics. Zero waste initiative.', attendees: 210 },
];

const Events = () => {
    const [rsvp, setRsvp] = useState(new Set());

    const toggleRsvp = (id) => {
        const next = new Set(rsvp);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setRsvp(next);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16 animate-fade-in">
            <section className="bg-purple-600 pt-12 pb-20 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c7e6d2?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-3">Community Events</h1>
                    <p className="text-purple-100 text-lg">Local garage sales, meetups, and marketplace events near you.</p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
                <Link to="/community" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 bg-white px-4 py-2 rounded-xl shadow-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Community
                </Link>

                <div className="space-y-5">
                    {INITIAL_EVENTS.map(ev => (
                        <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft hover:shadow-premium transition-all flex flex-col sm:flex-row gap-6">
                            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex flex-col items-center justify-center text-purple-700 shrink-0">
                                <span className="text-2xl font-bold">{new Date(ev.date).getDate()}</span>
                                <span className="text-xs font-medium uppercase">{new Date(ev.date).toLocaleString('en', { month: 'short' })}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-xl mb-1">{ev.title}</h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-2">
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ev.location}, {ev.city}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {ev.time}</span>
                                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {ev.attendees + (rsvp.has(ev.id) ? 1 : 0)} attending</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{ev.desc}</p>
                                <button
                                    onClick={() => toggleRsvp(ev.id)}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${rsvp.has(ev.id) ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                                >
                                    {rsvp.has(ev.id) ? '✓ RSVP Confirmed' : 'RSVP Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
