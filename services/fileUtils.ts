
export const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as base64 string."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    return {
        imageBytes: base64EncodedData,
        mimeType: file.type,
    };
};

const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to read file as data URL."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};


/**
 * Extracts a single frame from a video file and returns its base64 representation.
 * @param videoFile The video file to process.
 * @returns A promise that resolves to an object containing the base64-encoded image data and its MIME type.
 */
export const extractFrameFromVideo = (videoFile: File): Promise<{ base64: string; mimeType: string; dataUrl: string; }> => {
    return new Promise((resolve, reject) => {
        // Fix: Use `window.document` to explicitly access the DOM from the global scope.
        const video = window.document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(videoFile);
        video.muted = true;
        video.playsInline = true;

        const cleanup = () => {
            URL.revokeObjectURL(video.src);
        };

        video.onloadedmetadata = () => {
            video.currentTime = video.duration * 0.25;
        };

        video.onseeked = () => {
            setTimeout(() => {
                // Fix: Use `window.document` to explicitly access the DOM from the global scope.
                const canvas = window.document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    cleanup();
                    return reject(new Error("Could not get canvas context."));
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                const base64EncodedData = dataUrl.split(',')[1];
                cleanup();

                if (!base64EncodedData) {
                    return reject(new Error("Failed to extract frame from video canvas."));
                }
                
                resolve({
                    base64: base64EncodedData,
                    mimeType: 'image/jpeg',
                    dataUrl: dataUrl
                });
            }, 100);
        };

        video.onerror = (e) => {
            cleanup();
            console.error("Video processing error:", e);
            reject(new Error("Error processing video. It may be corrupt or in an unsupported format."));
        };

        video.play().catch(() => {});
    });
};


/**
 * Creates a data URL thumbnail for a given file (image or video).
 * @param file The file to create a thumbnail for.
 * @returns A promise that resolves to a data URL string.
 */
export const createThumbnail = async (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) {
        return fileToDataURL(file);
    } else if (file.type.startsWith('video/')) {
        const { dataUrl } = await extractFrameFromVideo(file);
        return dataUrl;
    } else {
        throw new Error("Unsupported file type for thumbnail generation.");
    }
};