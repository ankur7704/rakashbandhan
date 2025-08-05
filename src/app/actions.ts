'use server';

import { generateRakshaBandhanWish, GenerateRakshaBandhanWishInput } from '@/ai/flows/generate-raksha-bandhan-wish';

export async function generateWishAction(input: GenerateRakshaBandhanWishInput) {
  try {
    const output = await generateRakshaBandhanWish(input);
    return { wish: output.wish };
  } catch (error) {
    console.error("Error generating wish:", error);
    return { error: 'Failed to generate a wish. Please try again later.' };
  }
}
