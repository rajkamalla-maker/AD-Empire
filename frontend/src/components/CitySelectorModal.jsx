import { MapPin, CheckCircle, X, Navigation, Globe } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useState, useEffect } from 'react';

const DUMMY_CITIES = [
    { id: '1', name: 'Chennai', state: 'Tamil Nadu', icon: '🏖️' },
    { id: '2', name: 'Pondicherry', state: 'Puducherry', icon: '🌊' },
    { id: '3', name: 'Villupuram', state: 'Tamil Nadu', icon: '🌴' },
    { id: '4', name: 'Cuddalore', state: 'Tamil Nadu', icon: '🏭' },
    { id: '5', name: 'Mumbai', state: 'Maharashtra', icon: '🏙️' },
    { id: '6', name: 'Bengaluru', state: 'Karnataka', icon: '💻' },
    { id: '7', name: 'Hyderabad', state: 'Telangana', icon: '🕌' },
    { id: '8', name: 'Madurai', state: 'Tamil Nadu', icon: '🛕' },
];

const CitySelectorModal = ({ onClose }) => {
    const { location, updateLocation, clearLocation } = useLocation();
    const [search, setSearch] = useState('');
    const [gpsLoading, setGpsLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleSelect = (city) => {
        updateLocation({ city: city.name, state: city.state, _id: city.id });
        onClose();
    };

    const handleClearLocation = () => {
        clearLocation();
        onClose();
    };

    const handleGpsLocation = () => {
        setGpsLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                // In a real app, you'd reverse geocode the lat/lon to a city name
                // For this demo, we'll mock a successful location fetch
                setTimeout(() => {
                    updateLocation({ city: 'Current Location', state: 'GPS Detected', _id: 'gps', lat: position.coords.latitude, lon: position.coords.longitude });
                    setGpsLoading(false);
                    onClose();
                }, 1000);
            }, (error) => {
                console.error("GPS Error:", error);
                alert("Could not determine location. Please select manually.");
                setGpsLoading(false);
            });
        } else {
            alert("Geolocation is not supported by your browser.");
            setGpsLoading(false);
        }
    };

    const filtered = DUMMY_CITIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.state.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-premium overflow-hidden transform animate-slide-up">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Where are you looking?</h2>
                            <p className="text-sm text-gray-500">Select city to see local ads and services</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6 relative">
                        <input
                            type="text"
                            className="input-field pl-11 py-3.5 bg-gray-50 border-transparent shadow-inner focus:bg-white text-lg"
                            placeholder="Search your city or state..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                        />
                        <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <button
                            onClick={handleGpsLocation}
                            disabled={gpsLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                            {gpsLoading ? <span className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" /> : <Navigation className="w-5 h-5" />}
                            {gpsLoading ? 'Detecting...' : 'Use Current Location'}
                        </button>
                        <button
                            onClick={handleClearLocation}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors border ${!location ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'}`}
                        >
                            <Globe className="w-5 h-5" />
                            Search Globally
                        </button>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popular Cities</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {filtered.map((city) => (
                            <button
                                key={city.id}
                                onClick={() => handleSelect(city)}
                                className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${location?.city === city.name
                                    ? 'border-primary bg-primary/5 shadow-md'
                                    : 'border-gray-100 hover:border-primary/40 hover:bg-gray-50 hover:shadow-soft'
                                    }`}
                            >
                                {location?.city === city.name && (
                                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
                                )}
                                <span className="text-3xl mb-2 filter drop-shadow-sm group-hover:scale-110 transition-transform">{city.icon}</span>
                                <span className={`font-medium text-sm ${location?.city === city.name ? 'text-primary' : 'text-gray-700'}`}>
                                    {city.name}
                                </span>
                                <span className="text-xs text-gray-400 mt-1">{city.state}</span>
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">No cities found matching "{search}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitySelectorModal;
