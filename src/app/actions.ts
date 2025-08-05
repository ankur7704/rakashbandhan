'use server';

import { generateRakshaBandhanWish, GenerateRakshaBandhanWishInput } from '@/ai/flows/generate-raksha-bandhan-wish';
import { generateVideo, checkVideoStatus, GenerateVideoInput } from '@/ai/flows/generate-video-flow';
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

export async function generateVideoAction(input: GenerateVideoInput) {
    try {
        const result = await generateVideo(input);
        return result;
    } catch(error) {
        console.error("Error in generateVideoAction:", error);
        return { status: 'failed', error: 'Video generation failed to start.' };
    }
}

export async function checkVideoStatusAction(videoId: string) {
    try {
        const result = await checkVideoStatus(videoId);
        if (result.status === 'completed' || result.status === 'failed') {
            revalidatePath('/album'); // To update the UI eventually if needed
        }
        return result;
    } catch(error) {
        console.error("Error in checkVideoStatusAction:", error);
        return { status: 'failed', error: 'Failed to check video status.' };
    }
}
