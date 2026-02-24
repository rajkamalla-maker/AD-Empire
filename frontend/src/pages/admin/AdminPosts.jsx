import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Star, Trash2, Search, RefreshCw, Plus, Edit3, X } from 'lucide-react';
import { getPosts, savePosts, addPost } from '../../utils/demoData';
import { formatDate } from '../../utils/timeAgo';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-400',
    approved: 'bg-green-500/10 text-green-400',
    rejected: 'bg-red-500/10 text-red-400',
    sold: 'bg-purple-500/10 text-purple-400',
};

const EMPTY_POST = {
    title: '', description: '', price: '', category: 'vehicles',
    subCategory: '', cityName: '', state: '', sellerName: '',
    phone: '', adType: 'paid', status: 'approved',
    images: ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&q=80'],
};

const AdminPosts = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'super_admin';
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingPost, setEditingPost] = useState(null); // null | 'new' | post object
    const [formData, setFormData] = useState({ ...EMPTY_POST });

    const loadPosts = () => {
        setPosts(getPosts());
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = posts.map(p => p._id === id ? { ...p, status: newStatus } : p);
        savePosts(updated);
        setPosts(updated);
    };

    const deletePost = (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
        const updated = posts.filter(p => p._id !== id);
        savePosts(updated);
        setPosts(updated);
    };

    const filtered = posts.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(search.toLowerCase());
        const userMatch = p.sellerName?.toLowerCase().includes(search.toLowerCase());
        const idMatch = p._id?.toLowerCase().includes(search.toLowerCase());
        const matchesSearch = titleMatch || userMatch || idMatch;

        if (activeTab !== 'all') return matchesSearch && p.status === activeTab;
        return matchesSearch;
    });

    const pendingCount = posts.filter(p => p.status === 'pending').length;
    const soldCount = posts.filter(p => p.status === 'sold').length;

    const toggleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(filtered.map(p => p._id));
        else setSelectedIds([]);
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    const handleBulkAction = (action) => {
        if (!selectedIds.length) return;
        if (action === 'delete') {
            if (!window.confirm(`Delete ${selectedIds.length} posts forever?`)) return;
            const updated = posts.filter(p => !selectedIds.includes(p._id));
            savePosts(updated);
            setPosts(updated);
        } else {
            const updated = posts.map(p => selectedIds.includes(p._id) ? { ...p, status: action } : p);
            savePosts(updated);
            setPosts(updated);
        }
        setSelectedIds([]);
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Title', 'Category', 'Seller', 'City', 'Price', 'Status', 'Date Added'];
        const csvContent = [headers.join(',')];
        filtered.forEach(post => {
            const row = [
                post._id,
                `"${(post.title || '').replace(/"/g, '""')}"`,
                post.category,
                `"${post.sellerName}"`,
                post.cityName,
                post.price,
                post.status,
                post.createdAt
            ];
            csvContent.push(row.join(','));
        });
        const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ad_empire_posts_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ── Create / Edit form handlers ──
    const openCreateForm = () => {
        setFormData({ ...EMPTY_POST });
        setEditingPost('new');
    };

    const openEditForm = (post) => {
        setFormData({ ...post });
        setEditingPost(post);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSave = () => {
        if (!formData.title.trim()) return alert('Title is required');
        if (editingPost === 'new') {
            // Create new post
            addPost({
                title: formData.title,
                description: formData.description,
                price: Number(formData.price) || 0,
                category: formData.category,
                subCategory: formData.subCategory,
                cityName: formData.cityName,
                state: formData.state,
                sellerName: formData.sellerName || 'Admin',
                phone: formData.phone || '0000000000',
                adType: formData.adType,
                images: formData.images,
                status: formData.status,
            });
        } else {
            // Update existing post
            const updated = posts.map(p => {
                if (p._id === editingPost._id) {
                    return {
                        ...p,
                        title: formData.title,
                        description: formData.description,
                        price: Number(formData.price) || 0,
                        category: formData.category,
                        subCategory: formData.subCategory,
                        cityName: formData.cityName,
                        state: formData.state,
                        sellerName: formData.sellerName,
                        phone: formData.phone,
                        adType: formData.adType,
                        status: formData.status,
                    };
                }
                return p;
            });
            savePosts(updated);
        }
        setEditingPost(null);
        loadPosts();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Edit/Create Modal */}
            {editingPost && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditingPost(null)}>
                    <div className="bg-[#1a2236] rounded-2xl border border-zinc-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingPost === 'new' ? '➕ Create New Post' : '✏️ Edit Post'}
                            </h2>
                            <button onClick={() => setEditingPost(null)} className="text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { name: 'title', label: 'Title', type: 'text', span: 2 },
                                { name: 'description', label: 'Description', type: 'textarea', span: 2 },
                                { name: 'price', label: 'Price (₹)', type: 'number' },
                                { name: 'category', label: 'Category', type: 'select', options: ['vehicles', 'mobiles', 'real-estate', 'jobs', 'furniture', 'fashion', 'services', 'pets', 'sports', 'education', 'other'] },
                                { name: 'subCategory', label: 'Sub Category', type: 'text' },
                                { name: 'cityName', label: 'City', type: 'text' },
                                { name: 'state', label: 'State', type: 'text' },
                                { name: 'sellerName', label: 'Seller Name', type: 'text' },
                                { name: 'phone', label: 'Phone', type: 'text' },
                                { name: 'adType', label: 'Ad Type', type: 'select', options: ['free', 'paid'] },
                                { name: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected', 'sold'] },
                            ].map(field => (
                                <div key={field.name} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea name={field.name} value={formData[field.name] || ''} onChange={handleFormChange} rows={3}
                                            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 py-2.5 px-3 rounded-xl focus:outline-none focus:border-primary text-sm" />
                                    ) : field.type === 'select' ? (
                                        <select name={field.name} value={formData[field.name] || ''} onChange={handleFormChange}
                                            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 py-2.5 px-3 rounded-xl focus:outline-none focus:border-primary text-sm capitalize">
                                            {field.options.map(o => <option key={o} value={o}>{o.replace(/-/g, ' ')}</option>)}
                                        </select>
                                    ) : (
                                        <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleFormChange}
                                            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 py-2.5 px-3 rounded-xl focus:outline-none focus:border-primary text-sm" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-700">
                            <button onClick={handleFormSave} className="btn-primary px-6 py-2.5 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" /> {editingPost === 'new' ? 'Create Post' : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditingPost(null)} className="px-6 py-2.5 text-zinc-400 hover:text-white border border-zinc-700 rounded-xl">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Post Management</h1>
                <div className="flex gap-2">
                    {isSuperAdmin && (
                        <button onClick={openCreateForm} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm rounded-xl">
                            <Plus className="h-4 w-4" /> Create Post
                        </button>
                    )}
                    <button onClick={loadPosts} className="btn-outline flex items-center gap-2 border-zinc-700 text-zinc-300 hover:text-white px-4 py-2 text-sm rounded-xl">
                        <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                    {isSuperAdmin && (
                        <button onClick={exportToCSV} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-green-600 hover:bg-green-700">
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {['all', 'pending', 'approved', 'rejected', 'sold'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-primary text-white' : 'bg-[#1a2236] text-zinc-400 border border-zinc-700 hover:text-white'}`}>
                            {tab} {tab === 'pending' && pendingCount > 0 && <span className="ml-1.5 bg-yellow-500 text-black text-xs rounded-full px-1.5 py-0.5">{pendingCount}</span>}
                            {tab === 'sold' && soldCount > 0 && <span className="ml-1.5 bg-purple-500 text-white text-xs rounded-full px-1.5 py-0.5">{soldCount}</span>}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-xl">
                            <span className="text-xs text-primary font-medium">{selectedIds.length} Selected</span>
                            <div className="h-4 w-px bg-primary/30 mx-1"></div>
                            <button onClick={() => handleBulkAction('approved')} className="text-xs text-green-400 hover:text-green-300">Approve</button>
                            <button onClick={() => handleBulkAction('rejected')} className="text-xs text-red-400 hover:text-red-300 ml-2">Reject</button>
                            <button onClick={() => handleBulkAction('delete')} className="text-xs text-red-500 hover:text-red-400 ml-2 font-semibold">Delete</button>
                        </div>
                    )}
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <input type="text" placeholder="Search by title, seller..." className="bg-[#1a2236] border border-zinc-700 text-zinc-200 py-2 pl-9 pr-4 rounded-xl focus:outline-none focus:border-primary text-sm placeholder-zinc-500 w-full sm:w-60 transition-all font-medium" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 overflow-hidden shadow-premium">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/50">
                                <th className="px-5 py-4 w-12 text-left">
                                    <input type="checkbox" onChange={toggleSelectAll} checked={filtered.length > 0 && selectedIds.length === filtered.length} className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 checked:bg-primary text-primary focus:ring-0 cursor-pointer" />
                                </th>
                                {['Post Info', 'Category', 'Seller', 'City', 'Status', 'Date', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 py-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {filtered.length > 0 ? filtered.map(post => (
                                <tr key={post._id} className={`hover:bg-zinc-800/30 transition-colors group ${selectedIds.includes(post._id) ? 'bg-primary/5' : ''}`}>
                                    <td className="px-5 py-3.5">
                                        <input type="checkbox" checked={selectedIds.includes(post._id)} onChange={() => toggleSelect(post._id)} className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 checked:bg-primary text-primary focus:ring-0 cursor-pointer" />
                                    </td>
                                    <td className="px-2 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                                                <img src={post.images?.[0] || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500&q=80'} alt="preview" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-zinc-200 line-clamp-1 max-w-[200px]" title={post.title}>{post.title}</div>
                                                <div className="text-xs text-zinc-500">ID: {post._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-3.5">
                                        <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full font-medium capitalize truncate block max-w-24 border border-blue-500/20">
                                            {post.category.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3.5 text-xs text-zinc-400 font-medium">{post.sellerName}</td>
                                    <td className="px-2 py-3.5 text-xs text-zinc-400">{post.cityName}</td>
                                    <td className="px-2 py-3.5">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize border ${statusColors[post.status] || statusColors.pending} border-current/20`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3.5 text-xs text-zinc-500">{formatDate(post.createdAt)}</td>
                                    <td className="px-2 py-3.5">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {post.status !== 'approved' && (
                                                <button onClick={() => updateStatus(post._id, 'approved')} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg" title="Approve">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {post.status !== 'rejected' && (
                                                <button onClick={() => updateStatus(post._id, 'rejected')} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg" title="Reject">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {isSuperAdmin && (
                                                <button onClick={() => openEditForm(post)} className="p-1.5 text-orange-400 hover:bg-orange-400/10 rounded-lg" title="Edit Post">
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                            )}
                                            <a href={`/post/${post._id}`} target="_blank" rel="noreferrer" className="p-1.5 text-zinc-400 hover:bg-zinc-700 rounded-lg" title="View Ad on Site">
                                                <Eye className="h-4 w-4" />
                                            </a>
                                            <button onClick={() => deletePost(post._id)} className="p-1.5 text-red-500 hover:bg-red-500/20 rounded-lg ml-2" title="Permanently Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-5 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="h-8 w-8 text-zinc-700 mb-3" />
                                            <p className="text-zinc-400 text-sm font-medium">No posts found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPosts;
