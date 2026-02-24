import { Link } from 'react-router-dom';

const Sitemap = () => {
    const sections = [
        {
            title: 'Main Pages',
            links: [
                { name: 'Home', path: '/' },
                { name: 'Search Listings', path: '/search' },
                { name: 'Post a Free Ad', path: '/post-ad' },
                { name: 'Promotional Plans', path: '/promotions' },
            ]
        },
        {
            title: 'User Account',
            links: [
                { name: 'Login', path: '/login' },
                { name: 'Register', path: '/register' },
                { name: 'My Profile', path: '/profile' },
                { name: 'Forgot Password', path: '/forgot-password' },
            ]
        },
        {
            title: 'Community & Business',
            links: [
                { name: 'Community Hub', path: '/community' },
                { name: 'Local Groups', path: '/community/local-groups' },
                { name: 'Events', path: '/community/events' },
                { name: 'Trust Center', path: '/community/trust-center' },
                { name: 'Create Business Listing', path: '/business/new' },
            ]
        },
        {
            title: 'Company & Legal',
            links: [
                { name: 'About Us', path: '/about' },
                { name: 'Contact Support', path: '/contact' },
                { name: 'Careers', path: '/careers' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sitemap</h1>
                <p className="text-gray-500 mb-10">An overview of all pages available on Ad Empire 360.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary/40 block"></span>
                                {section.title}
                            </h2>
                            <ul className="space-y-3">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link to={link.path} className="text-gray-600 hover:text-primary hover:underline transition-colors text-sm font-medium">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sitemap;
