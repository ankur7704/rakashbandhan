import { z } from 'zod';

export type Memory = {
  id: string;
  imageUrl: string;
  imageDescription: string;
  wish: string;
  year: string;
  rotation: number;
  scale: number;
  dataAiHint?: string;
};

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A prompt to guide the image generation.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().url(),
  status: z.enum(['completed', 'failed']),
  error: z.string().optional(),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;
