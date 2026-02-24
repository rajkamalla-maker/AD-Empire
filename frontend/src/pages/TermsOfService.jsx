import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const TermsOfService = () => (
    <div className="min-h-screen bg-gray-50 py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <div className="bg-white rounded-2xl shadow-premium border border-gray-100 p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                        <p className="text-gray-500 text-sm">Last updated: February 24, 2026</p>
                    </div>
                </div>

                <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using Ad Empire 360 ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">2. Eligibility</h2>
                        <p>You must be at least 18 years old to use this Platform. By registering, you confirm that you meet this age requirement and that all information provided during registration is accurate and complete.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                            <li>You must provide accurate and up-to-date information in your profile.</li>
                            <li>You are responsible for all activities under your account.</li>
                            <li>Notify us immediately if you suspect unauthorized access to your account.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">4. Posting Advertisements</h2>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>All ads must be accurate, non-misleading, and comply with applicable laws.</li>
                            <li>Prohibited content includes: illegal items, counterfeit goods, weapons, drugs, adult content, and stolen property.</li>
                            <li>You must have legal authority to sell any item you advertise.</li>
                            <li>We reserve the right to remove any ad without prior notice if it violates our policies.</li>
                            <li>Spam or duplicate listings may result in account suspension.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">5. Transactions & Payments</h2>
                        <p>The Platform serves as a listing and communication channel between buyers and sellers. We are not a party to any transaction between users. Therefore:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>We do not guarantee the quality, safety, or legality of items listed.</li>
                            <li>We are not responsible for the fulfillment of any transaction.</li>
                            <li>Users are advised to meet in safe, public locations for exchanges.</li>
                            <li>Promotional services (featured ads, boosts) are non-refundable once activated.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">6. Prohibited Activities</h2>
                        <p>Users shall not:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>Post false, misleading, or defamatory content.</li>
                            <li>Harass, threaten, or abuse other users.</li>
                            <li>Attempt to hack, disrupt, or gain unauthorized access to the Platform.</li>
                            <li>Scrape, crawl, or use bots to extract data from the Platform.</li>
                            <li>Use the Platform for money laundering or any illegal activity.</li>
                            <li>Impersonate another person or entity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
                        <p>All content, design, and branding on the Platform are the intellectual property of Ad Empire 360. Users retain ownership of the content they post but grant us a non-exclusive license to display and distribute it on the Platform.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, Ad Empire 360 shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of the Platform, including but not limited to loss of profits, data, or business opportunities.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">9. Indemnification</h2>
                        <p>You agree to indemnify and hold harmless Ad Empire 360 and its officers, directors, and employees from any claims, losses, or damages arising from your use of the Platform or violation of these Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">10. Modifications</h2>
                        <p>We may update these Terms of Service from time to time. Changes will be effective immediately upon posting. Continued use of the Platform after modifications constitutes acceptance of the updated terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">11. Governing Law</h2>
                        <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
                        <p>For questions regarding these Terms, please contact:</p>
                        <p className="mt-2 font-semibold text-primary">legal@adempire360.com</p>
                    </section>
                </div>
            </div>
        </div>
    </div>
);

export default TermsOfService;
