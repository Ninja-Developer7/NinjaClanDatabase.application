
import { GoogleGenAI } from "@google/genai";
import { getHistoryMetadata } from './historyService';

// This service acts as a higher-level cognitive function, analyzing memories 
// (saved prompts) to generate new, related ideas, forming the predictive layer
// of the app's conceptual "brain".
const SUGGESTIONS_CACHE_KEY = 'prompt-suggestions-cache';

const generateSuggestionsFromAPI = async (prompts: string[]): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const instruction = `Based on the following user-saved video prompts, generate exactly 3 new, creative, and distinct prompt ideas that match the user's apparent style and interests. The prompts should be concise and suitable for a video generation model.
    Return ONLY a JSON array of 3 strings, like ["prompt 1", "prompt 2", "prompt 3"]. Do not include any other text, markdown, or formatting.
    
    User's Saved Prompts:
    ${prompts.map(p => `- "${p}"`).join('\n')}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: instruction,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.85,
                topP: 0.9,
                // Disable thinking for faster, more direct JSON generation
                thinkingConfig: { thinkingBudget: 0 },
            },
        });

        const jsonText = response.text.trim();
        const jsonResponse = JSON.parse(jsonText);
        
        if (Array.isArray(jsonResponse) && jsonResponse.every(item => typeof item === 'string')) {
            return jsonResponse.slice(0, 3); // Ensure exactly 3 are returned
        }
        console.warn("AI response was not a valid string array:", jsonResponse);
        return [];
    } catch (e) {
        console.error("Failed to parse prompt suggestions from API:", e);
        return [];
    }
};

/**
 * Gets personalized prompt suggestions based on user's saved videos.
 * Requires at least 2 saved videos to generate meaningful suggestions.
 * Uses sessionStorage to cache results and avoid redundant API calls.
 */
export const getPromptSuggestions = async (): Promise<string[]> => {
    const history = getHistoryMetadata();
    const savedPrompts = history.filter(item => item.isSaved).map(item => item.prompt);

    if (savedPrompts.length < 2) {
        // Not enough data for meaningful suggestions
        return [];
    }
    
    // Simple cache: invalidate if the number of saved prompts changes.
    const cachedData = sessionStorage.getItem(SUGGESTIONS_CACHE_KEY);
    if (cachedData) {
        try {
            const { count, suggestions } = JSON.parse(cachedData);
            if (count === savedPrompts.length) {
                return suggestions;
            }
        } catch (e) {
            console.error("Failed to parse suggestions cache", e);
            sessionStorage.removeItem(SUGGESTIONS_CACHE_KEY);
        }
    }
    
    const newSuggestions = await generateSuggestionsFromAPI(savedPrompts);

    if (newSuggestions.length > 0) {
        sessionStorage.setItem(SUGGESTIONS_CACHE_KEY, JSON.stringify({
            count: savedPrompts.length,
            suggestions: newSuggestions
        }));
    }
    
    return newSuggestions;
};
