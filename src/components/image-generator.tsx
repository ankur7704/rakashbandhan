'use client';
import React, { useState } from 'react';
import type { Memory } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader, Sparkles, RefreshCcw, AlertTriangle } from 'lucide-react';
import { generateImageAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type ImageGeneratorProps = {
  memory: Memory;
  onClose: () => void;
};

type ImageStatus = 'idle' | 'generating' | 'completed' | 'failed';

export default function ImageGenerator({ memory, onClose }: ImageGeneratorProps) {
  const [status, setStatus] = useState<ImageStatus>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [wish, setWish] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateClick = async () => {
    setStatus('generating');
    setError(null);
    setImageUrl(null);
    setWish(null);

    try {
      // Prompt is now selected randomly in the backend flow
      const result = await generateImageAction({
          prompt: memory.imageDescription, // This can be used for context if needed
          imageDataUri: memory.imageUrl
      });

      if (result.status === 'completed' && result.imageUrl) {
        setStatus('completed');
        setImageUrl(result.imageUrl);
        setWish(result.wish || "Ek anokha pal!");
        toast({ title: 'Jaadui Image Taiyaar!', description: 'AI ne aapke liye ek anokhi image banayi hai.' });
      } else {
        throw new Error(result.error || 'Image generation failed to start.');
      }
    } catch (e) {
      const err = e as Error;
      setStatus('failed');
      setError(err.message);
      toast({ variant: 'destructive', title: 'Image Nahi Ban Paayi', description: err.message });
    }
  };
  
  const renderContent = () => {
      switch (status) {
          case 'idle':
              return (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                      <div className="relative w-40 h-40 rounded-lg overflow-hidden mb-4 shadow-md">
                          <Image src={memory.imageUrl} alt="Original memory" layout="fill" objectFit="cover" />
                      </div>
                      <Sparkles className="w-12 h-12 text-primary mb-2"/>
                      <h2 className="text-xl font-headline mb-2">Ek Jaadui Pal Banayein</h2>
                      <p className="text-muted-foreground mb-6">Is photo ke chehron ka istemaal karke AI ko ek bilkul nayi, mazedaar image banane dein.</p>
                      <Button onClick={handleGenerateClick}>
                          <Sparkles className="mr-2"/> Abhi Banayein
                      </Button>
                  </div>
              );
          case 'generating':
              return (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                       <Loader className="w-16 h-16 text-primary animate-spin mb-4"/>
                       <h2 className="text-xl font-headline mb-2">Kalpana Ko Rang Mil Rahe Hain...</h2>
                       <p className="text-muted-foreground">AI aapki yaad se ek naya art piece bana raha hai. Kripya intezaar karein.</p>
                  </div>
              )
          case 'completed':
              return (
                  <div className="p-4 text-center">
                      {imageUrl ? (
                         <>
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageUrl} alt="Generated magic moment" className="object-contain h-full w-full" />
                            </div>
                            {wish && <p className="mt-4 text-lg font-headline text-primary-foreground/90 italic">"{wish}"</p>}
                            <div className="flex justify-center mt-4">
                               <Button onClick={handleGenerateClick} variant="outline">
                                  <RefreshCcw className="mr-2" /> Naya Banayein
                               </Button>
                            </div>
                         </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                           <AlertTriangle className="w-16 h-16 text-destructive mb-4"/>
                           <h2 className="text-xl font-headline mb-2">Image Load Nahi Hui</h2>
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
