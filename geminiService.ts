

import { GoogleGenAI, Type } from "@google/genai";
import { fileToGenerativePart, extractFrameFromVideo } from './fileUtils';
import { Storyboard, Scene, VideoStyle } from '../types';
import * as mediaService from './mediaService';

/**
 * [DIRECTOR STAGE]
 * Uses a text model to act as a video director, breaking down a prompt
 * into a structured storyboard.
 * @param prompt The user's original prompt.
 * @param style The selected anime art style.
 * @returns A promise that resolves to a Storyboard object.
 */
const generateStoryboard = async (prompt: string, style: VideoStyle): Promise<Storyboard> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const instruction = `You are a master anime director. Your task is to interpret a user's prompt and a desired art style, then create a detailed storyboard for a 15-second video.
    
    The storyboard must be broken down into exactly 3 scenes. Each scene should be approximately 5 seconds long.
    For each scene, provide a detailed description of the action, characters, and environment. Also, specify a dynamic camera movement (e.g., "pan left", "dolly zoom", "crane shot up").
    
    User Prompt: "${prompt}"
    Art Style: "${style}"

    Respond with ONLY a valid JSON object matching the provided schema. Do not include any other text or markdown formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: instruction,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    scenes: {
                        type: Type.ARRAY,
                        description: "An array of three scenes that make up the video storyboard.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sceneNumber: { type: Type.INTEGER, description: "The sequential number of the scene (1, 2, or 3)." },
                                description: { type: Type.STRING, description: "A detailed description of the visuals and action in this scene." },
                                camera: { type: Type.STRING, description: "A specific camera movement instruction for this scene." },
                                duration: { type: Type.INTEGER, description: "The duration of the scene in seconds (should be 5)." }
                            },
                            required: ["sceneNumber", "description", "camera", "duration"]
                        }
                    }
                },
                required: ["scenes"]
            },
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 },
        },
    });

    try {
        const jsonText = response.text.trim();
        const storyboard = JSON.parse(jsonText) as Storyboard;
        if (!storyboard.scenes || storyboard.scenes.length !== 3) {
            throw new Error("Storyboard generation did not produce 3 scenes.");
        }
        return storyboard;
    } catch (e) {
        console.error("Failed to parse storyboard from API response:", e);
        throw new Error("The AI director failed to create a valid storyboard. Please try a different prompt.");
    }
};

/**
 * [ART DEPARTMENT STAGE]
 * Generates a single video clip based on a scene from the storyboard.
 * @param scene The scene object from the storyboard.
 * @param style The selected anime art style.
 * @param videoQuality The desired video quality.
 * @param visualReference An optional visual reference file (only used for the first scene).
 * @returns A promise that resolves to a video Blob.
 */
const generateClip = async (
    scene: Scene,
    style: VideoStyle,
    videoQuality: '720p' | '1080p',
    visualReference: File | null
): Promise<Blob> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const resolution = videoQuality === '1080p' ? 'high-definition (1080p)' : 'standard-definition (720p)';
    
    // Construct a detailed prompt for this specific clip
    const clipPrompt = `Create a ${scene.duration}-second, ${resolution} video clip.
    **Art Style:** ${style}.
    **Scene:** ${scene.description}.
    **Camera Movement:** ${scene.camera}.
    Ensure the output is a seamless ${scene.duration}-second .mp4 clip.`;

    const generateVideosParams: any = {
        model: 'veo-2.0-generate-001',
        prompt: clipPrompt,
        config: { numberOfVideos: 1 },
    };

    if (visualReference) {
        if (visualReference.type.startsWith('image/')) {
            generateVideosParams.image = await fileToGenerativePart(visualReference);
        } else if (visualReference.type.startsWith('video/')) {
            try {
                const frameData = await extractFrameFromVideo(visualReference);
                generateVideosParams.image = {
                    imageBytes: frameData.base64,
                    mimeType: frameData.mimeType,
                };
            } catch (err) {
                console.error("Failed to extract frame from video:", err);
                throw new Error("Could not process the uploaded video file. Please try a different video or an image.");
            }
        }
    }

    let operation = await ai.models.generateVideos(generateVideosParams);
