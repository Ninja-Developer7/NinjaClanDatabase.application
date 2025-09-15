
import React, { useState } from 'react';
import { AudioUpload } from './AudioUpload';
import { AudioLibrary } from './AudioLibrary';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import { AudioFile } from '../types';

interface AudioSelectorProps {
    selectedAudio: AudioFile | null;
    onAudioSelect: (audio: AudioFile | null) => void;
    disabled: boolean;
}

export const AudioSelector: React.FC<AudioSelectorProps> = ({ selectedAudio, onAudioSelect, disabled }) => {
    const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');

    return (
        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-xl">
            <div className="flex items-center mb-4">
                <MusicNoteIcon className="w-6 h-6 mr-3 text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-200">Add Audio</h3>
            </div>

            <div className="flex border-b border-gray-600 mb-4">
                <button
                    onClick={() => setActiveTab('library')}
                    disabled={disabled}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'library'
                            ? 'border-b-2 border-purple-500 text-white'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Library
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    disabled={disabled}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'upload'
                            ? 'border-b-2 border-purple-500 text-white'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Upload
                </button>
            </div>

            <div>
                {activeTab === 'library' && (
                    <AudioLibrary
                        selectedAudio={selectedAudio}
                        onAudioSelect={onAudioSelect}
                        disabled={disabled}
                    />
                )}
                {activeTab === 'upload' && (
                    <AudioUpload
                        selectedAudio={selectedAudio}
                        onAudioSelect={onAudioSelect}
                        disabled={disabled}
                    />
                )}
            </div>
        </div>
    );
};