
import React from 'react';

export const TrashIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 0 1-.749.654h-7.541a.75.75 0 0 1-.749-.654L5.29 6.538l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.9h1.368c1.603 0 2.816 1.336 2.816 2.9Zm-1.487.227a.75.75 0 0 1-.75.75H8.75a.75.75 0 0 1-.75-.75V4.478c0-.995.617-1.9 1.5-1.9h1.368c.883 0 1.5.905 1.5 1.9v.227Z" clipRule="evenodd" />
    </svg>
);
