'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Memory } from '@/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import BackgroundAnimations from '@/components/background-animations';
import MemoryCard from '@/components/memory-card';
import MemoryForm from '@/components/memory-form';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { generateWishAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function AlbumPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedMemories = localStorage.getItem('raksha-bandhan-memories');
    if (storedMemories) {
      const parsedMemories: Memory[] = JSON.parse(storedMemories);
      const memoriesWithStyles = parsedMemories.map((mem) => ({
        ...mem,
        rotation: 0,
        scale: 1,
      }));
      setMemories(memoriesWithStyles);
    } else {
      // If no memories are found, redirect back to the creation page
      router.push('/');
    }
  }, [router]);

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
    const radius = Math.max(total * 40, 250); // Adjust radius based on number of cards, with a minimum
    const transform = `rotateY(${angle}deg) translateZ(${radius}px) translateY(-50%)`;
    const transformHover = `rotateY(${angle}deg) translateZ(${radius}px) translateY(-50%) scale(1.1)`;
    return {
      transform,
      '--transform-hover': transformHover,
    };
  };

  if (!memories.length) {
    return (
       <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                  style={getCardStyle(index, memories.length) as React.CSSProperties}
                  onClick={() => handleOpenModal(memory)}
                >
                  <MemoryCard
                    memory={memory}
                    isActive={true} // All cards are interactive in this view
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 mt-8">
             <p className="text-muted-foreground text-center max-w-md">
                This is your digital Raksha Bandhan album. Hover over a card to pause the animation and click to edit the memory or get a new AI-generated wish.
             </p>
             <Button variant="outline" onClick={() => router.push('/')}>
                Back to Editor
             </Button>
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
