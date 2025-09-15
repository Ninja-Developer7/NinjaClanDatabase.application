
import React from 'react';

interface LoadingIndicatorProps {
    message: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 min-h-[250px]">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="text-lg text-gray-300 text-center">{message}</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};
