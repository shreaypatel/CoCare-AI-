
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
        viewBox="0 0 400 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Heart shape with smooth curves based on template */}
        <path
          d="M15 30C15 18 23 8 35 8C42 8 48 12 52 18C56 12 62 8 69 8C81 8 89 18 89 30C89 45 52 75 52 75S15 45 15 30Z"
          fill="url(#heartGradient)"
          className="drop-shadow-sm"
        />
        
        {/* Puzzle piece - refined shape */}
        <path
          d="M40 28C40 25 42 23 45 23H50C52 21 55 21 57 23C59 25 59 28 57 30C59 32 59 35 57 37C55 39 52 39 50 37H45C42 39 40 39 38 37C36 35 36 32 38 30C36 28 36 25 38 23C40 21 42 21 45 23V28H50C52 26 54 26 56 28C58 30 58 32 56 34H50V37H45C42 37 40 35 40 32V28Z"
          fill="white"
          className="drop-shadow-sm"
        />
        
        {/* Inner puzzle detail */}
        <circle cx="47" cy="30" r="2" fill="url(#heartGradient)" />
        
        {/* CooCare text with modern typography */}
        <text
          x="110"
          y="42"
          fontFamily="'Inter', system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="600"
          fill="url(#textGradient)"
          dominantBaseline="central"
          letterSpacing="-0.025em"
        >
          CoCare
        </text>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default CoCareLogo;
