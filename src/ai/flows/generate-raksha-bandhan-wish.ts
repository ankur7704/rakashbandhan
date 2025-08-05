'use server';
/**
 * @fileOverview Generates a heartfelt Raksha Bandhan wish or quote for a given image description.
 *
 * - generateRakshaBandhanWish - A function that generates a Raksha Bandhan wish.
 * - GenerateRakshaBandhanWishInput - The input type for the generateRakshaBandhanWish function.
 * - GenerateRakshaBandhanWishOutput - The return type for the generateRakshaBandhanWish function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRakshaBandhanWishInputSchema = z.object({
  imageDescription: z
    .string()
    .describe('A description of the image for which to generate a Raksha Bandhan wish.'),
});
export type GenerateRakshaBandhanWishInput = z.infer<
  typeof GenerateRakshaBandhanWishInputSchema
>;

const GenerateRakshaBandhanWishOutputSchema = z.object({
  wish: z.string().describe('A heartfelt Raksha Bandhan wish or quote.'),
});
export type GenerateRakshaBandhanWishOutput = z.infer<
  typeof GenerateRakshaBandhanWishOutputSchema
>;

export async function generateRakshaBandhanWish(
  input: GenerateRakshaBandhanWishInput
): Promise<GenerateRakshaBandhanWishOutput> {
  return generateRakshaBandhanWishFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRakshaBandhanWishPrompt',
  input: {schema: GenerateRakshaBandhanWishInputSchema},
  output: {schema: GenerateRakshaBandhanWishOutputSchema},
  prompt: `You are an AI assistant specialized in generating heartfelt Raksha Bandhan wishes and quotes.

  Based on the image description provided, create a meaningful and emotional Raksha Bandhan wish or quote.

  Image Description: {{{imageDescription}}}
  `,
});

const generateRakshaBandhanWishFlow = ai.defineFlow(
  {
    name: 'generateRakshaBandhanWishFlow',
    inputSchema: GenerateRakshaBandhanWishInputSchema,
    outputSchema: GenerateRakshaBandhanWishOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
