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
  animate = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${animate ? 'hover:scale-110 transition-transform duration-300' : ''} ${className}`}
    >
      <defs>
        {/* Bold Blue Gradients */}
        <linearGradient id="boldBlueDartGrad" x1="20" y1="100" x2="100" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="45%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="boldBlueHandGrad" x1="16" y1="110" x2="80" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="40%" stopColor="#2563EB" />
          <stop offset="85%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>

        <linearGradient id="boldBlueFinGrad" x1="15" y1="80" x2="35" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* 1. Tournament Dart (Tail bottom left to needle top right) */}
      
      {/* Flight Stabilizer Fins */}
      <g id="dart-fins">
        {/* Top-left stabilizer wing */}
        <path
          d="M 24 96 L 12 85 L 18 73 L 30 87 Z"
          fill="url(#boldBlueFinGrad)"
          stroke="#2563EB"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Bottom-right stabilizer wing */}
        <path
          d="M 24 96 L 19 108 L 32 105 L 34 91 Z"
          fill="url(#boldBlueFinGrad)"
          stroke="#2563EB"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
        {/* Internal aerodynamic fin ribs */}
        <line x1="17" y1="79" x2="25" y2="89" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="25" y1="104" x2="29" y2="93" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Dart Shaft (Connecting stem) */}
      <line 
        x1="24" 
        y1="96" 
        x2="46" 
        y2="74" 
        stroke="url(#boldBlueDartGrad)" 
        strokeWidth="4.8" 
        strokeLinecap="round" 
      />
      <line 
        x1="25" 
        y1="97" 
        x2="47" 
        y2="75" 
        stroke="#38BDF8" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        opacity="0.8" 
      />

      {/* Dart Barrel (Bold Precision Knurled Core) */}
      <line 
        x1="46" 
        y1="74" 
        x2="78" 
        y2="42" 
        stroke="#1D4ED8" 
        strokeWidth="7.8" 
        strokeLinecap="round" 
      />
      <line 
        x1="45" 
        y1="73" 
        x2="77" 
        y2="41" 
        stroke="#3B82F6" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
      />
      <line 
        x1="44" 
        y1="72" 
        x2="76" 
        y2="40" 
        stroke="#60A5FA" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />

      {/* Knurled Grip Texture Ribs on Dart Barrel */}
      <line x1="50" y1="67" x2="54" y2="71" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="55" y1="62" x2="59" y2="66" stroke="#93C5FD" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="60" y1="57" x2="64" y2="61" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="65" y1="52" x2="69" y2="56" stroke="#93C5FD" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="70" y1="47" x2="74" y2="51" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />

      {/* Steel Dart Needle Point */}
      <line 
        x1="78" 
        y1="42" 
        x2="100" 
        y2="20" 
        stroke="#2563EB" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      <line 
        x1="79" 
        y1="41" 
        x2="99" 
        y2="21" 
        stroke="#60A5FA" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />

      {/* Needle Apex Point & Target Ticks */}
      <circle cx="100" cy="20" r="3" fill="#2563EB" />
      <circle cx="100" cy="20" r="1.5" fill="#38BDF8" />
      <line x1="104" y1="16" x2="111" y2="9" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="106" y1="22" x2="113" y2="22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      <line x1="98" y1="12" x2="98" y2="5" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

      {/* 2. Bold Blue Hand Pinching the Dart */}
      <g id="bold-blue-hand">
        {/* Palm & Wrist Hatch Lines */}
        <line x1="28" y1="102" x2="35" y2="97" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="32" y1="96" x2="39" y2="91" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="36" y1="90" x2="43" y2="85" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" />

        {/* Wrist & Forearm Outer Contour */}
        <path
          d="M 16 110 C 23 103, 28 95, 34 86 C 38 80, 42 75, 46 72"
          stroke="url(#boldBlueHandGrad)"
          strokeWidth="4.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 13 112 C 20 105, 25 97, 31 89"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Folded Pinky and Ring Fingers */}
        <path
          d="M 33 86 C 39 90, 47 89, 50 84 C 53 79, 50 74, 46 72"
          stroke="url(#boldBlueHandGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 39 81 C 45 84, 53 83, 56 77 C 58 73, 54 69, 49 67"
          stroke="url(#boldBlueHandGrad)"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Middle Finger (Underside support on barrel) */}
        <path
          d="M 45 72 C 51 77, 58 76, 62 70 C 65 65, 62 61, 57 61"
          stroke="#2563EB"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 47 74 C 53 79, 59 78, 63 72"
          stroke="#38BDF8"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Thumb (Curving up from heel of hand to pinch the barrel) */}
        <path
          d="M 34 86 C 39 79, 45 73, 49 66 C 52 61, 55 59, 59 61 C 62 63, 61 67, 57 70 C 53 73, 48 78, 44 84"
          stroke="url(#boldBlueHandGrad)"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Thumb contact pad on barrel */}
        <path
          d="M 53 63 C 56 61, 60 62, 61 65 C 61 68, 58 70, 55 69"
          stroke="#3B82F6"
          strokeWidth="3.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Thumb tendon contour */}
        <path
          d="M 39 78 C 43 72, 47 68, 51 65"
          stroke="#60A5FA"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Index Finger (Arched over top of barrel in precision grip) */}
        <path
          d="M 36 68 C 40 54, 49 42, 57 36 C 66 30, 72 32, 75 38 C 78 44, 76 50, 72 54 C 69 57, 65 57, 62 55"
          stroke="url(#boldBlueHandGrad)"
          strokeWidth="4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Secondary sketch accent along the index arch */}
        <path
          d="M 45 47 C 52 38, 60 34, 68 32 C 73 31, 78 34, 79 40 C 80 46, 76 52, 71 56"
          stroke="#38BDF8"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Index fingertip contact pad clamping barrel */}
        <path
          d="M 68 47 C 72 49, 74 53, 72 56 C 70 58, 66 58, 64 55"
          stroke="#3B82F6"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Index knuckle creases */}
        <line x1="56" y1="39" x2="61" y2="43" stroke="#38BDF8" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="66" y1="37" x2="70" y2="42" stroke="#38BDF8" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
};
