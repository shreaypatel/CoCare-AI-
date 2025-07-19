
import React from 'react';

interface CoCareLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CoCareLogo: React.FC<CoCareLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-24 h-8',
    md: 'w-48 h-16', 
    lg: 'w-72 h-24',
    xl: 'w-96 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <svg
        viewBox="0 0 300 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Heart shape */}
        <path
          d="M20 35C20 25 28 17 38 17C43 17 47 19 50 23C53 19 57 17 62 17C72 17 80 25 80 35C80 45 50 75 50 75S20 45 20 35Z"
          fill="#87CEEB"
        />
        
        {/* Puzzle piece cutout - cross shape with rounded knobs */}
        <g fill="white">
          {/* Vertical bar of cross */}
          <rect x="44" y="25" width="12" height="30" rx="2" />
          {/* Horizontal bar of cross */}
          <rect x="30" y="35" width="40" height="10" rx="2" />
          {/* Top knob */}
          <circle cx="50" cy="25" r="4" />
          {/* Bottom knob */}
          <circle cx="50" cy="55" r="4" />
          {/* Left knob */}
          <circle cx="30" cy="40" r="4" />
          {/* Right knob */}
          <circle cx="70" cy="40" r="4" />
        </g>
        
        {/* CoCare text */}
        <text
          x="95"
          y="50"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="600"
          fill="#87CEEB"
          dominantBaseline="middle"
        >
          CoCare
        </text>
      </svg>
    </div>
  );
};

export default CoCareLogo;
