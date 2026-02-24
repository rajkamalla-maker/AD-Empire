import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Building2 } from 'lucide-react';
import { SectionHeader } from './FeaturedAds';
import { getPosts } from '../../utils/demoData';
import { timeAgo } from '../../utils/timeAgo';

const modeColors = { Remote: 'bg-green-100 text-green-700', 'Hybrid': 'bg-purple-100 text-purple-700', 'On-site': 'bg-blue-100 text-blue-700' };

const JobsSection = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const posts = getPosts().filter(p => p.category === 'jobs' && p.status === 'approved');
        setJobs(posts.slice(0, 6));
    }, []);

    if (jobs.length === 0) return null;

    return (
        <section className="py-14 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title="💼 Latest Jobs" subtitle="Find your next big career move" link="/category/jobs" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map(job => {
                        const mode = job.description?.toLowerCase().includes('remote') ? 'Remote' : job.description?.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site';
                        return (
                            <Link key={job._id} to={`/post/${job._id}`} className="card-premium p-5 flex gap-4 group hover:border-primary/20 hover:border border border-transparent">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shadow-inner text-gray-400">
                                    💼
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1"><Building2 className="h-3 w-3" />{job.sellerName}</p>
                                    <div className="flex flex-wrap gap-2 mt-2.5">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${modeColors[mode]}`}>{mode}</span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{job.subCategory || 'Full-time'}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs font-semibold text-primary">₹{Number(job.price || 0).toLocaleString('en-IN')}/mo</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(job.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                <div className="text-center mt-8">
                    <Link to="/category/jobs" className="btn-outline inline-flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Browse All Jobs
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default JobsSection;
