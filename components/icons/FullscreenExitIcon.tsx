import React from 'react';

export const FullscreenExitIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L3.75 3.75M3.75 3.75v4.5m0-4.5h4.5m6.75 0L20.25 3.75m0 0v4.5m0-4.5h-4.5m-6.75 11.25L3.75 20.25m0 0v-4.5m0 4.5h4.5m6.75 0L20.25 20.25m0 0v-4.5m0 4.5h-4.5" />
    </svg>
);
