'use server';

import { generateRakshaBandhanWish, GenerateRakshaBandhanWishInput } from '@/ai/flows/generate-raksha-bandhan-wish';
import { generateImage } from '@/ai/flows/generate-image-flow';
import type { GenerateImageInput } from '@/types';
import { revalidatePath } from 'next/cache';

export async function generateWishAction(input: GenerateRakshaBandhanWishInput) {
  try {
    const output = await generateRakshaBandhanWish(input);
    return { wish: output.wish };
  } catch (error) {
    console.error("Error generating wish:", error);
    return { error: 'Failed to generate a wish. Please try again later.' };
  }
}

export async function generateImageAction(input: GenerateImageInput) {
    try {
        const result = await generateImage(input);
        revalidatePath('/album');
        return result;
    } catch(error) {
        console.error("Error in generateImageAction:", error);
        return { status: 'failed', error: 'Image generation failed to start.' };
    }
}
