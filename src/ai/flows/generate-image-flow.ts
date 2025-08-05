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
  imageUrl: z.string().describe('The URL of the generated image.'),
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
    "Create a hilarious image where one sibling is a goofy-looking dog holding a bone, and the other is trying to snatch it away playfully. Maintain the facial resemblance from the original picture.",
    "Turn this photo into a scene from a Bollywood movie poster, where the siblings are in dramatic, over-the-top poses. Make sure their faces from the photo are used.",
    "Illustrate this as a scene where the siblings are two old people, sitting on a bench and still bickering like kids. Use their faces from the original picture.",
    "Create a funny image of the siblings as astronauts floating in space, arguing over who gets the window seat in the spaceship. Their faces must be from the original photo."
];

const prompt = ai.definePrompt({
    name: 'generateFunnyImagePrompt',
    input: { schema: z.object({
        prompt: z.string(),
        imageDataUri: z.string()
    })},
    output: { schema: z.object({
        imageUrl: z.string().describe('The URL of the generated image.'),
        wish: z.string().describe('A new, funny, and comedic wish or caption for the generated image, written in Hinglish. It should reflect the playful banter (nok-jhok) between siblings.'),
    }) },

    prompt: `You are a creative AI that generates funny and personal images for Raksha Bandhan. Your task is to take an original photo and a theme, and create a new, hilarious image and a matching witty caption in Hinglish.

    **CRITICAL, NON-NEGOTIABLE INSTRUCTIONS:**
    1.  **PRESERVE FACES FROM THE ORIGINAL PHOTO:** This is the most important rule. You MUST use the exact faces of the people from the original photo provided. Do not alter their faces, generate new faces, or replace them. The new image's characters MUST be perfectly recognizable as the same individuals from the original photo. Failure to do this will ruin the purpose of the image.
    2.  **FUNNY THEME:** Generate a new image based on the following creative theme: {{{prompt}}}
    3.  **FUNNY CAPTION:** Write a completely new, short, funny, and comedic caption or wish in Hinglish for the image you just generated. The caption must be about the playful sibling relationship (nok-jhok) and should humorously describe the new scene.

    **ORIGINAL PHOTO (Use faces from here):**
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
