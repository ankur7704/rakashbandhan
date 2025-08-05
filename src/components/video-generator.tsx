'use client';
import React, { useState, useEffect, useRef } from 'react';
import type { Memory } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader, Clapperboard, RefreshCcw, AlertTriangle } from 'lucide-react';
import { generateVideoAction, checkVideoStatusAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

type VideoGeneratorProps = {
  memory: Memory;
  onClose: () => void;
};

type VideoStatus = 'idle' | 'starting' | 'processing' | 'completed' | 'failed';

const prompts = [
    "Make this photo come alive with a gentle zoom and soft, floating particles.",
    "Animate this image with a subtle heartbeat pulse effect.",
    "Create a cinematic reveal of this memory.",
    "Add a touch of magic with sparkling light effects.",
    "A funny, short animation based on this image."
];

export default function VideoGenerator({ memory, onClose }: VideoGeneratorProps) {
  const [status, setStatus] = useState<VideoStatus>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const { toast } = useToast();
  const pollIntervalRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Clear interval on component unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const pollStatus = (id: string) => {
    pollIntervalRef.current = setInterval(async () => {
      console.log("Polling for video status:", id);
      const result = await checkVideoStatusAction(id);
      
      if (result.status === 'completed') {
        setStatus('completed');
        setVideoUrl(result.videoUrl);
        clearInterval(pollIntervalRef.current);
        toast({ title: 'Video Taiyaar Hai!', description: 'Aapka video ab dekha ja sakta hai.' });
      } else if (result.status === 'failed') {
        setStatus('failed');
        setError(result.error || 'Ek anjaan galti hui.');
        clearInterval(pollIntervalRef.current);
        toast({ variant: 'destructive', title: 'Video Nahi Ban Paaya', description: result.error || 'Kripya dobara koshish karein.' });
      }
      // if processing, continue polling
    }, 5000); // Poll every 5 seconds
  };

  const handleGenerateClick = async () => {
    setStatus('starting');
    setError(null);
    setVideoId(null);
    setVideoUrl(null);

    try {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      const result = await generateVideoAction({ 
          photoDataUri: memory.imageUrl, 
          prompt: `${randomPrompt} based on the description: ${memory.imageDescription}`
      });

      if (result.status === 'processing' && result.videoId) {
        setStatus('processing');
        setVideoId(result.videoId);
        pollStatus(result.videoId);
      } else {
        throw new Error(result.error || 'Video generation failed to start.');
      }
    } catch (e) {
      const err = e as Error;
      setStatus('failed');
      setError(err.message);
      toast({ variant: 'destructive', title: 'Shuru Karne Mein Samasya', description: err.message });
    }
  };
  
  const renderContent = () => {
      switch (status) {
          case 'idle':
              return (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                      <Clapperboard className="w-16 h-16 text-primary mb-4"/>
                      <h2 className="text-xl font-headline mb-2">Yaadgaar Video Banaayein</h2>
                      <p className="text-muted-foreground mb-6">Is photo se ek chhota, anokha video banane ke liye AI ka jaadu dekhein.</p>
                      <Button onClick={handleGenerateClick}>
                          <Clapperboard className="mr-2"/> Abhi Banayein
                      </Button>
                  </div>
              );
          case 'starting':
          case 'processing':
              return (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                       <Loader className="w-16 h-16 text-primary animate-spin mb-4"/>
                       <h2 className="text-xl font-headline mb-2">Video Ban Raha Hai...</h2>
                       <p className="text-muted-foreground">AI aapki yaad ko zinda kar raha hai. Isme thoda samay lag sakta hai, kripya intezaar karein.</p>
                  </div>
              )
          case 'completed':
              return (
                  <div className="p-4">
                      {videoUrl ? (
                         <>
                            <video src={videoUrl} controls autoPlay className="w-full rounded-lg aspect-video" />
                            <div className="flex justify-center mt-4">
                               <Button onClick={handleGenerateClick} variant="outline">
                                  <RefreshCcw className="mr-2" /> Naya Banayein
                               </Button>
                            </div>
                         </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                           <AlertTriangle className="w-16 h-16 text-destructive mb-4"/>
                           <h2 className="text-xl font-headline mb-2">Video Load Nahi Hua</h2>
                           <Button onClick={handleGenerateClick} variant="outline">
                                <RefreshCcw className="mr-2" /> Dobara Koshish Karein
                            </Button>
                        </div>
                      )}
                  </div>
              )
          case 'failed':
               return (
                <div className="flex flex-col items-center justify-center text-center p-8">
                    <AlertTriangle className="w-16 h-16 text-destructive mb-4"/>
                    <h2 className="text-xl font-headline mb-2">Kuch Gadbad Ho Gayi</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm">{error}</p>
                    <Button onClick={handleGenerateClick} variant="outline">
                        <RefreshCcw className="mr-2" /> Dobara Koshish Karein
                    </Button>
                </div>
            )
      }
  }

  return (
    <div className="bg-background rounded-lg">
      {renderContent()}
    </div>
  );
}
