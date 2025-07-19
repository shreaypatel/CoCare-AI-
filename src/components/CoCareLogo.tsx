import React from 'react';

interface CoCareLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CoCareLogo: React.FC<CoCareLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-20 h-8',
    md: 'w-40 h-16', 
    lg: 'w-60 h-24',
    xl: 'w-80 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <svg
        viewBox="0 0 280 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Heart with puzzle piece cutout */}
        <path
          d="M20 30C20 22 26 16 34 16C38 16 42 18 44 22C46 18 50 16 54 16C62 16 68 22 68 30C68 38 44 62 44 62S20 38 20 30Z"
          fill="#87CEEB"
        />
        
        {/* Puzzle piece cutout in heart */}
        <path
          d="M48 28L52 28C54 28 56 30 56 32C56 34 54 36 52 36L50 36L50 40C50 42 48 44 46 44C44 44 42 42 42 40L42 36L40 36C38 36 36 34 36 32C36 30 38 28 40 28L44 28L44 24C44 22 46 20 48 20C50 20 52 22 52 24L52 28L48 28Z"
          fill="white"
        />
        
        {/* CoCare text */}
        <text
          x="85"
          y="48"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="36"
          fontWeight="400"
          fill="#87CEEB"
          textAnchor="start"
        >
          CoCare
        </text>
      </svg>
    </div>
  );
};

export default CoCareLogo;