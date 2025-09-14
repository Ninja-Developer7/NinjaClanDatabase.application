
import React from 'react';
import { XIcon } from './icons/XIcon';

interface VideoModalProps {
    videoUrl: string;
    title: string;
    onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, title, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
        >
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
            `}</style>
            <div 
                className="bg-gray-900/50 border border-gray-700 rounded-2xl shadow-2xl p-4 m-4 max-w-4xl max-h-[90vh] flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="video-modal-title" className="sr-only">Video Preview</h2>
                <button 
                    onClick={onClose} 
                    className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-red-500 rounded-full transition-colors duration-200 z-20" 
                    title="Close preview"
                    aria-label="Close preview"
                >
                    <XIcon />
                </button>
                <div className="relative overflow-hidden rounded-lg">
                    <video 
                        src={videoUrl} 
                        className="max-w-full max-h-[80vh] w-full" 
                        controls 
                        autoPlay 
                        loop 
                        playsInline 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                         <p className="text-white text-sm truncate" title={title}>{title}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
