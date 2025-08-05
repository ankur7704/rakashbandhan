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
  imageDataUri: z.string().optional().describe("The original image to transform, as a data URI."),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().url(),
  wish: z.string(),
  status: z.enum(['completed', 'failed']),
  error: z.string().optional(),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('A prompt to guide the video generation.'),
  imageDataUri: z.string().describe("The original image to use for video generation, as a data URI."),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

export const GenerateVideoOutputSchema = z.object({
  videoId: z.string(),
  status: z.enum(['processing', 'completed', 'failed']),
  videoUrl: z.string().url().optional(),
  error: z.string().optional(),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;
