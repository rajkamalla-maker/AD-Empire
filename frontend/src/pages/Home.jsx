import { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedAds from '../components/home/FeaturedAds';
import JobsSection from '../components/home/JobsSection';
import CarsSection from '../components/home/CarsSection';
import CommunitySection from '../components/home/CommunitySection';
import PromoBanner from '../components/home/PromoBanner';
import { useLocation } from '../context/LocationContext';

const Home = () => {
    const { location } = useLocation();

    return (
        <div className="animate-fade-in">
            <HeroSection />
            <CategoryGrid />
            <PromoBanner />
            <FeaturedAds />
            <JobsSection />
            <CarsSection />
            <CommunitySection />
        </div>
    );
};

export default Home;
