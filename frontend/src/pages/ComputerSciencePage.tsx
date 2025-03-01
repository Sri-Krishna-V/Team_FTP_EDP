import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import UnitNavigation from '../components/UnitNavigation';
import Carousel from '../components/Carousel';

const ComputerSciencePage: React.FC = () => {
  const [activeUnit, setActiveUnit] = useState(1);
  
  // Sample progress data (percentage complete for each unit)
  const unitProgress = [100, 85, 70, 50, 30, 10, 0, 0];
  
  const carouselImages = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1564865878688-9a244444042a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Computer Science</h1>
          <p className="text-gray-600">Explore the fundamentals of computer science through interactive lessons</p>
        </div>
        
        <UnitNavigation activeUnit={activeUnit} progress={unitProgress} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Unit Overview</h2>
          <Carousel images={carouselImages} />
          
          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-800 mb-2">What you'll learn</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Fundamentals of programming and computational thinking</li>
              <li>Data structures and algorithms</li>
              <li>Web development basics</li>
              <li>Introduction to databases</li>
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

export default ComputerSciencePage;