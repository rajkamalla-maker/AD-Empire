import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
// Stub admin sub-pages - enhanced with local state for click interactivity

const AdminPayments = () => {
    const { user } = useAuth();

    const transactions = [
        ['Arun K.', 'Homepage Featured 30d', '999', 'completed', '24 Feb'],
        ['Meera V.', 'City Spotlight 7d', '499', 'completed', '23 Feb'],
        ['Tech Solutions', 'Pinned Post 30d', '1999', 'pending', '24 Feb'],
        ['Ravi M.', 'Boost 24hr', '299', 'completed', '22 Feb'],
        ['Sriram N.', 'Category Featured', '799', 'failed', '21 Feb']
    ];

    const exportRevenueToCSV = () => {
        const headers = ['User', 'Service', 'Amount(INR)', 'Status', 'Date'];
        const csvContent = [headers.join(',')];
        transactions.forEach(t => {
            const row = [`"${t[0]}"`, `"${t[1]}"`, t[2], t[3], t[4]];
            csvContent.push(row.join(','));
        });

        const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ad_empire_revenue_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Payment Management</h1>
                {user?.role === 'super_admin' && (
                    <button onClick={exportRevenueToCSV} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm rounded-xl">
                        Export Revenue CSV
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[['Total Revenue', '₹4,20,500', 'text-green-400'], ['Today Revenue', '₹8,250', 'text-blue-400'], ['Pending', '₹2,100', 'text-yellow-400'], ['Refunds', '₹1,200', 'text-red-400']].map(([l, v, c]) => (
                    <div key={l} className="bg-[#1a2236] rounded-xl p-5 border border-zinc-800">
                        <p className={`text-2xl font-bold ${c}`}>{v}</p>
                        <p className="text-xs text-zinc-400 mt-1">{l}</p>
                    </div>
                ))}
            </div>
            <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 p-6">
                <h3 className="text-white font-semibold mb-4">Recent Transactions</h3>
                {transactions.map(([u, t, a, s, d], i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                        <div><p className="text-sm text-zinc-200 font-medium">{u}</p><p className="text-xs text-zinc-500">{t} · {d}</p></div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">₹{a}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s === 'completed' ? 'bg-green-500/10 text-green-400' : s === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>{s}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const AdminAnalytics = () => (
    <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[['Total Views', '1.2M', 'text-blue-400'], ['New Users (Week)', '1,240', 'text-green-400'], ['Ads Approved', '8,920', 'text-purple-400'], ['Avg. Session', '4m 32s', 'text-orange-400']].map(([l, v, c]) => (
                <div key={l} className="bg-[#1a2236] rounded-xl p-5 border border-zinc-800">
                    <p className={`text-2xl font-bold ${c}`}>{v}</p>
                    <p className="text-xs text-zinc-400 mt-1">{l}</p>
                </div>
            ))}
        </div>
        <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 p-6">
            <h3 className="text-white font-semibold mb-5">User Growth (Last 8 Weeks)</h3>
            <div className="flex items-end gap-3 h-48">
                {[40, 55, 38, 70, 62, 80, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs text-zinc-500">{h * 130}</span>
                        <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-blue-400 hover:from-blue-400 hover:to-sky-300 cursor-pointer transition-all" style={{ height: `${h}%` }} />
                        <span className="text-[11px] text-zinc-600">W{i + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const AdminCategories = () => {
    const [cats, setCats] = useState([
        { icon: '🚗', name: 'Cars & Bikes', count: '12,400 Posts' },
        { icon: '📱', name: 'Mobiles', count: '8,200 Posts' },
        { icon: '🏠', name: 'Real Estate', count: '5,100 Posts' },
        { icon: '💼', name: 'Jobs', count: '9,300 Posts' },
        { icon: '💻', name: 'Electronics', count: '6,800 Posts' },
        { icon: '🛋️', name: 'Furniture', count: '3,200 Posts' }
    ]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Category Management</h1>
                <button
                    onClick={() => {
                        const name = prompt('Enter new category name:');
                        if (name) setCats([...cats, { icon: '✨', name, count: '0 Posts' }]);
                    }}
                    className="btn-primary text-sm px-4 py-2">+ Add Category</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cats.map((c, idx) => (
                    <div key={idx} className="bg-[#1a2236] rounded-xl p-4 border border-zinc-800 flex items-center gap-4 hover:border-primary/40 transition-all cursor-pointer group">
                        <span className="text-3xl">{c.icon}</span>
                        <div className="flex-1">
                            <p className="text-zinc-200 font-semibold text-sm">{c.name}</p>
                            <p className="text-xs text-zinc-500">{c.count}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs text-primary hover:underline" onClick={() => {
                                const newName = prompt('Edit Category Name:', c.name);
                                if (newName) {
                                    const newCats = [...cats];
                                    newCats[idx].name = newName;
                                    setCats(newCats);
                                }
                            }}>Edit</button>
                            <button className="text-xs text-red-400 hover:underline" onClick={() => {
                                if (confirm(`Delete category ${c.name}?`)) setCats(cats.filter((_, i) => i !== idx));
                            }}>Del</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminLocations = () => {
    const [locations, setLocations] = useState([
        { city: 'Mumbai', state: 'Maharashtra', posts: 12840, users: 3420, status: 'active' },
        { city: 'Delhi', state: 'Delhi NCR', posts: 10230, users: 2910, status: 'active' },
        { city: 'Bengaluru', state: 'Karnataka', posts: 9812, users: 2740, status: 'active' },
        { city: 'Hyderabad', state: 'Telangana', posts: 7340, users: 1980, status: 'active' },
        { city: 'Chennai', state: 'Tamil Nadu', posts: 5920, users: 1640, status: 'active' }
    ]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Location Management</h1>
                <button
                    onClick={() => {
                        const city = prompt('Enter new city name:');
                        if (city) setLocations([{ city, state: 'Custom', posts: 0, users: 0, status: 'active' }, ...locations]);
                    }}
                    className="btn-primary text-sm px-4 py-2">+ Add City</button>
            </div>
            <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead><tr className="border-b border-zinc-800">{['City', 'State', 'Posts', 'Users', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-4">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-zinc-800/60">
                        {locations.map((loc, idx) => (
                            <tr key={idx} className="hover:bg-zinc-800/30 group">
                                <td className="px-5 py-3.5 text-sm font-medium text-zinc-200">{loc.city}</td>
                                <td className="px-5 py-3.5 text-xs text-zinc-400">{loc.state}</td>
                                <td className="px-5 py-3.5 text-xs text-zinc-400">{loc.posts.toLocaleString()}</td>
                                <td className="px-5 py-3.5 text-xs text-zinc-400">{loc.users.toLocaleString()}</td>
                                <td className="px-5 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full ${loc.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{loc.status}</span></td>
                                <td className="px-5 py-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2">
                                        <button className="text-xs text-primary hover:underline" onClick={() => {
                                            const newCity = prompt('Rename city:', loc.city);
                                            if (newCity) {
                                                const newLocs = [...locations];
                                                newLocs[idx].city = newCity;
                                                setLocations(newLocs);
                                            }
                                        }}>Edit</button>
                                        <button className="text-xs text-red-400 hover:underline" onClick={() => {
                                            const newLocs = [...locations];
                                            newLocs[idx].status = newLocs[idx].status === 'active' ? 'disabled' : 'active';
                                            setLocations(newLocs);
                                        }}>Toggle</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminBanners = () => {
    const [banners, setBanners] = useState([
        { name: 'Hero Banner', desc: 'Top of homepage', pos: 'hero', status: 'active' },
        { name: 'Sidebar Banner', desc: 'Right sidebar', pos: 'sidebar', status: 'active' },
        { name: 'Category Banner', desc: 'Above listings', pos: 'category_top', status: 'inactive' },
        { name: 'Footer Banner', desc: 'Bottom of page', pos: 'footer', status: 'active' }
    ]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Banner Management</h1>
                <button
                    onClick={() => alert('Banner Upload Window trigger...')}
                    className="btn-primary text-sm px-4 py-2">+ Upload Banner</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b, idx) => (
                    <div key={idx} className="bg-[#1a2236] rounded-xl border border-zinc-800 p-5 hover:border-primary/40 transition-all group">
                        <div className="h-28 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-zinc-600 text-sm border border-dashed border-zinc-700 relative overflow-hidden group-hover:border-primary/50 transition-colors">
                            {b.name} Preview
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="btn-primary bg-white/20 text-white text-xs px-3 py-1">Change Image</button>
                            </div>
                        </div>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-zinc-200 font-semibold text-sm">{b.name}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{b.desc} · Position: {b.pos}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${b.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-700 text-zinc-400'}`} onClick={() => {
                                    const nb = [...banners];
                                    nb[idx].status = nb[idx].status === 'active' ? 'inactive' : 'active';
                                    setBanners(nb);
                                }}>{b.status}</span>
                                <button className="text-xs text-primary hover:underline" onClick={() => {
                                    const newName = prompt('Enter new banner title:', b.name);
                                    if (newName) {
                                        const nb = [...banners];
                                        nb[idx].name = newName;
                                        setBanners(nb);
                                    }
                                }}>Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminSettings = () => {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6 animate-fade-in relative mb-10">
            <h1 className="text-2xl font-bold text-white">System Settings</h1>
            {[
                { group: 'General', fields: [{ label: 'Site Name', type: 'text', value: 'Ad Empire 360' }, { label: 'Site Tagline', type: 'text', value: 'Buy & Sell Anything Near You' }, { label: 'Contact Email', type: 'email', value: 'admin@adempire360.com' }] },
                { group: 'Promotions Pricing (₹)', fields: [{ label: 'Homepage Featured (24hr)', type: 'number', value: '299' }, { label: 'Pinned Post (7 days)', type: 'number', value: '499' }, { label: 'City Spotlight (30 days)', type: 'number', value: '999' }] },
                { group: 'Platform Limits', fields: [{ label: 'Max Images Per Post', type: 'number', value: '10' }, { label: 'Free Ads Per User', type: 'number', value: '5' }, { label: 'Ad Expiry (Days)', type: 'number', value: '60' }] },
            ].map(({ group, fields }) => (
                <div key={group} className="bg-[#1a2236] rounded-2xl border border-zinc-800 p-6">
                    <h3 className="text-white font-semibold mb-5 text-lg">{group}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fields.map(({ label, type, value }) => (
                            <div key={label}>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                                <input type={type} defaultValue={value} className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 py-2.5 px-3 rounded-xl focus:outline-none focus:border-primary text-sm transition-colors focus:ring-1 focus:ring-primary" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                <button onClick={handleSave} className="btn-primary px-8 py-2.5 shadow-lg">Save Settings Configuration</button>
                {saved && <span className="text-green-400 text-sm font-medium animate-fade-in">✓ Configuration successfully applied!</span>}
            </div>
        </div>
    );
};

const AdminPages = () => {
    const [pages, setPages] = useState([
        { title: 'Home Page', desc: 'Main landing page layout', url: '/' },
        { title: 'About Us', desc: 'Company info & mission', url: '/about' },
        { title: 'Promotional Plans', desc: 'Pricing table for featured ads', url: '/promotions' },
        { title: 'Community Hub', desc: 'User forums and groups', url: '/community' },
        { title: 'Terms & Conditions', desc: 'Legal platform rules', url: '/terms' },
        { title: 'Privacy Policy', desc: 'Data usage details', url: '/privacy' }
    ]);

    return (
        <div className="space-y-6 animate-fade-in mb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Pages Content CMS</h1>
                <button className="btn-primary text-sm px-4 py-2 hover:bg-primary-dark transition-colors" onClick={() => {
                    const newTitle = prompt('Enter new page title:');
                    if (newTitle) setPages([...pages, { title: newTitle, desc: 'Draft custom page', url: `/${newTitle.toLowerCase().replace(/\\s+/g, '-')}` }]);
                }}>+ Create Page</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pages.map((p, idx) => (
                    <div key={idx} className="bg-[#1a2236] rounded-xl border border-zinc-800 p-5 hover:border-primary/40 transition-all flex flex-col justify-between h-full group cursor-pointer shadow-sm hover:shadow-primary/5">
                        <div onClick={() => {
                            const newDesc = prompt(`Edit page description for ${p.title}:`, p.desc);
                            if (newDesc) {
                                const nw = [...pages];
                                nw[idx].desc = newDesc;
                                setPages(nw);
                            }
                        }}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-zinc-200 font-semibold text-base group-hover:text-primary transition-colors">{p.title}</h3>
                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">Published</span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-4">{p.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-xs text-blue-400 font-mono tracking-tight bg-blue-500/10 px-2 py-1 rounded truncate max-w-[150px]">{p.url}</span>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors" onClick={() => {
                                    const newTitle = prompt(`Edit Title for ${p.title}`, p.title);
                                    if (newTitle) {
                                        const np = [...pages];
                                        np[idx].title = newTitle;
                                        setPages(np);
                                    }
                                }}>Rename</button>
                                <button className="text-xs font-medium text-primary hover:text-white transition-colors" onClick={() => {
                                    alert('Visual CMS Editor initialized. Use this in a future feature expansion.');
                                }}>Edit Content</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminBusinessListings = () => {
    const [businesses, setBusinesses] = useState([
        { id: '1', name: 'Sri Ganesh Electricals', category: 'Electrician', city: 'Chennai', status: 'pending', owner: 'Raju M.' },
        { id: '2', name: 'Elite Salon & Spa', category: 'Salon', city: 'Mumbai', status: 'approved', owner: 'Neha S.' },
        { id: '3', name: 'Expert Plumbers', category: 'Plumber', city: 'Bengaluru', status: 'suspended', owner: 'Vikas T.' }
    ]);

    const handleStatus = (idx, status) => {
        const updated = [...businesses];
        updated[idx].status = status;
        setBusinesses(updated);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Business Listings Management</h1>
            </div>
            <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            {['Business Name', 'Category', 'City', 'Owner', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-4">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                        {businesses.map((b, idx) => (
                            <tr key={b.id} className="hover:bg-zinc-800/30">
                                <td className="px-5 py-3.5 text-sm font-medium text-zinc-200">{b.name}</td>
                                <td className="px-5 py-3.5 text-xs text-zinc-400">{b.category}</td>
                                <td className="px-5 py-3.5 text-xs text-zinc-400">{b.city}</td>
                                <td className="px-5 py-3.5 text-xs text-zinc-400">{b.owner}</td>
                                <td className="px-5 py-3.5">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                        b.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    <select
                                        value={b.status}
                                        onChange={e => handleStatus(idx, e.target.value)}
                                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-1 outline-none focus:border-primary"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approve</option>
                                        <option value="suspended">Suspend</option>
                                        <option value="rejected">Reject</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AdminNewsletter = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'super_admin';
    const [emails, setEmails] = useState([]);
    const [newsUpdate, setNewsUpdate] = useState('');
    const [sentUpdates, setSentUpdates] = useState([]);
    const [copied, setCopied] = useState(false);

    useState(() => {
        const stored = JSON.parse(localStorage.getItem('marketplace_newsletter_emails') || '[]');
        setEmails(stored);
        const updates = JSON.parse(localStorage.getItem('marketplace_news_updates') || '[]');
        setSentUpdates(updates);
    });

    const handleSendUpdate = () => {
        if (!newsUpdate.trim()) return;
        const update = {
            id: Date.now(),
            message: newsUpdate,
            sentAt: new Date().toISOString(),
            recipients: emails.length,
        };
        const updated = [update, ...sentUpdates];
        setSentUpdates(updated);
        localStorage.setItem('marketplace_news_updates', JSON.stringify(updated));
        setNewsUpdate('');
    };

    const handleRemoveEmail = (email) => {
        const updated = emails.filter(e => e !== email);
        setEmails(updated);
        localStorage.setItem('marketplace_newsletter_emails', JSON.stringify(updated));
    };

    const handleCopyAll = () => {
        navigator.clipboard.writeText(emails.join(', ')).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleExportEmails = () => {
        const csv = 'Email\n' + emails.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'newsletter_subscribers.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Newsletter & Updates</h1>
                <div className="flex gap-2">
                    <button onClick={handleCopyAll} className="text-sm bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl hover:text-white">
                        {copied ? '✓ Copied!' : 'Copy All Emails'}
                    </button>
                    <button onClick={handleExportEmails} className="btn-primary text-sm px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#1a2236] rounded-xl p-5 border border-zinc-800">
                    <p className="text-2xl font-bold text-blue-400">{emails.length}</p>
                    <p className="text-xs text-zinc-400 mt-1">Total Subscribers</p>
                </div>
                <div className="bg-[#1a2236] rounded-xl p-5 border border-zinc-800">
                    <p className="text-2xl font-bold text-green-400">{sentUpdates.length}</p>
                    <p className="text-xs text-zinc-400 mt-1">Updates Sent</p>
                </div>
                <div className="bg-[#1a2236] rounded-xl p-5 border border-zinc-800">
                    <p className="text-2xl font-bold text-purple-400">{emails.length > 0 ? '98%' : '0%'}</p>
                    <p className="text-xs text-zinc-400 mt-1">Open Rate</p>
                </div>
            </div>

            {/* Compose Update */}
            {isSuperAdmin && (
                <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 p-6">
                    <h3 className="text-white font-semibold mb-4">📢 Send News Update to All Subscribers</h3>
                    <textarea
                        value={newsUpdate}
                        onChange={e => setNewsUpdate(e.target.value)}
                        placeholder="Type your news update message here..."
                        rows={4}
                        className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 py-3 px-4 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                    />
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-zinc-500">Will be sent to {emails.length} subscriber(s)</span>
                        <button onClick={handleSendUpdate} disabled={!newsUpdate.trim()} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                            Send Update
                        </button>
                    </div>
                </div>
            )}

            {/* Sent Updates History */}
            {sentUpdates.length > 0 && (
                <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 p-6">
                    <h3 className="text-white font-semibold mb-4">📨 Sent Updates</h3>
                    <div className="space-y-3">
                        {sentUpdates.map(u => (
                            <div key={u.id} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                                <p className="text-sm text-zinc-200">{u.message}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                                    <span>Sent: {new Date(u.sentAt).toLocaleString('en-IN')}</span>
                                    <span>Recipients: {u.recipients}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Subscriber List */}
            <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 p-6">
                <h3 className="text-white font-semibold mb-4">📧 Subscriber Emails ({emails.length})</h3>
                {emails.length > 0 ? (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {emails.map((email, i) => (
                            <div key={i} className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-2.5 border border-zinc-700 group hover:border-primary/30">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{i + 1}</span>
                                    <span className="text-sm text-zinc-200 font-medium">{email}</span>
                                </div>
                                <button onClick={() => handleRemoveEmail(email)} className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-zinc-500 text-sm">
                        <p className="text-4xl mb-3">📭</p>
                        <p>No subscribers yet. Users can subscribe via the newsletter form in the footer.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { AdminPayments, AdminAnalytics, AdminCategories, AdminLocations, AdminBanners, AdminSettings, AdminPages, AdminBusinessListings, AdminNewsletter };
export default AdminPayments;

