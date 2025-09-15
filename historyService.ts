

import { HistoryMetadata } from '../types';
import { VideoQuality } from '../components/QualitySelector';
import * as dbService from './dbService';
import { createThumbnail } from './fileUtils';

const HISTORY_STORAGE_KEY = 'ai-anime-studio-history';

// == METADATA MANAGEMENT (localStorage) ==

export const getHistoryMetadata = (): HistoryMetadata[] => {
    try {
        const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error("Failed to parse history from localStorage", error);
        return [];
    }
};

const saveHistoryMetadata = (history: HistoryMetadata[]): void => {
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
    }
};


// == FULL HISTORY ITEM MANAGEMENT (localStorage + IndexedDB) ==

interface AddHistoryItemArgs {
    prompt: string;
    quality: VideoQuality;
    visualReferenceFile?: File;
    audioName?: string;
}

export const addHistoryItem = async (
    itemDetails: AddHistoryItemArgs,
    videoBlob: Blob
): Promise<HistoryMetadata> => {
    const newId = `vid_${Date.now()}`;
    
    // 1. Create thumbnail
    let thumbnail: string | undefined;
    try {
        // Prioritize visual reference for thumbnail
        if (itemDetails.visualReferenceFile) {
            thumbnail = await createThumbnail(itemDetails.visualReferenceFile);
        } else {
            // Otherwise, create thumbnail from the generated video blob
            const videoFileForThumbnail = new File([videoBlob], 'thumbnail.mp4', { type: 'video/mp4' });
            thumbnail = await createThumbnail(videoFileForThumbnail);
        }
    } catch (error) {
        console.error("Failed to create thumbnail for history:", error);
    }
    
    // 2. Create metadata object
    const newMetadataItem: HistoryMetadata = {
        id: newId,
        prompt: itemDetails.prompt,
        timestamp: Date.now(),
        quality: itemDetails.quality,
        visualReferenceThumbnail: thumbnail,
        audioName: itemDetails.audioName,
        isSaved: false, // Initialize as not saved
    };

    // 3. Save video blob to IndexedDB
    await dbService.saveVideo(newId, videoBlob);

    // 4. Save metadata to localStorage
    const currentHistory = getHistoryMetadata();
    const newHistory = [newMetadataItem, ...currentHistory];
    saveHistoryMetadata(newHistory);
    
    return newMetadataItem;
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
    // 1. Delete from IndexedDB
    await dbService.deleteVideo(id);

    // 2. Delete from localStorage
    const currentHistory = getHistoryMetadata();
    const newHistory = currentHistory.filter(item => item.id !== id);
    saveHistoryMetadata(newHistory);
};

export const clearHistory = async (): Promise<void> => {
    // 1. Clear IndexedDB
    await dbService.clearVideos();
    
    // 2. Clear localStorage
    saveHistoryMetadata([]);
};

/**
 * Marks a history item as 'saved'. This function simulates the "memory recall"
 * part of the cerebral cortex concept. By flagging an item as 'saved', we are
 * reinforcing a successful creation in the app's "memory". This is the first
 * step in our data cluster for preference analysis.
 * @param id The ID of the history item to save.
 * @returns The updated history array.
 */
export const markHistoryItemAsSaved = (id: string): HistoryMetadata[] => {
    const currentHistory = getHistoryMetadata();
    const newHistory = currentHistory.map(item => {
        if (item.id === id) {
            return { ...item, isSaved: true };
        }
        return item;
    });
    saveHistoryMetadata(newHistory);
    return newHistory;
};


// == UTILITY FOR RETRIEVING VIDEO FOR PLAYBACK ==

export const getVideoUrl = async (id: string): Promise<string | null> => {
    const blob = await dbService.getVideo(id);
    if (blob) {
        return URL.createObjectURL(blob);
    }
    return null;
};
