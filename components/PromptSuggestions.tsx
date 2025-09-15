
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptSuggestionsProps {
    suggestions: string[];
    onSelectSuggestion: (prompt: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelectSuggestion }) => {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="mt-4 animate-fade-in">
             <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-in-out;
                }
            `}</style>
            <h3 className="flex items-center text-sm font-semibold text-gray-400 mb-3">
                <SparklesIcon className="w-5 h-5 mr-2 text-purple-400" />
                Inspired by your history...
            </h3>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectSuggestion(suggestion)}
                        className="px-4 py-2 bg-gray-700/60 text-gray-300 rounded-full text-sm hover:bg-purple-600 hover:text-white transition-all duration-200 transform hover:scale-105"
                        title={`Use prompt: "${suggestion}"`}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};
