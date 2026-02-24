import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <div className="bg-white rounded-2xl shadow-premium border border-gray-100 p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                        <p className="text-gray-500 text-sm">Last updated: February 24, 2026</p>
                    </div>
                </div>

                <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you create an account, post an advertisement, or communicate with other users. This includes:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li><strong>Personal Information:</strong> Full name, email address, phone number, city, and address.</li>
                            <li><strong>Account Data:</strong> Login credentials, profile picture, and preferences.</li>
                            <li><strong>Ad Content:</strong> Titles, descriptions, images, pricing, and category selections.</li>
                            <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns.</li>
                            <li><strong>Device Information:</strong> Browser type, operating system, and IP address.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
                        <p>We use the information collected for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>To provide, maintain, and improve our marketplace platform.</li>
                            <li>To process and display your advertisements to potential buyers.</li>
                            <li>To verify user accounts and prevent fraud or abuse.</li>
                            <li>To send you updates, notifications, and promotional content (with your consent).</li>
                            <li>To respond to your inquiries and provide customer support.</li>
                            <li>To analyze usage trends and improve user experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
                        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li><strong>With Other Users:</strong> Your public profile and ad details are visible to other users.</li>
                            <li><strong>Service Providers:</strong> We may share data with trusted third-party services that assist platform operations.</li>
                            <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process.</li>
                            <li><strong>Safety:</strong> To protect the rights, property, or safety of our users and platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies & Tracking</h2>
                        <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze traffic, and personalize content. You can control cookie settings through your browser preferences.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>Access, update, or delete your personal information at any time.</li>
                            <li>Opt out of marketing communications.</li>
                            <li>Request a copy of the data we hold about you.</li>
                            <li>Lodge a complaint with a data protection authority.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Data Retention</h2>
                        <p>We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data by contacting our support team.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
                        <p>If you have questions or concerns about this Privacy Policy, please contact us at:</p>
                        <p className="mt-2 font-semibold text-primary">privacy@adempire360.com</p>
                    </section>
                </div>
            </div>
        </div>
    </div>
);

export default PrivacyPolicy;
