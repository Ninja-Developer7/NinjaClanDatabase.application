

import React, { useRef } from 'react';
import { AudioFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { ACCEPTED_AUDIO_TYPES, MAX_AUDIO_FILE_SIZE } from '../constants';

interface AudioUploadProps {
    selectedAudio: AudioFile | null;
    onAudioSelect: (audio: AudioFile | null) => void;
    disabled: boolean;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({ selectedAudio, onAudioSelect, disabled }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Fix: Cast `event.target` to `any` to access the `files` property, bypassing strict type checks.
        const file = (event.target as any).files?.[0];
        if (file) {
            if (file.size > MAX_AUDIO_FILE_SIZE) {
                // Fix: Use `window.alert` to explicitly access the browser's global alert function.
                window.alert(`Audio file is too large. Maximum size is ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB.`);
                return;
            }
            onAudioSelect({ type: 'file', source: file, name: file.name });
        }
        if (fileInputRef.current) {
            // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties.
            (fileInputRef.current as any).value = '';
        }
    };

    const triggerFilePicker = () => {
        // Fix: Cast to `any` to bypass incorrect type checking for DOM element methods.
        (fileInputRef.current as any)?.click();
    };

    const handleRemove = () => {
        onAudioSelect(null);
    };

    const isUploadedAudioSelected = selectedAudio?.type === 'file';

    return (
        <div>
            {isUploadedAudioSelected ? (
                <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                    <p className="text-sm text-gray-300 truncate">{selectedAudio.name}</p>
                    <button onClick={handleRemove} className="ml-4 p-1 rounded-full hover:bg-red-500" title="Remove audio">
                        <XIcon />
                    </button>
                </div>
            ) : (
                <button
                    onClick={triggerFilePicker}
                    disabled={disabled}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <UploadIcon className="mr-3" />
                    <span>Upload Audio File</span>
                </button>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={Object.keys(ACCEPTED_AUDIO_TYPES).join(',')}
                className="hidden"
            />
        </div>
    );
};