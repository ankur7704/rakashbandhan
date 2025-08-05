'use server';
/**
 * @fileOverview Generates an image from a prompt using AI.
 *
 * - generateImage - A function that handles the image generation process.
 */

import {ai} from '@/ai/genkit';
import type { GenerateImageInput, GenerateImageOutput } from '@/types';
import { googleAI } from '@genkit-ai/googleai';

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    console.log("Starting image generation for:", input.prompt);

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set.");
        return { imageUrl: '', status: 'failed', error: 'Admin ne API Key set nahi ki hai. Kripya unse sampark karein.' };
    }

    try {
        const { media } = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: `A beautiful, artistic, and magical digital painting based on the following description: ${input.prompt}. Style: ethereal, dreamy, with soft lighting.`,
          config: {
            responseModalities: ['TEXT', 'IMAGE'], 
          },
        });
        
        if (!media?.url) {
            throw new Error("Image generation did not return an image.");
        }

        return { imageUrl: media.url, status: 'completed' };

    } catch(e) {
        console.error("Error during image generation:", e);
        const errorMessage = (e as Error).message;
        if (errorMessage.includes('billing')) {
             return { imageUrl: '', status: 'failed', error: 'Image model istemaal karne ke liye aapke Google Cloud account par billing chalu hona zaroori hai. Kripya apne account settings check karein.' };
        }
        return { imageUrl: '', status: 'failed', error: errorMessage };
    }
}
