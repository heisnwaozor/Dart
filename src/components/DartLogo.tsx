import React from 'react';

interface DartLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const DartLogo: React.FC<DartLogoProps> = ({ 
  className = '', 
  size = 40,
  animate = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${animate ? 'hover:scale-110 hover:rotate-6 transition-all duration-300' : ''} ${className}`}
    >
      <defs>
        <linearGradient id="dartLogoGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Top Diamond */}
      <rect
        x="37.75"
        y="15.25"
        width="24.5"
        height="24.5"
        rx="2.5"
        transform="rotate(45 50 27.5)"
        fill="url(#dartLogoGrad)"
      />

      {/* Right Diamond */}
      <rect
        x="60.25"
        y="37.75"
        width="24.5"
        height="24.5"
        rx="2.5"
        transform="rotate(45 72.5 50)"
        fill="url(#dartLogoGrad)"
      />

      {/* Bottom Diamond */}
      <rect
        x="37.75"
        y="60.25"
        width="24.5"
        height="24.5"
        rx="2.5"
        transform="rotate(45 50 72.5)"
        fill="url(#dartLogoGrad)"
      />

      {/* Left Diamond */}
      <rect
        x="15.25"
        y="37.75"
        width="24.5"
        height="24.5"
        rx="2.5"
        transform="rotate(45 27.5 50)"
        fill="url(#dartLogoGrad)"
      />
    </svg>
  );
};
