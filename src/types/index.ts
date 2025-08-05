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

export const GenerateVideoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a memory, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
    prompt: z.string().describe('A prompt to guide the video generation.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

export const GenerateVideoOutputSchema = z.object({
  videoId: z.string(),
  status: z.enum(['processing', 'completed', 'failed']),
  videoUrl: z.string().optional(),
  error: z.string().optional(),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;
