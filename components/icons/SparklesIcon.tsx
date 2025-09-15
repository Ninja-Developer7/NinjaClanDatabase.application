
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-7.19c0-1.06.32-2.08.885-2.916.565-.836 1.37-1.483 2.31-1.897Z" clipRule="evenodd" />
        <path d="M1.5 9.75a.75.75 0 0 1 .75-.75c1.478 0 2.862.264 4.15.754a.75.75 0 0 1-.398 1.444A8.251 8.251 0 0 0 1.5 9.75Z" />
        <path d="M6.375 18.375a.75.75 0 0 1-.75.75c-1.478 0-2.862-.264-4.15-.754a.75.75 0 0 1 .398-1.444A8.251 8.251 0 0 0 6.375 18.375Z" />
    </svg>
);
