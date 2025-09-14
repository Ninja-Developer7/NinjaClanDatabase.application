
import React from 'react';
import { VideoStyle } from '../types';
import { VIDEO_STYLES } from '../constants';

interface StyleSelectorProps {
    selectedStyle: VideoStyle;
    onStyleChange: (style: VideoStyle) => void;
    disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, disabled }) => {
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Select a Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {VIDEO_STYLES.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => onStyleChange(style.id)}
                        disabled={disabled}
                        className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                            selectedStyle === style.id
                                ? 'border-purple-500 bg-purple-900/50 ring-2 ring-purple-500/30'
                                : 'border-gray-700 bg-gray-800/50 hover:border-purple-700'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={style.description}
                    >
                        <p className="font-bold text-sm text-white">{style.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{style.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
