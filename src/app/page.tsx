'use client';

import React, { useState, useEffect } from 'react';
import type { Memory } from '@/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import BackgroundAnimations from '@/components/background-animations';
import MemoryCard from '@/components/memory-card';
import MemoryForm from '@/components/memory-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { generateWishAction } from './actions';
import { useToast } from '@/hooks/use-toast';

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
      rotation: Math.random() * 8 - 4,
      scale: 1,
    }));
    setMemories(memoriesWithStyles);
  }, []);

  const handleOpenModal = (memory: Memory | null) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleSaveMemory = async (formData: {
    imageFile?: File;
    imageDescription: string;
    wish: string;
  }) => {
    if (editingMemory) {
      // Edit existing memory
      setMemories(
        memories.map((mem) =>
          mem.id === editingMemory.id
            ? { ...mem, ...formData, imageUrl: editingMemory.imageUrl, wish: formData.wish }
            : mem
        )
      );
      toast({ title: "Memory Updated!", description: "Your beautiful memory has been saved." });
    } else {
      // Add new memory
      let imageUrl = 'https://placehold.co/600x400.png';
      if (formData.imageFile) {
        imageUrl = URL.createObjectURL(formData.imageFile);
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
        rotation: Math.random() * 8 - 4,
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
    setMemories(memories.filter((mem) => mem.id !== id));
    toast({ variant: "destructive", title: "Memory Removed", description: "The memory has been removed from your album." });
    setIsModalOpen(false);
    setEditingMemory(null);
  };


  return (
    <>
      <BackgroundAnimations />
      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-8 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto py-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {memories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={() => handleOpenModal(memory)}
                />
              ))}
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 p-8 text-center text-primary/80 transition-all duration-300 hover:border-primary hover:bg-primary/20 hover:text-primary hover:shadow-xl"
                onClick={() => handleOpenModal(null)}
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
        </main>
        <Footer />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0">
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
