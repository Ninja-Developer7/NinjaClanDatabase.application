

import React, { useRef } from 'react';
import { MediaUploadButton } from './MediaUploadButton';
import { GenerateIcon } from './icons/GenerateIcon';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '../constants';
import { QualitySelector, VideoQuality } from './QualitySelector';

interface PromptInputProps {
    prompt: string;
    onPromptChange: (prompt: string) => void;
    onFileSelect: (file: File) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    videoQuality: VideoQuality;
    onVideoQualityChange: (quality: VideoQuality) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
    prompt,
    onPromptChange,
    onFileSelect,
    isGenerating,
    onGenerate,
    videoQuality,
    onVideoQualityChange,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Fix: Cast `event.target` to `any` to access the `files` property, bypassing strict type checks.
        const file = (event.target as any).files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                // Fix: Use `window.alert` to explicitly access the browser's global alert function.
                window.alert(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
                return;
            }
            onFileSelect(file);
        }
        // Reset file input value to allow re-uploading the same file
        if(fileInputRef.current) {
            // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties.
            (fileInputRef.current as any).value = '';
        }
    };

    const triggerFilePicker = () => {
        // Fix: Cast to `any` to bypass incorrect type checking for DOM element methods.
        (fileInputRef.current as any)?.click();
    };

    return (
        <div>
            <textarea
                value={prompt}
                // Fix: Cast `e.target` to `any` to access the `value` property, bypassing strict type checks.
                onChange={(e) => onPromptChange((e.target as any).value)}
                placeholder="A character running through a rainy, neon-lit city..."
                maxLength={3000}
                className="w-full h-40 p-4 bg-gray-900/70 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-300 resize-none text-gray-200 placeholder-gray-500"
                disabled={isGenerating}
                aria-label="Video generation prompt"
            />
            
             <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                    <MediaUploadButton onUploadClick={triggerFilePicker} />
                </div>
                <div className="flex items-center gap-4">
                     <QualitySelector
                        selectedQuality={videoQuality}
                        onQualityChange={onVideoQualityChange}
                        disabled={isGenerating}
                    />
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || !prompt}
                        className="flex items-center justify-center h-12 w-12 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-200 transform hover:scale-110 shrink-0"
                        title="Generate Video"
                        aria-label="Generate Video"
                    >
                        <GenerateIcon />
                    </button>
                </div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
                className="hidden"
            />
        </div>
    );
};