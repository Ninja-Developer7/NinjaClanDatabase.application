

import React from 'react';
import { HistoryMetadata } from '../types';
import { HistoryItemCard } from './HistoryItemCard';

interface HistoryPanelProps {
    history: HistoryMetadata[];
    onPlay: (item: HistoryMetadata) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    onSave: (item: HistoryMetadata) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onPlay, onDelete, onClear, onSave }) => {
    return (
        <section className="w-full max-w-4xl mx-auto mt-12 animate-fade-in">
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
            `}</style>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Generation History
                </h2>
                <button
                    onClick={onClear}
                    className="px-4 py-2 bg-red-800/50 border border-red-700 text-red-200 text-sm font-semibold rounded-lg hover:bg-red-700/70 transition-colors duration-200"
                >
                    Clear All
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map(item => (
                    <HistoryItemCard
                        key={item.id}
                        item={item}
                        onPlay={() => onPlay(item)}
                        onDelete={() => onDelete(item.id)}
                        onSave={() => onSave(item)}
                    />
                ))}
            </div>
        </section>
    );
};
