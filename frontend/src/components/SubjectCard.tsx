import React from 'react';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
  title: string;
  imageUrl: string;
  bgColor: string;
  link: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ title, imageUrl, bgColor, link }) => {
  return (
    <Link to={link} className="block">
      <div className="flex flex-col h-full rounded overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4 bg-white flex items-center justify-center h-40">
          <img src={imageUrl} alt={title} className="max-h-full max-w-full" />
        </div>
        <div className={`${bgColor} text-white text-center py-3 font-bold text-lg`}>
          {title}
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;