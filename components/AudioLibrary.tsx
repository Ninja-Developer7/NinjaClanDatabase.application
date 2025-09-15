
import React, { useState, useRef } from 'react';
import { AudioFile } from '../types';
import { AUDIO_LIBRARY } from '../constants';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface AudioLibraryProps {
    selectedAudio: AudioFile | null;
    onAudioSelect: (audio: AudioFile | null) => void;
    disabled: boolean;
}

export const AudioLibrary: React.FC<AudioLibraryProps> = ({ selectedAudio, onAudioSelect, disabled }) => {
    const [playingPreview, setPlayingPreview] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePreview = (url: string) => {
        if (audioRef.current) {
            if (playingPreview === url) {
                // Fix: Cast to `any` to bypass incorrect type checking for DOM element methods.
                (audioRef.current as any).pause();
                setPlayingPreview(null);
            } else {
                // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties and methods.
                (audioRef.current as any).src = url;
                (audioRef.current as any).play();
                setPlayingPreview(url);
            }
        }
    };
    
    const handleSelect = (track: { name: string, url: string }) => {
        if (selectedAudio?.type === 'url' && selectedAudio.source === track.url) {
            onAudioSelect(null); // Deselect if already selected
        } else {
            onAudioSelect({ type: 'url', source: track.url, name: track.name });
        }
    };
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <audio ref={audioRef} onEnded={() => setPlayingPreview(null)} />
            {AUDIO_LIBRARY.map((track) => {
                const isSelected = selectedAudio?.type === 'url' && selectedAudio.source === track.url;
                return (
                    <div
                        key={track.name}
                        className={`p-3 bg-gray-800 rounded-lg flex items-center justify-between transition-all border ${
                            isSelected ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-700'
                        } ${disabled ? 'opacity-60' : 'cursor-pointer hover:bg-gray-700/50'}`}
                        onClick={() => !disabled && handleSelect(track)}
                    >
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(track.url);
                                }}
                                disabled={disabled}
                                className="p-2 rounded-full bg-gray-700 hover:bg-purple-600 text-white transition-colors"
                            >
                                {playingPreview === track.url ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                            </button>
                            <span className="text-sm text-gray-300">{track.name}</span>
                        </div>
                        {isSelected && <CheckCircleIcon className="w-6 h-6 text-purple-400" />}
                    </div>
                );
            })}
        </div>
    );
};