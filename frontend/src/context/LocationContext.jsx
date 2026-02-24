import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('marketplace_location');
        if (saved) {
            try {
                setLocation(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const updateLocation = (newLoc) => {
        setLocation(newLoc);
        localStorage.setItem('marketplace_location', JSON.stringify(newLoc));
    };

    const clearLocation = () => {
        setLocation(null);
        localStorage.removeItem('marketplace_location');
    };

    return (
        <LocationContext.Provider value={{ location, updateLocation, clearLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
