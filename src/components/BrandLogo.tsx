'use client';

import React from 'react';

interface BrandLogoProps {
  customLogoUrl?: string;
  size?: number;
  className?: string;
}

export default function BrandLogo({
  customLogoUrl,
  size = 42,
  className = '',
}: BrandLogoProps) {
  const logoSrc = customLogoUrl || '/images/samsher-logo.jpg';

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 shadow-xs border-2 border-[#b47a3c]/70 hover:border-[#b47a3c] transition-colors ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoSrc}
        alt="Samsher Properties Logo"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
        }}
      />
    </div>
  );
}
