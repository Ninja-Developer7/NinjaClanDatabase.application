

import { VideoQuality } from './components/QualitySelector';

export type VideoStyle = 'Default' | 'Studio-Ghibli-like' | 'Studio-Sunset-like' | 'Studio-Toei-Animation-like' | 'Wit-Studio' | 'Studio Pierrot-like' | 'Studio-MadHouse';

export interface Scene {
    sceneNumber: number;
    description: string;
    camera: string;
    duration: number;
}

export interface Storyboard {
    scenes: Scene[];
}

export interface VisualReferenceFile {
    file: File;
    previewUrl: string;
}

export interface AudioFile {
    type: 'file' | 'url';
    source: File | string;
    name: string;
}

export interface HistoryMetadata {
  id: string;
  prompt: string;
  timestamp: number;
  visualReferenceThumbnail?: string; // Data URL of the thumbnail
  quality: VideoQuality;
  audioName?: string;
  isSaved?: boolean;
}