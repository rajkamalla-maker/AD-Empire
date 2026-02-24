import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const Careers = () => {
    const jobs = [
        { title: 'Senior React Developer', dep: 'Engineering', loc: 'Noida (Hybrid)', type: 'Full-time' },
        { title: 'Product Marketing Manager', dep: 'Marketing', loc: 'Remote', type: 'Full-time' },
        { title: 'Customer Support Lead', dep: 'Operations', loc: 'Bengaluru', type: 'Full-time' },
        { title: 'UI/UX Designer', dep: 'Design', loc: 'Mumbai (Hybrid)', type: 'Contract' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-16 animate-fade-in">
            <div className="bg-primary text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Ad Empire 360</h1>
                    <p className="text-xl text-primary-light max-w-2xl mx-auto">Help us build the most accessible, high-performance marketplace platform in the world.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Open Positions</h2>
                        <p className="text-gray-500 mt-1">We're always looking for talented individuals to join our growing team.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {jobs.map((job, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.dep}</span>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.loc}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.type}</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline">
                                Apply Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-50 rounded-3xl p-8 md:p-12 text-center border border-blue-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't see a perfect fit?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Send us your resume anyway! We are growing fast and always looking for exceptional talent to add to our talent pool.</p>
                    <a href="mailto:careers@adempire360.com" className="btn-primary inline-flex py-3 px-8 shadow-lg">Email your Resume</a>
                </div>
            </div>
        </div>
    );
};

export default Careers;
