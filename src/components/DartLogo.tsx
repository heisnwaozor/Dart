import React from 'react';

interface DartLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
  withContainer?: boolean;
}

export const DartLogo: React.FC<DartLogoProps> = ({ 
  className = '', 
  size = 40,
  animate = false,
  withContainer = false
}) => {
  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${animate ? 'hover:scale-105 transition-all duration-300' : ''} ${className}`}
    >
      <defs>
        {/* Core Electric Blue & Cyan Wing Gradients */}
        <linearGradient id="dartWingUpperLeft" x1="15" y1="20" x2="60" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="45%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        <linearGradient id="dartWingUpperRight" x1="105" y1="20" x2="60" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="45%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        <linearGradient id="dartWingLowerLeft" x1="25" y1="65" x2="60" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>

        <linearGradient id="dartWingLowerRight" x1="95" y1="65" x2="60" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="60%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>

        {/* High-Precision Metallic & Luminous Dart Gradients */}
        <linearGradient id="dartSpearShaft" x1="28" y1="92" x2="94" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="25%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="75%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="dartFlightFin" x1="22" y1="98" x2="42" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Cyber Neon Glow Filter */}
        <filter id="dartNeonGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="laserBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient Radial Energy Ring */}
      <circle cx="60" cy="60" r="50" stroke="url(#dartWingUpperLeft)" strokeWidth="1" strokeDasharray="4 6" opacity="0.35" className={animate ? 'animate-spin-slow origin-center' : ''} />

      {/* ================= BUTTERFLY WINGS (GEOMETRIC FACETED AERO-SHAPE) ================= */}
      
      {/* Left Upper Wing - Stealth Facets */}
      <path
        d="M 58 48 L 22 22 C 16 38, 20 54, 38 62 L 56 54 Z"
        fill="url(#dartWingUpperLeft)"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />
      {/* Left Wing Facet Inset */}
      <polygon
        points="34,36 48,32 54,48 40,50"
        fill="#38BDF8"
        fillOpacity="0.3"
      />

      {/* Left Lower Wing - Swept Fin */}
      <path
        d="M 56 56 L 36 66 C 30 78, 38 90, 52 86 L 56 62 Z"
        fill="url(#dartWingLowerLeft)"
        stroke="#93C5FD"
        strokeWidth="1"
        strokeOpacity="0.75"
      />

      {/* Right Upper Wing - Stealth Facets */}
      <path
        d="M 62 48 L 98 22 C 104 38, 100 54, 82 62 L 64 54 Z"
        fill="url(#dartWingUpperRight)"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />
      {/* Right Wing Facet Inset */}
      <polygon
        points="86,36 72,32 66,48 80,50"
        fill="#93C5FD"
        fillOpacity="0.3"
      />

      {/* Right Lower Wing - Swept Fin */}
      <path
        d="M 64 56 L 84 66 C 90 78, 82 90, 68 86 L 64 62 Z"
        fill="url(#dartWingLowerRight)"
        stroke="#93C5FD"
        strokeWidth="1"
        strokeOpacity="0.75"
      />

      {/* Butterfly Antennae / Forward Sensor Wings */}
      <path
        d="M 57 32 C 52 20, 42 16, 38 17 M 63 32 C 68 20, 78 16, 82 17"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="38" cy="17" r="2" fill="#38BDF8" filter="url(#laserBeamGlow)" />
      <circle cx="82" cy="17" r="2" fill="#38BDF8" filter="url(#laserBeamGlow)" />

      {/* Butterfly Core Thorax & Abdomen */}
      <ellipse cx="60" cy="54" rx="4" ry="16" fill="#070A13" stroke="#38BDF8" strokeWidth="1.2" />
      <circle cx="60" cy="36" r="3.5" fill="#FFFFFF" />

      {/* ================= THE HIGH-TECH DART (CARRIED / INTEGRATED) ================= */}
      <g filter="url(#dartNeonGlow)">
        
        {/* Dart Flight Stabilizer Fins (Tail) */}
        <polygon
          points="25,95 18,84 32,88"
          fill="url(#dartFlightFin)"
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />
        <polygon
          points="25,95 36,102 32,88"
          fill="url(#dartFlightFin)"
          stroke="#FFFFFF"
          strokeWidth="0.8"
        />

        {/* Central Kinetic Dart Shaft - Piercing Diagonally Forward */}
        <line
          x1="26"
          y1="94"
          x2="94"
          y2="26"
          stroke="url(#dartSpearShaft)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Precision Balance Rings on Dart Shaft */}
        <line x1="50" y1="70" x2="54" y2="66" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <line x1="57" y1="63" x2="61" y2="59" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" />
        <line x1="64" y1="56" x2="68" y2="52" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />

        {/* Needle Spear Tip & Penetration Energy Beacon */}
        <polygon
          points="94,26 102,18 90,30"
          fill="#FFFFFF"
          stroke="#38BDF8"
          strokeWidth="1"
        />
        {/* Luminous Pulsing Laser Tip */}
        <circle cx="102" cy="18" r="2.5" fill="#FFFFFF" filter="url(#laserBeamGlow)" />
      </g>

      {/* Butterfly Grip Talons Locking the Dart */}
      <path
        d="M 57 56 Q 54 62 50 64 M 63 56 Q 66 62 70 54"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );

  if (withContainer) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-2xl p-2 bg-gradient-to-tr from-blue-600 via-sky-400 to-white shadow-xl shadow-blue-500/20 ${className}`}>
        <div className="rounded-[14px] dark:bg-[#070A13] bg-white p-1">
          {svgContent}
        </div>
      </div>
    );
  }

  return svgContent;
};
