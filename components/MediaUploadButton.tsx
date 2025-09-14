
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { UploadIcon } from './icons/UploadIcon';

interface MediaUploadButtonProps {
    onUploadClick: () => void;
}

export const MediaUploadButton: React.FC<MediaUploadButtonProps> = ({ onUploadClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fix: Cast to `any` to bypass incorrect type checking for DOM element methods and types.
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as any).contains(event.target as any)) {
                setIsOpen(false);
            }
        };
        // Fix: Use `window.document` to explicitly access the DOM from the global scope.
        window.document.addEventListener('mousedown', handleClickOutside);
        return () => window.document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUpload = () => {
        onUploadClick();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center h-10 w-10 bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200 transform hover:scale-110"
                title="More options"
            >
                <PlusIcon />
            </button>
            {isOpen && (
                <div className="absolute bottom-12 right-0 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 animate-fade-in-up">
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={handleUpload}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                            >
                                <UploadIcon className="mr-3" />
                                Visual Reference
                            </button>
                        </li>
                    </ul>
                </div>
            )}
             <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};