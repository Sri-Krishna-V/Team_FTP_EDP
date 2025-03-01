import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import UnitNavigation from '../components/UnitNavigation';
import Carousel from '../components/Carousel';

const EDPPage: React.FC = () => {
  const [activeUnit, setActiveUnit] = useState(1);
  
  // Sample progress data (percentage complete for each unit)
  const unitProgress = [100, 85, 70, 50, 30, 10, 0, 0];
  
  const carouselImages = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  ];

  const carouselCaptions = [
    "Entrepreneurship Development Program - Building Future Leaders",
    "Learn Business Fundamentals and Market Analysis",
    "Develop Your Business Plan and Pitch Skills",
    "Connect with Mentors and Investors"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Entrepreneurship Development Program</h1>
          <p className="text-gray-600">Explore the fundamentals of entrepreneurship through interactive lessons</p>
        </div>
        
        <UnitNavigation activeUnit={activeUnit} progress={unitProgress} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Unit Overview</h2>
          <Carousel images={carouselImages} captions={carouselCaptions} />
          
          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-800 mb-2">What you'll learn</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Fundamentals of entrepreneurship and business planning</li>
              <li>Market research and customer discovery</li>
              <li>Financial modeling and funding strategies</li>
              <li>Pitching and presentation skills</li>
            </ul>
            
            <div className="mt-6">
              <Link 
                to={`/unit/${activeUnit}`}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Start Learning Unit {activeUnit}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EDPPage;