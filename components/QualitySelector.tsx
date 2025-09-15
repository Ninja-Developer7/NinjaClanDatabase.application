
import React from 'react';

export type VideoQuality = '720p' | '1080p';

interface QualitySelectorProps {
    selectedQuality: VideoQuality;
    onQualityChange: (quality: VideoQuality) => void;
    disabled: boolean;
}

export const QualitySelector: React.FC<QualitySelectorProps> = ({ selectedQuality, onQualityChange, disabled }) => {
    const qualities: { id: VideoQuality; label: string }[] = [
        { id: '720p', label: '720p SD' },
        { id: '1080p', label: '1080p HD' },
    ];

    return (
        <div className="flex items-center space-x-2 bg-gray-900/70 p-1 rounded-full border border-gray-700">
            <span className="text-sm font-medium text-gray-400 pl-3 pr-1" aria-hidden="true">Quality</span>
            <div role="radiogroup" aria-label="Video quality" className="flex">
                {qualities.map((quality) => (
                    <button
                        key={quality.id}
                        role="radio"
                        aria-checked={selectedQuality === quality.id}
                        onClick={() => onQualityChange(quality.id)}
                        disabled={disabled}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                            selectedQuality === quality.id
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {quality.label}
                    </button>
                ))}
            </div>
        </div>
    );
};