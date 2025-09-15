import React from 'react';

export const PlayIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7.5 5.625v12.75a.75.75 0 0 0 1.14.643l10.5-6.375a.75.75 0 0 0 0-1.286L8.64 4.982A.75.75 0 0 0 7.5 5.625Z" />
    </svg>
);
