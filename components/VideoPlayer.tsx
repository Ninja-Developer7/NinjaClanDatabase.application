

import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { VolumeUpIcon } from './icons/VolumeUpIcon';
import { VolumeMuteIcon } from './icons/VolumeMuteIcon';
import { FullscreenEnterIcon } from './icons/FullscreenEnterIcon';
import { FullscreenExitIcon } from './icons/FullscreenExitIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface VideoPlayerProps {
    videoUrl: string;
    onReset: () => void;
}

const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onReset }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    // Fix: Use ReturnType<typeof setTimeout> for browser compatibility instead of NodeJS.Timeout.
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const hideControls = () => {
        // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties.
        if ((videoRef.current as any)?.paused) return;
        setIsControlsVisible(false);
    };

    const showAndFadeControls = () => {
        setIsControlsVisible(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Fix: Cast to `any` to bypass incorrect type checking for DOM element methods.
        (video as any).play().catch((error: any) => {
            console.error("Autoplay was prevented:", error);
            setIsPlaying(false);
        });

        const handleTimeUpdate = () => setCurrentTime((video as any).currentTime);
        const handleLoadedMetadata = () => setDuration((video as any).duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => {
            setIsPlaying(false);
            setIsControlsVisible(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
        const handleVolumeChange = () => {
            setVolume((video as any).volume);
            setIsMuted((video as any).muted);
        };
        const handleEnded = () => {
            setIsPlaying(false);
            (video as any).currentTime = 0;
        };

        // Fix: Cast to `any` to bypass incorrect type checking for DOM element methods.
        (video as any).addEventListener('timeupdate', handleTimeUpdate);
        (video as any).addEventListener('loadedmetadata', handleLoadedMetadata);
        (video as any).addEventListener('play', handlePlay);
        (video as any).addEventListener('pause', handlePause);
        (video as any).addEventListener('volumechange', handleVolumeChange);
        (video as any).addEventListener('ended', handleEnded);

        // Fullscreen change handler
        const handleFullscreenChange = () => {
            // Fix: Use `window.document` and cast to `any` to access non-standard fullscreen properties.
            const isCurrentlyFullscreen = !!(window.document as any).fullscreenElement;
            setIsFullscreen(isCurrentlyFullscreen);
        };
        
        // Fix: Use `window.document` to explicitly access the DOM from the global scope for event listeners.
        window.document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        window.document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        window.document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            // Fix: Cast to `any` to bypass incorrect type checking for DOM element methods.
            (video as any).removeEventListener('timeupdate', handleTimeUpdate);
            (video as any).removeEventListener('loadedmetadata', handleLoadedMetadata);
            (video as any).removeEventListener('play', handlePlay);
            (video as any).removeEventListener('pause', handlePause);
            (video as any).removeEventListener('volumechange', handleVolumeChange);
            (video as any).removeEventListener('ended', handleEnded);

            // Fix: Use `window.document` to explicitly access the DOM from the global scope for event listeners.
            window.document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            window.document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            window.document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    const togglePlayPause = () => {
        if (videoRef.current) {
            // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties and methods.
            (videoRef.current as any).paused ? (videoRef.current as any).play() : (videoRef.current as any).pause();
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            // Fix: Cast `e.target` to `any` to access the `value` property, bypassing strict type checks.
            const newTime = (Number((e.target as any).value) / 100) * duration;
            // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties.
            (videoRef.current as any).currentTime = newTime;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Fix: Cast `e.target` to `any` to access the `value` property, bypassing strict type checks.
        const newVolume = Number((e.target as any).value);
        if (videoRef.current) {
            // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties.
            (videoRef.current as any).volume = newVolume;
            (videoRef.current as any).muted = newVolume === 0;
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            // Fix: Cast to `any` to bypass incorrect type checking for DOM element properties.
            const currentlyMuted = (videoRef.current as any).muted;
            (videoRef.current as any).muted = !currentlyMuted;
            if (currentlyMuted && (videoRef.current as any).volume === 0) {
                 (videoRef.current as any).volume = 0.5;
            }
        }
    };
    
    const toggleFullscreen = () => {
        const playerContainer = playerContainerRef.current as any;
        if (!playerContainer) return;

        if (!isFullscreen) {
            if (playerContainer.requestFullscreen) {
                playerContainer.requestFullscreen();
            } else if (playerContainer.mozRequestFullScreen) { // Firefox
                playerContainer.mozRequestFullScreen();
            } else if (playerContainer.webkitRequestFullscreen) { // Chrome, Safari & Opera
                playerContainer.webkitRequestFullscreen();
            } else if (playerContainer.msRequestFullscreen) { // IE/Edge
                playerContainer.msRequestFullscreen();
            }
        } else {
            // Fix: Use `window.document` and cast to `any` to access non-standard or vendor-prefixed methods.
            const doc = window.document as any;
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.mozCancelFullScreen) { // Firefox
                doc.mozCancelFullScreen();
            } else if (doc.webkitExitFullscreen) { // Chrome, Safari and Opera
                doc.webkitExitFullscreen();
            } else if (doc.msExitFullscreen) { // IE/Edge
                doc.msExitFullscreen();
            }
        }
    };

    const progressValue = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full flex flex-col items-center space-y-6 animate-fade-in">
            <style>{`
                @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.5s ease-in-out; }
                input[type=range].video-slider { height: 5px; -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
                input[type=range].video-slider::-webkit-slider-runnable-track { background-color: rgba(255, 255, 255, 0.3); border-radius: 0.5rem; height: 100%; }
                input[type=range].video-slider::-moz-range-track { background-color: rgba(255, 255, 255, 0.3); border-radius: 0.5rem; height: 100%; }
                input[type=range].video-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -5px; background-color: #a855f7; height: 15px; width: 15px; border-radius: 50%; }
                input[type=range].video-slider::-moz-range-thumb { border: none; background-color: #a855f7; height: 15px; width: 15px; border-radius: 50%; }
            `}</style>
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Your Video is Ready!
            </h2>
            
            <div 
                ref={playerContainerRef}
                className="relative w-full max-w-2xl rounded-lg shadow-lg border border-gray-700 overflow-hidden bg-black"
                onMouseEnter={showAndFadeControls}
                onMouseMove={showAndFadeControls}
                onMouseLeave={hideControls}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    playsInline
                    className="w-full h-full block"
                    onClick={togglePlayPause}
                />
                <div className={`absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center space-x-3 text-white">
                        <button onClick={togglePlayPause} className="hover:text-purple-400 transition-colors p-1" aria-label={isPlaying ? 'Pause' : 'Play'}>
                            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                        </button>
                        
                        <span className="font-mono text-sm w-12 text-center" aria-label="Current time">{formatTime(currentTime)}</span>
                        
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progressValue}
                            onInput={handleSeek}
                            className="video-slider flex-grow"
                            aria-label="Seek bar"
                        />
                        
                        <span className="font-mono text-sm w-12 text-center" aria-label="Total duration">{formatTime(duration)}</span>
                        
                        <div className="flex items-center space-x-2 group/volume">
                             <button onClick={toggleMute} className="hover:text-purple-400 transition-colors p-1" aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}>
                                {isMuted || volume === 0 ? <VolumeMuteIcon className="w-6 h-6" /> : <VolumeUpIcon className="w-6 h-6" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onInput={handleVolumeChange}
                                className="video-slider w-0 group-hover/volume:w-20 transition-all duration-300"
                                aria-label="Volume control"
                            />
                        </div>

                        <button onClick={toggleFullscreen} className="hover:text-purple-400 transition-colors p-1" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                            {isFullscreen ? <FullscreenExitIcon className="w-5 h-5" /> : <FullscreenEnterIcon className="w-5 h-5" />}
                        </button>

                    </div>
                </div>
            </div>

            <div className="w-full max-w-xs sm:max-w-none flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4">
                 <a
                    href={videoUrl}
                    download="generated-video.mp4"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-lg rounded-full hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <DownloadIcon className="w-6 h-6 mr-3" />
                    Download Video
                </a>
                <button
                    onClick={onReset}
                    className="w-full sm:w-auto px-6 py-2 bg-transparent border-2 border-gray-600 text-gray-300 font-semibold rounded-full hover:bg-gray-700 hover:border-gray-500 transition-colors duration-200"
                >
                    Create Another
                </button>
            </div>
        </div>
    );
};