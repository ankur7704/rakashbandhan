'use client';

import React, { useState, useEffect } from 'react';
import type { Memory } from '@/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import BackgroundAnimations from '@/components/background-animations';
import MemoryCard from '@/components/memory-card';
import MemoryForm from '@/components/memory-form';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { generateWishAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const initialMemoriesData: Omit<Memory, 'rotation' | 'scale'>[] = [
  {
    id: '1',
    imageUrl: 'https://placehold.co/600x400.png',
    imageDescription: 'A brother and sister laughing together on a swing.',
    wish: 'Side by side or miles apart, we are siblings connected by the heart. Happy Raksha Bandhan!',
    dataAiHint: 'siblings laughing'
  },
  {
    id: '2',
    imageUrl: 'https://placehold.co/600x400.png',
    imageDescription: 'A sister tying a rakhi on her brother\'s wrist.',
    wish: 'The thread of Rakhi is a thread of love that binds our lives and hearts. Wishing you a joyful Raksha Bandhan.',
    dataAiHint: 'rakhi tying'
  },
  {
    id: '3',
    imageUrl: 'https://placehold.co/600x400.png',
    imageDescription: 'An old black and white photo of two young siblings.',
    wish: 'From childhood squabbles to a lifetime of support, our bond is the most precious gift. Happy Rakhi!',
    dataAiHint: 'childhood photo'
  },
];

export default function Home() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const memoriesWithStyles = initialMemoriesData.map((mem) => ({
      ...mem,
      rotation: 0,
      scale: 1,
    }));
    setMemories(memoriesWithStyles);
  }, []);

  const handleOpenModal = (memory: Memory | null) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingMemory(null);
    setIsModalOpen(true);
  }

  const handleSaveMemory = async (formData: {
    imageFile?: File;
    imageDescription: string;
    wish: string;
    imagePreview?: string;
  }) => {
    let imageUrl = formData.imagePreview;
  
    if (editingMemory) {
      // Edit existing memory
      setMemories(
        memories.map((mem) =>
          mem.id === editingMemory.id
            ? {
                ...mem,
                imageDescription: formData.imageDescription,
                wish: formData.wish,
                imageUrl: imageUrl || mem.imageUrl,
                dataAiHint: formData.imageDescription.split(' ').slice(0,2).join(' ')
              }
            : mem
        )
      );
      toast({ title: "Memory Updated!", description: "Your beautiful memory has been saved." });
    } else {
      // Add new memory
      if (!imageUrl) {
        imageUrl = 'https://placehold.co/600x400.png';
      }
      
      let finalWish = formData.wish;
      if (!finalWish && formData.imageDescription) {
        try {
          const result = await generateWishAction({ imageDescription: formData.imageDescription });
          if (result?.wish) {
            finalWish = result.wish;
          } else {
            throw new Error('Could not generate a wish.');
          }
        } catch (error) {
          toast({ variant: "destructive", title: "AI Error", description: "Failed to generate a wish. Please try again." });
          return;
        }
      }

      const newMemory: Memory = {
        id: new Date().toISOString(),
        imageUrl,
        imageDescription: formData.imageDescription,
        wish: finalWish,
        rotation: 0,
        scale: 1,
        dataAiHint: formData.imageDescription.split(' ').slice(0,2).join(' ')
      };
      setMemories([...memories, newMemory]);
      toast({ title: "Memory Added!", description: "A new cherished moment is now in your album." });
    }
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const handleDeleteMemory = (id: string) => {
    const newMemories = memories.filter((mem) => mem.id !== id);
    setMemories(newMemories);
    toast({ variant: "destructive", title: "Memory Removed", description: "The memory has been removed from your album." });
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const getCardStyle = (index: number, total: number) => {
    const angle = (360 / total) * index;
    const radius = total * 50; // Adjust radius based on number of cards
    const transform = `rotateY(${angle}deg) translateZ(${radius}px) translateY(-50%)`;
    const transformHover = `rotateY(${angle}deg) translateZ(${radius}px) translateY(-50%) scale(1.1)`;
    return {
      transform,
      '--transform-hover': transformHover,
    };
  };

  return (
    <>
      <BackgroundAnimations />
      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-8 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="carousel-container my-12">
            <div className="carousel">
              {memories.map((memory, index) => (
                <div
                  key={memory.id}
                  className="carousel-card"
                  style={getCardStyle(index, memories.length + 1) as React.CSSProperties}
                  onClick={() => handleOpenModal(memory)}
                >
                  <MemoryCard
                    memory={memory}
                    isActive={true} // All cards are interactive in this view
                  />
                </div>
              ))}
              <div
                className="carousel-card"
                style={getCardStyle(memories.length, memories.length + 1) as React.CSSProperties}
              >
                <div
                  className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 p-8 text-center text-primary/80 transition-all duration-300 hover:border-primary hover:bg-primary/20 hover:text-primary hover:shadow-xl"
                  onClick={handleAddNew}
                  role="button"
                  aria-label="Add new memory"
                >
                  <PlusCircle className="mb-4 h-12 w-12" />
                  <h3 className="font-headline text-xl font-semibold">
                    Add a New Memory
                  </h3>
                  <p className="mt-1 text-sm">Click here to upload a new moment.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8 mt-8">
             <p className="text-muted-foreground text-center">Hover over a card to pause and click to edit.</p>
          </div>
        </main>
        <Footer />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0">
         <DialogTitle className="sr-only">
            {editingMemory ? 'Edit this Memory' : 'Create a New Memory'}
          </DialogTitle>
          <MemoryForm
            memoryToEdit={editingMemory}
            onSave={handleSaveMemory}
            onDelete={editingMemory ? () => handleDeleteMemory(editingMemory.id) : undefined}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
