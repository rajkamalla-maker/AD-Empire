import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, UserX, Shield, Eye, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleColors = {
    user: 'bg-gray-100 text-gray-700',
    premium: 'bg-purple-100 text-purple-700',
    city_admin: 'bg-blue-100 text-blue-700',
    admin: 'bg-orange-100 text-orange-700',
    super_admin: 'bg-red-100 text-red-700',
};

const AdminUsers = () => {
    const { user, getAllUsers } = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [approvalMap, setApprovalMap] = useState({});

    useEffect(() => {
        const all = getAllUsers ? getAllUsers() : [];
        setUsers(all);
    }, []);

    const handleApprove = (userId) => {
        setApprovalMap(prev => ({ ...prev, [userId]: 'approved' }));
        // Update in localStorage
        try {
            const existing = JSON.parse(localStorage.getItem('marketplace_registered_users') || '[]');
            const updated = existing.map(u => u._id === userId ? { ...u, isApproved: true } : u);
            localStorage.setItem('marketplace_registered_users', JSON.stringify(updated));
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isApproved: true } : u));
        } catch { }
    };

    const handleReject = (userId) => {
        setApprovalMap(prev => ({ ...prev, [userId]: 'rejected' }));
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isApproved: false, isActive: false } : u));
    };

    const filtered = users.filter(u => {
        const matchSearch = (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.phone || '').includes(search);
        if (filter === 'pending') return matchSearch && !u.isApproved && !['admin', 'super_admin'].includes(u.role);
        if (filter === 'approved') return matchSearch && u.isApproved;
        if (filter === 'suspended') return matchSearch && !u.isActive;
        return matchSearch;
    });

    const stats = {
        total: users.length,
        pending: users.filter(u => !u.isApproved && !['admin', 'super_admin'].includes(u.role)).length,
        approved: users.filter(u => u.isApproved).length,
        admins: users.filter(u => ['admin', 'super_admin', 'city_admin'].includes(u.role)).length,
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Full Name', 'Email', 'Phone', 'City', 'Role', 'Approved', 'Active', 'Joined'];
        const csvContent = [headers.join(',')];

        filtered.forEach(u => {
            const row = [
                u._id,
                `"${u.fullName || ''}"`,
                u.email,
                u.phone || '',
                u.cityName || '',
                u.role || 'user',
                u.isApproved ? 'Yes' : 'No',
                u.isActive ? 'Yes' : 'No',
                u.joined || u.createdAt || ''
            ];
            csvContent.push(row.join(','));
        });

        const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ad_empire_users_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> {stats.total} total users
                    </div>
                    {user?.role === 'super_admin' && (
                        <button onClick={exportToCSV} className="btn-primary flex items-center gap-2 px-4 py-1.5 text-sm rounded-xl">
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats.total, color: 'text-blue-400' },
                    { label: 'Pending Approval', value: stats.pending, color: 'text-yellow-400' },
                    { label: 'Approved', value: stats.approved, color: 'text-green-400' },
                    { label: 'Admins', value: stats.admins, color: 'text-purple-400' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-[#1a2236] rounded-xl p-4 border border-zinc-800">
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-zinc-400 mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="w-full bg-[#1a2236] border border-zinc-700 text-zinc-200 py-2.5 pl-9 pr-4 rounded-xl focus:outline-none focus:border-primary text-sm placeholder-zinc-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'approved', 'suspended'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'bg-[#1a2236] text-zinc-400 border border-zinc-700 hover:text-white'}`}>
                            {f} {f === 'pending' && stats.pending > 0 && <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-1.5 py-0.5">{stats.pending}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#1a2236] rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                {['User', 'Phone', 'City', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-5 py-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="px-5 py-16 text-center text-zinc-500 text-sm">
                                    {filter === 'pending' ? 'No pending users 👍' : 'No users found'}
                                </td></tr>
                            ) : filtered.map(user => (
                                <tr key={user._id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                {(user.fullName || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">{user.fullName}</p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-zinc-400">{user.phone || '—'}</td>
                                    <td className="px-5 py-3.5 text-xs text-zinc-400">{user.cityName || '—'}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[user.role] || roleColors.user}`}>
                                            {(user.role || 'user').replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${user.isApproved ? 'bg-green-500/10 text-green-400' : !user.isActive ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {user.isApproved ? '✓ Approved' : !user.isActive ? '⛔ Rejected' : '⏳ Pending'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-zinc-500">{user.joined || 'N/A'}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!user.isApproved && user.isActive && !['admin', 'super_admin'].includes(user.role) && (
                                                <button onClick={() => handleApprove(user._id)} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg" title="Approve">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {user.isActive && !['admin', 'super_admin'].includes(user.role) && (
                                                <button onClick={() => handleReject(user._id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg" title="Reject/Suspend">
                                                    <UserX className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg" title="Change Role">
                                                <Shield className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filtered.length > 0 && (
                <p className="text-xs text-zinc-500 text-center">
                    Showing {filtered.length} of {users.length} users · New registrations appear here instantly
                </p>
            )}
        </div>
    );
};

export default AdminUsers;
