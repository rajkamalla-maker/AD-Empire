export const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 172800) return 'Yesterday';
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    return past.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
