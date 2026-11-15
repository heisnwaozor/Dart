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
        {/* Sketch Hand Gradients */}
        <linearGradient id="sketchHandGrad" x1="20" y1="100" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="sketchDartGrad" x1="22" y1="96" x2="102" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="35%" stopColor="#3B82F6" />
          <stop offset="70%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="sketchFlightGrad" x1="16" y1="84" x2="36" y2="104" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.15" />
        </linearGradient>

        {/* Sketch Glow Filter */}
        <filter id="sketchGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Drafting and Sketch Construction Guide Rings */}
      <circle 
        cx="60" 
        cy="60" 
        r="52" 
        stroke="#38BDF8" 
        strokeWidth="0.8" 
        strokeDasharray="3 5" 
        opacity="0.3" 
        className={animate ? 'animate-spin-slow origin-center' : ''} 
      />
      <circle 
        cx="96" 
        cy="24" 
        r="14" 
        stroke="#60A5FA" 
        strokeWidth="0.6" 
        strokeDasharray="2 3" 
        opacity="0.35" 
      />

      {/* Sketchy aim vector lines towards the bullseye */}
      <line x1="86" y1="34" x2="114" y2="6" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      <line x1="92" y1="40" x2="112" y2="20" stroke="#38BDF8" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4" />

      {/* 2. Dart Assembly (Tail at bottom-left, needle aimed at top-right) */}
      
      {/* Flight Fins (Stabilizer Tail) */}
      <g id="dart-flight">
        <path
          d="M 27 93 L 15 85 L 20 75 L 31 87 Z"
          fill="url(#sketchFlightGrad)"
          stroke="url(#sketchDartGrad)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M 27 93 L 23 105 L 34 102 L 35 91 Z"
          fill="url(#sketchFlightGrad)"
          stroke="url(#sketchDartGrad)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* Sketchy inner fin rib lines */}
        <line x1="21" y1="80" x2="28" y2="89" stroke="#38BDF8" strokeWidth="0.8" opacity="0.7" />
        <line x1="28" y1="103" x2="31" y2="93" stroke="#38BDF8" strokeWidth="0.8" opacity="0.7" />
        <line x1="14" y1="84" x2="27" y2="92" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.5" strokeDasharray="2 1" />
      </g>

      {/* Dart Shaft (Slim connector stem) */}
      <line x1="26" y1="94" x2="48" y2="72" stroke="url(#sketchDartGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="27" y1="96" x2="49" y2="74" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

      {/* Dart Barrel (Precision Knurled Grip Zone) */}
      <line x1="48" y1="72" x2="78" y2="42" stroke="url(#sketchDartGrad)" strokeWidth="4.2" strokeLinecap="round" />
      <line x1="47" y1="70" x2="77" y2="40" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      <line x1="49" y1="74" x2="79" y2="44" stroke="#1D4ED8" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

      {/* Knurling Texture Rings on Dart Barrel */}
      <line x1="52" y1="66" x2="55" y2="69" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="56" y1="62" x2="59" y2="65" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="60" y1="58" x2="63" y2="61" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="64" y1="54" x2="67" y2="57" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="68" y1="50" x2="71" y2="53" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

      {/* Dart Needle Point (Steel Tip) */}
      <line x1="78" y1="42" x2="96" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <line x1="79" y1="41" x2="97" y2="23" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      
      {/* Needle Tip Energy Beacon */}
      <circle cx="96" cy="24" r="2.8" fill="#FFFFFF" filter="url(#sketchGlow)" />
      <circle cx="96" cy="24" r="1.3" fill="#38BDF8" />

      {/* 3. The Sketchy Hand Holding the Dart */}
      <g id="sketchy-hand">
        {/* Palm & Wrist Hatch Shading */}
        <g opacity="0.35" stroke="#38BDF8" strokeWidth="0.8">
          <line x1="34" y1="84" x2="40" y2="80" />
          <line x1="36" y1="87" x2="42" y2="83" />
          <line x1="38" y1="90" x2="44" y2="86" />
          <line x1="41" y1="93" x2="47" y2="89" />
          <line x1="28" y1="98" x2="34" y2="94" />
          <line x1="30" y1="101" x2="36" y2="97" />
        </g>

        {/* Wrist & Forearm Contours (Sketchy double line) */}
        <path
          d="M 18 106 C 24 100, 28 92, 34 84 C 38 78, 42 74, 46 72"
          stroke="url(#sketchHandGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 16 109 C 22 103, 26 95, 32 87"
          stroke="#38BDF8"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="4 2"
          opacity="0.5"
          fill="none"
        />

        {/* Curled Pinky and Ring Fingers (Tucked gracefully into palm) */}
        <path
          d="M 33 85 C 38 88, 44 88, 48 83 C 51 79, 49 75, 46 73"
          stroke="url(#sketchHandGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 39 80 C 44 83, 50 82, 53 77 C 55 73, 52 70, 48 68"
          stroke="url(#sketchHandGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Middle Finger (Supporting the dart barrel from below) */}
        <path
          d="M 45 72 C 50 76, 56 75, 60 70 C 63 66, 61 62, 57 62"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 46 74 C 51 78, 57 77, 61 72"
          stroke="#38BDF8"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />

        {/* Thumb (Curving up to pinch the dart barrel) */}
        <path
          d="M 34 84 C 38 78, 44 72, 48 65 C 51 60, 54 58, 58 60 C 60 61, 60 65, 56 68 C 52 71, 48 76, 44 82"
          stroke="url(#sketchHandGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Thumb Tendon Guide Mark */}
        <path
          d="M 40 76 C 44 71, 48 67, 52 64"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.75"
          fill="none"
        />
        {/* Thumb Contact Pad on Barrel */}
        <path
          d="M 54 62 C 56 60, 59 61, 60 63 C 60 66, 57 68, 55 67"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Index Finger (Poised on top of the dart barrel in precision throwing grip) */}
        <path
          d="M 36 68 C 40 56, 48 44, 56 38 C 64 32, 70 34, 73 39 C 76 44, 74 50, 71 54 C 69 57, 65 57, 62 55"
          stroke="url(#sketchHandGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Sketchy secondary guide stroke over the index knuckle curve */}
        <path
          d="M 46 48 C 52 40, 59 36, 66 34 C 71 33, 75 36, 76 41 C 77 46, 74 51, 70 55"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="6 3"
          opacity="0.8"
          fill="none"
        />
        {/* Index Fingertip Contact Pad */}
        <path
          d="M 68 48 C 71 49, 73 52, 71 55 C 69 57, 66 57, 64 54"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Knuckle Sketch Creases */}
        <line x1="56" y1="40" x2="60" y2="43" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="65" y1="38" x2="68" y2="42" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* 4. Release Trajectory Energy and Focus Accents */}
      <g id="aim-accents">
        <path
          d="M 92 16 C 100 20, 106 28, 106 36"
          stroke="#38BDF8"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 96 12 C 105 17, 112 26, 112 36"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Micro Focus Crosshair at Tip */}
        <line x1="96" y1="19" x2="96" y2="29" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
        <line x1="91" y1="24" x2="101" y2="24" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
      </g>
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
