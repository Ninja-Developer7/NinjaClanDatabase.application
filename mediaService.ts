

import { toBlobURL } from '@ffmpeg/util';

// Type definition for FFmpeg instance to be used internally.
// We define it here to avoid a top-level import of the entire library.
interface FFmpegInstance {
    load: (config: any) => Promise<void>;
    on: (event: string, callback: (log: { message: string }) => void) => void;
    writeFile: (name: string, data: Uint8Array | string) => Promise<void>;
    exec: (args: string[]) => Promise<number>;
    readFile: (name: string) => Promise<Uint8Array | string>;
}

let ffmpeg: FFmpegInstance | null = null;

const loadFFmpeg = async (updateLoadingMessage: (message: string) => void): Promise<FFmpegInstance> => {
    if (ffmpeg) {
        return ffmpeg;
    }

    updateLoadingMessage('Loading media processing tools...');
    
    // Dynamically import the FFmpeg library only when needed
    const { FFmpeg } = await import('@ffmpeg/ffmpeg');

    const newFFmpeg = new FFmpeg();
    newFFmpeg.on('log', ({ message }) => {
        // Suppress verbose ffmpeg logs from the console for a cleaner experience
        // console.log(message);
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    
    await newFFmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    // Fix: Cast FFmpeg instance to `any` to satisfy the internal interface definition.
    ffmpeg = newFFmpeg as any;
    return ffmpeg;
};

export const stitchVideos = async (
    videoBlobs: Blob[],
    updateLoadingMessage: (message: string) => void
): Promise<Blob> => {
    const ffmpegInstance = await loadFFmpeg(updateLoadingMessage);

    updateLoadingMessage('Preparing clips for editing...');
    
    const fileNames: string[] = [];
    let fileListContent = '';

    for (let i = 0; i < videoBlobs.length; i++) {
        const fileName = `clip${i}.mp4`;
        const data = new Uint8Array(await videoBlobs[i].arrayBuffer());
        await ffmpegInstance.writeFile(fileName, data);
        fileNames.push(fileName);
        fileListContent += `file '${fileName}'\n`;
    }

    await ffmpegInstance.writeFile('mylist.txt', fileListContent);

    updateLoadingMessage('Stitching video clips together...');

    // Command explanation:
    // -f concat: Use the concatenate demuxer.
    // -safe 0: Allow unsafe file paths (necessary for virtual filesystem).
    // -i mylist.txt: The input is the list of files to concatenate.
    // -c copy: Copy the streams without re-encoding (very fast and preserves quality).
    await ffmpegInstance.exec(['-f', 'concat', '-safe', '0', '-i', 'mylist.txt', '-c', 'copy', 'output.mp4']);

    updateLoadingMessage('Finalizing your video...');
    const outputData = await ffmpegInstance.readFile('output.mp4');

    return new Blob([(outputData as Uint8Array).buffer], { type: 'video/mp4' });
};

export const mergeAudioAndVideo = async (
    videoBlob: Blob,
    audioBlob: Blob,
    updateLoadingMessage: (message: string) => void
): Promise<Blob> => {
    const ffmpegInstance = await loadFFmpeg(updateLoadingMessage);
    
    updateLoadingMessage('Preparing files for processing...');
    const videoData = new Uint8Array(await videoBlob.arrayBuffer());
    await ffmpegInstance.writeFile('input.mp4', videoData);

    const audioData = new Uint8Array(await audioBlob.arrayBuffer());
    await ffmpegInstance.writeFile('input.audio', audioData);

    updateLoadingMessage('Adding audio track to your video...');
    
    // Command explanation:
    // -i input.mp4: specifies the input video file.
    // -i input.audio: specifies the input audio file.
    // -c:v copy: copies the video stream without re-encoding (fast).
    // -c:a aac: encodes the audio stream to AAC (a common, compatible format).
    // -shortest: makes the output duration the same as the shortest input (the 15s video).
    // -y: overwrite output file if it exists.
    await ffmpegInstance.exec(['-i', 'input.mp4', '-i', 'input.audio', '-c:v', 'copy', '-c:a', 'aac', '-shortest', '-y', 'output.mp4']);

    updateLoadingMessage('Finalizing your video...');
    const outputData = await ffmpegInstance.readFile('output.mp4');
    
    return new Blob([(outputData as Uint8Array).buffer], { type: 'video/mp4' });
};