'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Memory } from '@/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import BackgroundAnimations from '@/components/background-animations';
import MemoryCard from '@/components/memory-card';
import MemoryForm from '@/components/memory-form';
import ImageGenerator from '@/components/image-generator';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';


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
  const [isImageGeneratorOpen, setIsImageGeneratorOpen] = useState(false);
  const [selectedMemoryForImage, setSelectedMemoryForImage] = useState<Memory | null>(null);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const memoriesByYear = memories.reduce((acc, memory) => {
    const year = memory.year || "Purani Yaadein";
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(memory);
    return acc;
  }, {} as Record<string, Memory[]>);

  const sortedYears = Object.keys(memoriesByYear).sort((a, b) => parseInt(b) - parseInt(a));


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
              particleCount: 200,
              spread: 180,
              origin: { y: 0.6 },
              scalar: 1.2
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

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'style') {
                const target = mutation.target as HTMLElement;
                const rotationMatch = /rotateY\(([^d]+)deg\)/.exec(target.style.transform);
                if (rotationMatch) {
                    let rotation = parseFloat(rotationMatch[1]);
                    rotation = (rotation % 360 + 360) % 360; // Normalize to 0-360
                    if (rotation > 90 && rotation < 270) {
                        target.classList.add('is-back');
                    } else {
                        target.classList.remove('is-back');
                    }
                }
            }
        });
    });

    const cards = carousel.querySelectorAll('.carousel-card');
    cards.forEach(card => {
        observer.observe(card, { attributes: true, attributeFilter: ['style'] });
    });

    return () => observer.disconnect();
  }, [memories]);


  const handleOpenModal = (memory: Memory | null) => {
    setEditingMemory(memory);
    setIsModalOpen(true);
  };

  const handleOpenImageGenerator = (memory: Memory) => {
    setSelectedMemoryForImage(memory);
    setIsImageGeneratorOpen(true);
  };
  
  const handleSaveMemory = async (formData: {
    imageFile?: File;
    imageDescription: string;
    wish: string;
    year: string;
    imagePreview?: string;
  }) => {
    let imageUrl = formData.imagePreview;
  
    if (editingMemory) {
       const updatedMemories = memories.map((mem) =>
          mem.id === editingMemory.id
            ? {
                ...mem,
                imageDescription: formData.imageDescription,
                wish: formData.wish,
                year: formData.year,
                imageUrl: imageUrl || mem.imageUrl,
                dataAiHint: formData.imageDescription.split(' ').slice(0,2).join(' ')
              }
            : mem
        );
      setMemories(updatedMemories);
      localStorage.setItem('raksha-bandhan-memories', JSON.stringify(updatedMemories));
      toast({ title: "Yaad Update Ho Gayi!", description: "Aapki khoobsurat yaad save ho gayi hai." });
    }
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const handleDeleteMemory = (id: string) => {
    const newMemories = memories.filter((mem) => mem.id !== id);
    setMemories(newMemories);
    localStorage.setItem('raksha-bandhan-memories', JSON.stringify(newMemories));
    toast({ variant: "destructive", title: "Yaad Mita Di Gayi", description: "Yeh yaad aapke album se hata di gayi hai." });
    setIsModalOpen(false);
    setEditingMemory(null);
  };

  const getCardStyle = (index: number, total: number) => {
    if (total === 0) return {};
    const angle = (360 / total) * index;
    const radius = Math.min(window.innerWidth / 2.5, 450); 
    const transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    const transformHover = `rotateY(${angle}deg) translateZ(${radius}px) scale(1.1)`;
    return {
      transform,
      '--transform-hover': transformHover,
    };
  };

  const toggleMusic = () => {
    if (audioRef.current) {
        if (isMusicPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsMusicPlaying(!isMusicPlaying);
    }
  };

  if (!memories.length) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <audio ref={audioRef} loop>
          <source src="/placeholder-music.mp3" type="audio/mpeg" />
          Aapka browser audio element ko support nahi karta.
      </audio>
      <BackgroundAnimations />
      <div className="relative z-10 flex min-h-screen flex-col pt-8">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="carousel-container my-12 w-full h-[350px]">
            <div className="carousel" ref={carouselRef}>
              {memories.map((memory, index) => (
                <div
                  key={memory.id}
                  className={cn("carousel-card")}
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
        
        <section className="w-full max-w-6xl mx-auto mt-16 py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-headline text-center mb-12 text-primary-foreground/90 text-shadow-custom">Samay Ki Yaadein</h2>
            <div className="memory-bus-container">
              <div className="memory-bus-aisle"></div>
              {sortedYears.map((year) => (
                <div key={year} className="memory-bus-year-group">
                  <div className="memory-bus-year-marker">{year}</div>
                  <div className="memory-bus-seats">
                    {memoriesByYear[year].map((memory, memoryIndex) => (
                      <div key={memory.id} className="memory-bus-seat">
                        <Card className="group bg-white/70 backdrop-blur-sm overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full">
                          <CardContent className="p-4">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md mb-4">
                              <Image
                                src={memory.imageUrl}
                                alt={memory.imageDescription}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={memory.dataAiHint}
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Button variant="secondary" onClick={() => handleOpenImageGenerator(memory)}>
                                  <Sparkles className="mr-2"/>
                                  Magic Moment Banayein
                                </Button>
                              </div>
                            </div>
                            <h3 className="font-headline text-lg text-primary-foreground/90">{memory.imageDescription}</h3>
                            <p className="text-sm text-muted-foreground mt-2 italic">"{memory.wish || thoughtCards[memoryIndex % thoughtCards.length].quote}"</p>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        <Footer />
        <div className="fixed bottom-5 right-5 z-20">
            <Button onClick={toggleMusic} variant="outline" size="icon" className="rounded-full shadow-lg">
                {isMusicPlaying ? <Volume2 /> : <VolumeX />}
                <span className="sr-only">Music On/Off</span>
            </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl p-0">
         <DialogTitle className="sr-only">
            {editingMemory ? 'Is Yaad Ko Badlein' : 'Ek Nayi Yaad Banayein'}
          </DialogTitle>
          <MemoryForm
            memoryToEdit={editingMemory}
            onSave={handleSaveMemory}
            onDelete={editingMemory ? () => handleDeleteMemory(editingMemory!.id) : undefined}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isImageGeneratorOpen} onOpenChange={setIsImageGeneratorOpen}>
          <DialogContent className="max-w-md p-0">
              <DialogTitle className="sr-only">Image Generator</DialogTitle>
              {selectedMemoryForImage && <ImageGenerator memory={selectedMemoryForImage} onClose={() => setIsImageGeneratorOpen(false)} />}
          </DialogContent>
      </Dialog>
    </>
  );
}
