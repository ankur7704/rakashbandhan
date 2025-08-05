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
import { generateWishAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import confetti from 'canvas-confetti';


const thoughtCards = [
    {
      quote: "Bhai-behen ka rishta Tom & Jerry jaisa hota hai, ladte bhi hain aur ek dusre ke bina reh bhi nahi sakte!",
      color: "bg-secondary/20 border-secondary"
    },
    {
      quote: "Rakhi sirf ek dhaaga nahi, ek vaada hai... ki main tera saara chocolates chura lunga/lungi!",
      color: "bg-accent/20 border-accent"
    },
    {
      quote: "Duniya mein sabse best feeling? Jab aapka bhai/behen aapke secret keeper hote hain.",
      color: "bg-primary/20 border-primary"
    },
    {
      quote: "Door ho ya paas, Rakhi ke din toh special discount on 'emotional atyachar' milta hi hai!",
      color: "bg-blue-100 border-blue-300"
    },
    {
      quote: "Is Rakhi, Bhagwan se prarthna hai ki agle janam mein bhi mujhe yahi idiot bhai/behen mile.",
      color: "bg-pink-100 border-pink-300"
    },
    {
      quote: "Remote ki ladai se lekar life ke har support tak, yeh bandhan anmol hai.",
      color: "bg-purple-100 border-purple-300"
    }
  ];

export default function AlbumPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    try {
      const storedMemories = localStorage.getItem('raksha-bandhan-memories');
      if (storedMemories) {
        const parsedMemories: Memory[] = JSON.parse(storedMemories);
        const memoriesWithStyles = parsedMemories.map((mem) => ({
          ...mem,
          rotation: 0,
          scale: 1,
        }));
        setMemories(memoriesWithStyles);
  
        const isFirstCreation = localStorage.getItem('raksha-bandhan-album-created') === 'true';
        if(isFirstCreation){
          toast({
              title: "Happy Raksha Bandhan! 🎉",
              description: "Aapka khoobsurat yaadon ka album taiyaar hai.",
              duration: 5000,
          });
          confetti({
              particleCount: 150,
              spread: 180,
              origin: { y: 0.6 }
          });
          localStorage.removeItem('raksha-bandhan-album-created');
        }
  
      } else {
        router.push('/');
      }
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        router.push('/');
    }
  }, [router, toast]);

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
      toast({ title: "Yaad Update Ho Gayi!", description: "Aapki khoobsurat yaad save ho gayi hai." });
    } else {
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
          toast({ variant: "destructive", title: "AI Se Garbad", description: "Sandesh nahi ban paaya. Phir se koshish karein." });
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
      toast({ title: "Nayi Yaad Jud Gayi!", description: "Ek aur anmol pal aapke album mein jud gaya hai." });
    }
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const handleDeleteMemory = (id: string) => {
    const newMemories = memories.filter((mem) => mem.id !== id);
    setMemories(newMemories);
    toast({ variant: "destructive", title: "Yaad Mita Di Gayi", description: "Yeh yaad aapke album se hata di gayi hai." });
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const getCardStyle = (index: number, total: number) => {
    if (total === 0) return {};
    const angle = (360 / total) * index;
    const radius = Math.min(total * 50, 400); 
    const transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    const transformHover = `rotateY(${angle}deg) translateZ(${radius}px) scale(1.1)`;
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
          <div className="carousel-container my-8">
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
                    isActive={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
        
        <section className="w-full max-w-6xl mx-auto mt-20 py-12">
            <h2 className="text-3xl font-headline text-center mb-2 text-primary-foreground/90 text-shadow-custom">Aapki Yaadon Ke Kuch Pal</h2>
            <p className="text-center text-muted-foreground mb-8">Har tasveer ek kahani kehti hai. Yahan kuch dil se nikle vichar hain!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory, index) => {
                const thought = thoughtCards[index % thoughtCards.length];
                return (
                  <div key={memory.id} className="inspiration-card">
                    <Card className={`h-full ${thought.color} bg-opacity-70 backdrop-blur-sm overflow-hidden`}>
                        <CardContent className="p-4 flex flex-col">
                           <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md mb-4">
                             <Image
                                src={memory.imageUrl}
                                alt={memory.imageDescription}
                                fill
                                className="object-cover"
                                data-ai-hint={memory.dataAiHint}
                              />
                           </div>
                           <blockquote className="text-center font-headline text-base italic text-gray-700 flex-grow flex items-center justify-center">
                            <p>"{thought.quote}"</p>
                           </blockquote>
                        </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </section>

        <Footer />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0">
         <DialogTitle className="sr-only">
            {editingMemory ? 'Is Yaad Ko Badlein' : 'Ek Nayi Yaad Banayein'}
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
