

import { VideoStyle } from './types';

export const ACCEPTED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'video/mp4': ['.mp4'],
    'video/quicktime': ['.mov'],
};

export const ACCEPTED_AUDIO_TYPES = {
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/ogg': ['.ogg'],
};

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
export const MAX_AUDIO_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const LOADING_MESSAGES = [
    'Initializing AI model...',
    'Analyzing your prompt and visual reference...',
    'Storyboarding the main scenes...',
    'Generating primary motion vectors...',
    'Applying Studio Ghibli art style...',
    'Rendering keyframes in high definition...',
    'Compositing anime-style effects...',
    'Encoding final video file...',
    'This is taking a bit longer than expected, but we are still working on it...',
    'Finalizing... Your masterpiece is almost ready!'
];

export const VIDEO_STYLES: { id: VideoStyle; name: string; description: string }[] = [
    { id: 'Default', name: 'Default', description: 'A balanced, general-purpose anime style.' },
    { id: 'Studio-Ghibli-like', name: 'Ghibli-like', description: 'Lush, painted backgrounds and whimsical fantasy.' },
    { id: 'Studio-Sunset-like', name: 'Sunset-like', description: 'Vibrant colors, dramatic lighting, and emotional scenes.' },
    { id: 'Studio-Toei-Animation-like', name: 'Toei-like', description: 'Classic dynamic action, iconic transformations, and energetic pacing.' },
    { id: 'Wit-Studio', name: 'Wit-like', description: 'High-octane action sequences, detailed character art, and cinematic flair.' },
    { id: 'Studio Pierrot-like', name: 'Pierrot-like', description: 'Iconic long-running series style with dramatic flair and intense battles.' },
    { id: 'Studio-MadHouse', name: 'MadHouse-like', description: 'Dark, psychological themes with high-quality, fluid animation.' },
];

export const AUDIO_LIBRARY = [
    { name: 'Cinematic Epic', url: 'https://cdn.pixabay.com/audio/2023/10/23/audio_17811de252.mp3' },
    { name: 'Peaceful Morning', url: 'https://cdn.pixabay.com/audio/2022/02/07/audio_a0073fd05d.mp3' },
    { name: 'Synthwave Drive', url: 'https://cdn.pixabay.com/audio/2024/05/08/audio_291350d7a5.mp3' },
    { name: 'Rainy City Ambience', url: 'https://cdn.pixabay.com/audio/2022/04/09/audio_737318041d.mp3' }
];