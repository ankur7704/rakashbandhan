'use server';
/**
 * @fileOverview Generates a short video from an image using AI.
 *
 * - generateVideoFromImage - A function that handles the video generation process.
 * - GenerateVideoInput - The input type for the generateVideoFromImage function.
 * - GenerateVideoOutput - The return type for the generateVideoFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

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


export async function generateVideo(input: GenerateVideoInput): Promise<any> {
    console.log("Starting video generation for:", input.prompt);
    try {
        let { operation } = await ai.generate({
            model: googleAI.model('veo-2.0-generate-001'),
            prompt: [
              {
                media: {
                  url: input.photoDataUri,
                },
              },
              {
                text: `${input.prompt}. Make it a cinematic, high quality, emotional and heartwarming 5 second video.`,
              },
            ],
            config: {
              durationSeconds: 5,
              aspectRatio: '16:9',
            },
        });

        if (!operation) {
            throw new Error('Video generation operation did not start.');
        }
        
        console.log("Operation started:", operation.name);
        return { videoId: operation.name, status: 'processing' };

    } catch(e) {
        console.error("Error starting video generation:", e);
        return { videoId: '', status: 'failed', error: (e as Error).message };
    }
}


export async function checkVideoStatus(videoId: string): Promise<any> {
    try {
        let operation = await ai.checkOperation({ name: videoId });
        
        if (!operation) {
            throw new Error("Operation not found");
        }
        
        if (operation.error) {
            console.error('Video generation failed:', operation.error);
            return { videoId, status: 'failed', error: operation.error.message };
        }

        if (operation.done) {
            const video = operation.output?.message?.content.find((p) => !!p.media);
            if (!video) {
                throw new Error('Generated video not found in operation result');
            }

            const fetch = (await import('node-fetch')).default;
            const videoDownloadResponse = await fetch(
              `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
            );
            
            if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
                throw new Error(`Failed to download video: ${videoDownloadResponse.statusText}`);
            }

            const videoBuffer = await videoDownloadResponse.arrayBuffer();
            const base64Video = Buffer.from(videoBuffer).toString('base64');
            const videoDataUri = `data:video/mp4;base64,${base64Video}`;

            return { videoId, status: 'completed', videoUrl: videoDataUri };
        }
        
        return { videoId, status: 'processing' };

    } catch (e) {
        console.error(`Error checking status for video ${videoId}:`, e);
        return { videoId, status: 'failed', error: (e as Error).message };
    }
}
