

import React from 'react';
import { HistoryMetadata } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import { ClockIcon } from './icons/ClockIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface HistoryItemCardProps {
    item: HistoryMetadata;
    onPlay: () => void;
    onDelete: () => void;
    onSave: () => void;
}

const formatTimeAgo = (timestamp: number): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    if (seconds < 10) return "just now";
    
    return Math.floor(seconds) + " seconds ago";
};


export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onPlay, onDelete, onSave }) => {
    return (
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-800/50 transform hover:-translate-y-1">
            <button onClick={onPlay} className="relative aspect-video w-full group bg-gray-900" title="Play Video">
                 {item.visualReferenceThumbnail ? (
                    <img src={item.visualReferenceThumbnail} alt="Video thumbnail" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">Thumbnail unavailable</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayIcon className="w-10 h-10 text-white" />
                </div>
            </button>
           
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-sm font-semibold text-gray-200 line-clamp-2" title={item.prompt}>{item.prompt}</p>
                
                <div className="flex-grow" />

                {item.audioName && (
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                        <MusicNoteIcon className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="truncate">{item.audioName}</span>
                    </div>
                )}
                 <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
                   <span className="font-bold text-purple-400 bg-purple-900/50 px-2 py-1 rounded-full">{item.quality.toUpperCase()}</span>
                   <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3 text-gray-500" />
                        <span>{formatTimeAgo(item.timestamp)}</span>
                   </div>
                </div>
            </div>

            <div className="flex items-center justify-end space-x-2 p-3 bg-gray-900/50 border-t border-gray-700/50">
                <button onClick={onSave} className="p-2 text-gray-300 rounded-full hover:bg-purple-600 hover:text-white transition-colors" title={item.isSaved ? "Download again" : "Save & Download"}>
                    <BookmarkIcon isSaved={!!item.isSaved} className="w-5 h-5" />
                </button>
                <button onClick={onDelete} className="p-2 text-gray-300 rounded-full hover:bg-red-600 hover:text-white transition-colors" title="Delete Video">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
