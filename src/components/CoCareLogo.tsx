import React from 'react';

interface CoCareLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CoCareLogo: React.FC<CoCareLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Outer circle with gradient */}
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="url(#primaryGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="2"
        />
        
        {/* Inner caring hands/heart shape */}
        <path
          d="M40 45C40 38 45 33 52 33C56 33 59 35 60 38C61 35 64 33 68 33C75 33 80 38 80 45C80 52 60 70 60 70S40 52 40 45Z"
          fill="white"
          fillOpacity="0.95"
        />
        
        {/* Co text */}
        <text
          x="30"
          y="95"
          fontFamily="Inter, sans-serif"
          fontSize="18"
          fontWeight="700"
          fill="white"
          textAnchor="start"
        >
          Co
        </text>
        
        {/* Care text */}
        <text
          x="55"
          y="95"
          fontFamily="Inter, sans-serif"
          fontSize="18"
          fontWeight="300"
          fill="white"
          fillOpacity="0.9"
          textAnchor="start"
        >
          Care
        </text>
        
        {/* Small caring dots around the heart */}
        <circle cx="45" cy="50" r="2" fill="white" fillOpacity="0.6" />
        <circle cx="75" cy="50" r="2" fill="white" fillOpacity="0.6" />
        <circle cx="50" cy="40" r="1.5" fill="white" fillOpacity="0.4" />
        <circle cx="70" cy="40" r="1.5" fill="white" fillOpacity="0.4" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary-dark))" />
          </linearGradient>
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary-light))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default CoCareLogo;