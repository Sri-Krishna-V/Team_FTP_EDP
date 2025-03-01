import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface UnitNavigationProps {
  activeUnit: number;
  progress: number[];
}

const UnitNavigation: React.FC<UnitNavigationProps> = ({ activeUnit, progress }) => {
  const location = useLocation();
  const totalUnits = 8;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        {Array.from({ length: totalUnits }, (_, i) => i + 1).map((unit) => (
          <Link
            key={unit}
            to={`/unit/${unit}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeUnit === unit
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Home Unit {unit}
          </Link>
        ))}
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div className="flex h-full">
          {progress.map((value, index) => (
            <div
              key={index}
              className={`h-full ${getProgressColor(value)}`}
              style={{ width: `${100 / totalUnits}%`, opacity: value / 100 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const getProgressColor = (value: number): string => {
  if (value < 30) return 'bg-red-500';
  if (value < 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default UnitNavigation;