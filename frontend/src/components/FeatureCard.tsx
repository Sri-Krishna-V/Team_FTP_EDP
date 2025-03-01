import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  bgColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-lg p-6 text-white transition-transform duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        <div className="bg-white/20 p-2 rounded-full">
          <ArrowRight className="h-5 w-5 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/80 mb-4">{description}</p>
      <Link to={link} className="inline-block mt-2 text-white font-medium hover:underline">
        Learn more
      </Link>
    </div>
  );
};

export default FeatureCard;