
import React from 'react';

interface CoCareLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const CoCareLogo: React.FC<CoCareLogoProps> = ({ size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'w-32 h-12',
    md: 'w-64 h-24', 
    lg: 'w-96 h-36',
    xl: 'w-128 h-48'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <img
        src="/lovable-uploads/e178833c-0dd1-4b93-ac98-ee79b48ff832.png"
        alt="CoCare Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default CoCareLogo;
