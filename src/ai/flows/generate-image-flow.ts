'use server';
/**
 * @fileOverview Generates an image from a prompt using AI.
 *
 * - generateImage - A function that handles the image generation process.
 */

import {ai} from '@/ai/genkit';
import type { GenerateImageInput, GenerateImageOutput } from '@/types';
import {z} from 'genkit';

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image as a data URI.'),
  wish: z.string().describe('A new, funny, and comedic wish or caption for the generated image, written in Hinglish. It should reflect the playful banter (nok-jhok) between siblings.'),
  status: z.enum(['completed', 'failed']),
  error: z.string().optional(),
});

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    console.log("Starting image generation for prompt:", input.prompt);

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set.");
        return { imageUrl: '', wish: '', status: 'failed', error: 'Admin ne API Key set nahi ki hai. Kripya unse sampark karein.' };
    }

    try {
        const generationPrompt = `
            You are a creative AI that generates funny and personal cartoon-style images for Raksha Bandhan. 
            Your task is to take a description of a memory and create a new, hilarious cartoon image and a matching witty caption in Hinglish.

            **INSTRUCTIONS:**
            1.  **FUNNY CARTOON STYLE:** Generate a new, funny cartoon or caricature based on the following theme. The image should be vibrant, comical, and light-hearted.
            2.  **THEME:** ${input.prompt}
            3.  **FUNNY CAPTION:** Write a completely new, short, funny, and comedic caption or wish in Hinglish for the image you just generated. The caption must be about the playful sibling relationship (nok-jhok) and should humorously describe the new scene.
        `;

        const { media, output } = await ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: generationPrompt,
            output: {
                schema: z.object({
                    wish: z.string().describe('A new, funny, and comedic wish or caption for the generated image, written in Hinglish. It should reflect the playful banter (nok-jhok) between siblings.'),
                })
            },
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        
        if (!media?.url) {
            throw new Error("Image generation did not return an image.");
        }

        return { 
            imageUrl: media.url, // This is a data URI
            wish: output?.wish || "Ek anokha pal!", 
            status: 'completed' 
        };

    } catch(e) {
        console.error("Error during image generation:", e);
        const errorMessage = (e as Error).message;
        if (errorMessage.includes('billing')) {
             return { imageUrl: '', wish: '', status: 'failed', error: 'Image model istemaal karne ke liye aapke Google Cloud account par billing chalu hona zaroori hai. Kripya apne account settings check karein.' };
        }
        if (errorMessage.includes('API key not valid')) {
            return { imageUrl: '', wish: '', status: 'failed', error: 'Di gayi API Key galat hai. Kripya sahi key daalein.' };
        }
        return { imageUrl: '', wish: '', status: 'failed', error: 'AI se image banate waqt kuch gadbad ho gayi. Kripya dobara koshish karein.' };
    }
}
