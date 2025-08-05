'use server';
/**
 * @fileOverview Generates a short video from an image using AI.
 *
 * - generateVideoFromImage - A function that handles the video generation process.
 */

import {ai} from '@/ai/genkit';
import type { GenerateVideoInput } from '@/types';
import { googleAI } from '@genkit-ai/googleai';

export async function generateVideo(input: GenerateVideoInput): Promise<any> {
    console.log("Starting video generation for:", input.prompt);
    try {
        let { operation } = await ai.generate({
            model: googleAI.model('veo-2.0-generate-001'),
            prompt: [
              {
                media: {
                  url: input.photoDataUri,
                  contentType: 'image/jpeg'
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
            if (!video || !video.media) {
                throw new Error('Generated video not found in operation result');
            }

            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY environment variable is not set.');
            }

            const fetch = (await import('node-fetch')).default;
            const videoDownloadResponse = await fetch(
              `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
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
