import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Gauge, Fuel, Settings2 } from 'lucide-react';
import { SectionHeader } from './FeaturedAds';
import { getPosts } from '../../utils/demoData';

const fuelColors = { Petrol: 'text-orange-600', Diesel: 'text-blue-600', Electric: 'text-green-600', Hybrid: 'text-teal-600' };

const CarsSection = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const posts = getPosts().filter(p => p.category === 'vehicles' && p.status === 'approved');
        setCars(posts.slice(0, 4));
    }, []);

    if (cars.length === 0) return null;

    return (
        <section className="py-14 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title="🚗 Cars & Vehicles" subtitle="Pre-owned cars from verified dealers" link="/category/vehicles" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cars.map(car => {
                        const brand = car.title.split(' ')[0] || 'Car';
                        return (
                            <Link key={car._id} to={`/post/${car._id}`} className="card-premium group overflow-hidden block">
                                <div className="relative h-44 overflow-hidden bg-gray-100">
                                    <img src={car.images?.[0] || 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=500&q=80'} alt={car.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                        {brand}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors">{car.title}</h3>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                                        <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-2">
                                            <Gauge className="h-3.5 w-3.5 text-gray-400" />
                                            <span>22k km</span>
                                        </div>
                                        <div className={`flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-2 text-orange-600`}>
                                            <Fuel className="h-3.5 w-3.5" />
                                            <span>Petrol</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg p-2">
                                            <Settings2 className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="truncate">Manual</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-gray-900">₹{(car.price / 100000).toFixed(2)} L</span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="h-3 w-3" />{car.cityName}</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default CarsSection;
