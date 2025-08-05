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
  wish: z.string().describe('A heartfelt Raksha Bandhan wish or quote in Hinglish.'),
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
  prompt: `Aap ek AI assistant hain jo Raksha Bandhan ke liye dil se nikle sandesh aur quotes likhte hain.
  Aapko Hinglish (Hindi written in English letters) mein jawab dena hai.
  Di gayi image ke vivaran ke aadhar par, ek mazedaar, bhavnaatmak ya dil ko chu lene wala Raksha Bandhan ka sandesh ya quote banayein.

  Image ka Vivaran: {{{imageDescription}}}
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
