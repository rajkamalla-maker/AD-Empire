import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, AlertTriangle, FileText, Phone } from 'lucide-react';

const TIPS = [
    { icon: ShieldCheck, title: 'Meet in Public Places', desc: 'Always meet buyers and sellers in well-lit public areas like malls or cafes. Never invite strangers to your home.' },
    { icon: AlertTriangle, title: 'Beware of Scams', desc: 'If a deal sounds too good to be true, it probably is. Watch out for fake payment screenshots and advance payment requests.' },
    { icon: FileText, title: 'Verify Documents', desc: 'For vehicles and high-value items, always verify ownership documents and ask for original bills and warranty cards.' },
    { icon: Phone, title: 'Use Platform Chat', desc: 'Communicate through the platform chat so there is always a record. Avoid sharing personal details too early.' },
    { icon: ShieldCheck, title: 'Check Before Paying', desc: 'Inspect the item thoroughly before making any payment. Test electronics and check for defects.' },
    { icon: AlertTriangle, title: 'Report Suspicious Ads', desc: 'Use the "Report" button on any ad that looks suspicious. Our team reviews all reports within 24 hours.' },
];

const TrustCenter = () => (
    <div className="min-h-screen bg-gray-50 pb-16 animate-fade-in">
        <section className="bg-red-600 pt-12 pb-20 px-4 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
            <div className="relative z-10 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-3">Trust & Safety Center</h1>
                <p className="text-red-100 text-lg">Learn how to trade safely and protect yourself from scams.</p>
            </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
            <Link to="/community" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6 bg-white px-4 py-2 rounded-xl shadow-sm">
                <ArrowLeft className="h-4 w-4" /> Back to Community
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {TIPS.map((tip, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft hover:shadow-premium transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                                <tip.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{tip.title}</h3>
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{tip.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default TrustCenter;
