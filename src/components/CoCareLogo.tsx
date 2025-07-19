
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
      <svg
        viewBox="0 0 420 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Heart shape with smooth curves */}
        <path
          d="M20 35C20 22 28 12 40 12C47 12 53 16 56 22C59 16 65 12 72 12C84 12 92 22 92 35C92 50 56 78 56 78S20 50 20 35Z"
          fill="url(#heartGradient)"
          className="drop-shadow-lg"
        />
        
        {/* Left C (forming left hand) */}
        <path
          d="M34 28C37 25 41 25 44 28C44 31 44 34 44 37C41 40 37 40 34 37C31 34 31 31 34 28Z"
          fill="white"
          className="drop-shadow-sm"
        />
        <path
          d="M34 28C37 25 41 25 44 28"
          stroke="url(#handGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Right C (forming right hand) */}
        <path
          d="M78 28C75 25 71 25 68 28C68 31 68 34 68 37C71 40 75 40 78 37C81 34 81 31 78 28Z"
          fill="white"
          className="drop-shadow-sm"
        />
        <path
          d="M78 28C75 25 71 25 68 28"
          stroke="url(#handGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Handshake connection */}
        <path
          d="M44 32C48 30 52 30 56 32C60 30 64 30 68 32"
          stroke="url(#handGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="drop-shadow-sm"
        />
        
        {/* Connection dots */}
        <circle cx="50" cy="31" r="1.5" fill="url(#handGradient)" />
        <circle cx="56" cy="32" r="2" fill="url(#handGradient)" />
        <circle cx="62" cy="31" r="1.5" fill="url(#handGradient)" />
        
        {/* CoCare text with ultra-smooth typography */}
        <text
          x="130"
          y="42"
          fontFamily="'SF Pro Display', 'Inter', system-ui, -apple-system, sans-serif"
          fontSize="34"
          fontWeight="500"
          fill="url(#textGradient)"
          dominantBaseline="central"
          letterSpacing="-0.035em"
          className="font-smoothing-antialiased"
        >
          CoCare
        </text>
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          
          <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="30%" stopColor="#1e293b" />
            <stop offset="70%" stopColor="#334155" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          
          {/* Smooth font rendering filter */}
          <filter id="smoothFont">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.1"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default CoCareLogo;
