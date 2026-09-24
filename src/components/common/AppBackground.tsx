import React from 'react';

export const AppBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep pitch-black base with subtle dark charcoal depth */}
      <div className="absolute inset-0 bg-[#05070D]" />

      {/* Subtle top-right ambient warmth */}
      <div
        className="absolute -top-32 right-1/4 h-96 w-96 rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.4) 0%, rgba(217, 56, 0, 0.1) 60%, transparent 80%)',
        }}
      />

      {/* Primary bottom-right intense glowing orange radial aura */}
      <div
        className="absolute -bottom-48 -right-48 h-[650px] w-[650px] rounded-full blur-[110px] opacity-75 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 60% 60%, #FF6200 0%, #E64A00 25%, #9E2B00 50%, rgba(158, 43, 0, 0.2) 75%, transparent 100%)',
        }}
      />

      {/* Secondary softer bottom-right ambient bloom extending towards center */}
      <div
        className="absolute bottom-0 right-0 h-[800px] w-[900px] blur-[150px] opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 90% 90%, rgba(255, 120, 0, 0.6) 0%, rgba(230, 74, 0, 0.35) 30%, rgba(160, 40, 0, 0.15) 55%, transparent 75%)',
        }}
      />

      {/* Precise curved flowing luminous wave ribbons matching the tablet wallpaper */}
      <svg
        className="absolute bottom-0 right-0 h-[480px] w-[620px] max-w-full pointer-events-none opacity-90 transition-opacity duration-1000"
        viewBox="0 0 620 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main sweeping luminous ribbon gradient */}
          <linearGradient id="orangeWaveMain" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A1C00" stopOpacity="0" />
            <stop offset="30%" stopColor="#C43400" stopOpacity="0.4" />
            <stop offset="65%" stopColor="#FF5500" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#FF7A1A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFA04D" stopOpacity="0.6" />
          </linearGradient>

          {/* Deep dark backing wave */}
          <linearGradient id="orangeWaveDeep" x1="10%" y1="100%" x2="90%" y2="0%">
            <stop offset="0%" stopColor="#400A00" stopOpacity="0" />
            <stop offset="40%" stopColor="#8F2400" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#D84200" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6600" stopOpacity="0.4" />
          </linearGradient>

          {/* Fine crest highlight */}
          <linearGradient id="orangeWaveCrest" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="20%" stopColor="#FF5500" stopOpacity="0" />
            <stop offset="55%" stopColor="#FF8526" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#FFC285" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFE0B8" stopOpacity="0.3" />
          </linearGradient>

          {/* Blur filter for soft depth on under-ribbon */}
          <filter id="ribbonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Deep ambient shadow/warmth curve */}
        <path
          d="M120 480 C 260 450, 420 400, 520 280 C 580 200, 610 100, 620 0 L 620 480 Z"
          fill="url(#orangeWaveDeep)"
          filter="url(#ribbonGlow)"
          opacity="0.65"
        />

        {/* Sweeping dynamic outer ribbon wave */}
        <path
          d="M60 480 C 220 440, 390 390, 500 270 C 570 190, 605 90, 620 0 C 620 40, 610 160, 560 270 C 470 410, 290 470, 60 480 Z"
          fill="url(#orangeWaveMain)"
          opacity="0.85"
        />

        {/* Secondary inner ribbon wave creating layered depth */}
        <path
          d="M190 480 C 310 440, 440 370, 530 250 C 580 180, 610 80, 620 20 C 615 90, 580 190, 520 280 C 430 390, 300 450, 190 480 Z"
          fill="url(#orangeWaveMain)"
          opacity="0.6"
        />

        {/* Crisp luminous crest line (high intensity light edge) */}
        <path
          d="M70 480 C 230 438, 400 388, 505 268 C 572 188, 608 88, 620 0"
          stroke="url(#orangeWaveCrest)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Secondary fine crest highlight */}
        <path
          d="M200 480 C 320 438, 445 368, 533 248 C 582 178, 612 78, 620 25"
          stroke="url(#orangeWaveCrest)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* Subtle fine vignette border */}
      <div className="absolute inset-0 ring-1 ring-white/5 pointer-events-none" />
    </div>
  );
};
