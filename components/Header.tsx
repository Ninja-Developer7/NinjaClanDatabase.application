import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="w-full text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Ai Social Ninja Anime Studio
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Craft viral anime-style videos for your social feed.
            </p>
        </header>
    );
};