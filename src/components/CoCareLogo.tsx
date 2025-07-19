
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
