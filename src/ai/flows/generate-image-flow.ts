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
  imageUrl: z.string().url(),
  wish: z.string().describe('A new, funny, and comedic wish or caption for the generated image, written in Hinglish. It should reflect the playful banter (nok-jhok) between siblings.'),
  status: z.enum(['completed', 'failed']),
  error: z.string().optional(),
});

const funnyPrompts = [
    "Recreate this photo as a funny cartoon where the siblings are playfully arguing over a TV remote. Make their expressions exaggerated and comical. Ensure their faces are recognizable from the original photo.",
    "Turn this moment into a funny scene where one sibling is depicted as a mischievous monkey teasing the other. Make sure to keep the facial likeness from the original image.",
    "Imagine this scene where one sibling has turned into a fluffy cat trying to steal a fish from the other, who is looking surprised. Keep the faces similar to the original photo.",
    "Redraw this in a vintage comic book style, with one sibling as a superhero and the other as their goofy sidekick during a mundane task like cleaning a room. Retain their facial features.",
    "An artwork where the siblings are chefs in a chaotic kitchen, comically failing to bake a cake, with flour everywhere. Make sure their faces are clearly identifiable.",
    "Depict the siblings as characters in a classic video game, like Mario and Luigi, but on a funny quest to find a hidden stash of chocolates. Ensure the faces look like the people in the photo.",
    "Create a hilarious image where one sibling is a goofy-looking dog holding a bone, and the other is trying to snatch it away playfully. Maintain the facial resemblance from the original picture."
];

const prompt = ai.definePrompt({
    name: 'generateFunnyImagePrompt',
    input: { schema: z.object({
        prompt: z.string(),
        imageDataUri: z.string()
    })},
    output: { schema: GenerateImageOutputSchema },

    prompt: `You are a creative AI that generates funny and personal images for Raksha Bandhan. Your task is to take an original photo and a theme, and create a new, hilarious image and a matching witty caption in Hinglish.

    **CRITICAL INSTRUCTIONS:**
    1.  **Preserve Faces:** You MUST use the faces of the people from the original photo. Do not create new people. The generated image must be recognizable as the same individuals.
    2.  **Funny Theme:** Generate an image based on the following theme: {{{prompt}}}
    3.  **Funny Caption:** Write a new, short, funny, and comedic caption or wish in Hinglish for the image you just generated. The caption should be about the playful sibling relationship (nok-jhok).

    **PHOTO:**
    {{media url=imageDataUri}}
    `,
});


export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    console.log("Starting image generation for:", input.prompt);

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set.");
        return { imageUrl: '', wish: '', status: 'failed', error: 'Admin ne API Key set nahi ki hai. Kripya unse sampark karein.' };
    }

    try {
        if (!input.imageDataUri) {
            throw new Error("Original image is required to generate a magic moment.");
        }

        const randomPrompt = funnyPrompts[Math.floor(Math.random() * funnyPrompts.length)];
        
        const { output } = await prompt({
            prompt: randomPrompt,
            imageDataUri: input.imageDataUri
        });

        if (!output?.imageUrl) {
            throw new Error("Image generation did not return an image.");
        }

        return { ...output, status: 'completed' };

    } catch(e) {
        console.error("Error during image generation:", e);
        const errorMessage = (e as Error).message;
        if (errorMessage.includes('billing')) {
             return { imageUrl: '', wish: '', status: 'failed', error: 'Image model istemaal karne ke liye aapke Google Cloud account par billing chalu hona zaroori hai. Kripya apne account settings check karein.' };
        }
        if (errorMessage.includes('API key not valid')) {
            return { imageUrl: '', wish: '', status: 'failed', error: 'Di gayi API Key galat hai. Kripya sahi key daalein.' };
        }
        return { imageUrl: '', wish: '', status: 'failed', error: errorMessage };
    }
}
