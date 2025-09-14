
import React from 'react';
import { VisualReferenceFile } from '../types';
import { XIcon } from './icons/XIcon';

interface PreviewModalProps {
    file: VisualReferenceFile;
    onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ file, onClose }) => {
    const isVideo = file.file.type.startsWith('video/');

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
        >
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
            `}</style>
            <div 
                className="bg-gray-900/50 border border-gray-700 rounded-2xl shadow-2xl p-4 m-4 max-w-4xl max-h-[90vh] flex flex-col relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <h2 id="preview-modal-title" className="sr-only">Media Preview</h2>
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-500 rounded-full transition-colors duration-200 z-10" 
                    title="Close preview"
                    aria-label="Close preview"
                >
                    <XIcon />
                </button>
                <div className="overflow-auto">
                    {isVideo ? (
                        <video src={file.previewUrl} className="max-w-full max-h-[80vh] rounded-lg" controls autoPlay loop playsInline />
                    ) : (
                        <img src={file.previewUrl} alt="Preview" className="max-w-full max-h-[80vh] rounded-lg" />
                    )}
                </div>
            </div>
        </div>
    );
};
