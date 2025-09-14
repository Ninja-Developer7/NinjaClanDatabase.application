
import React from 'react';
import { VisualReferenceFile } from '../types';
import { XIcon } from './icons/XIcon';
import { MaximizeIcon } from './icons/MaximizeIcon';

interface ThumbnailPreviewProps {
    file: VisualReferenceFile;
    onRemove: () => void;
    onPreview: () => void;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({ file, onRemove, onPreview }) => {
    const isVideo = file.file.type.startsWith('video/');
    
    return (
        <div className="absolute top-full left-0 mt-3 bg-gray-800 p-2 rounded-lg shadow-md flex items-center space-x-3 animate-fade-in z-10">
             <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-in-out;
                }
            `}</style>

            <button onClick={onPreview} className="relative group flex-shrink-0" aria-label="Preview media">
                {isVideo ? (
                    <video src={file.previewUrl} className="w-16 h-16 rounded object-cover" muted loop autoPlay playsInline />
                ) : (
                    <img src={file.previewUrl} alt="Preview" className="w-16 h-16 rounded object-cover" />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
                    <MaximizeIcon className="w-8 h-8 text-white" />
                </div>
            </button>

            <div className="text-sm text-gray-300 overflow-hidden flex-grow">
                <p className="font-semibold truncate">{file.file.name}</p>
                <p className="text-xs text-gray-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={onRemove} className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-red-500 rounded-full transition-colors duration-200" title="Remove file">
                <XIcon />
            </button>
        </div>
    );
};
