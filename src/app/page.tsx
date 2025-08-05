
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Memory } from '@/types';
import Header from '@/components/header';
import Footer from '@/components/footer';
import BackgroundAnimations from '@/components/background-animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, ImagePlus, ArrowRight, Sparkles, Heart, Gift, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SweetsIcon, BrotherSisterIcon, RakhiIcon } from '@/components/icons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type MemoryInput = Omit<Memory, 'id' | 'rotation' | 'scale'> & {
  id: number;
  imageFile?: File;
};

const inspirationCards = [
  {
    icon: BrotherSisterIcon,
    title: "Nok-Jhonk Express",
    text: "Tom & Jerry jaisi hai apni jodi, par Rakhi ke din no jhagda, only pyaar thodi thodi!",
    color: "bg-secondary/20 border-secondary"
  },
  {
    icon: SweetsIcon,
    title: "Mithai ki Rishwat",
    text: "Is Rakhi, bas ek promise: meri chocolate pe nazar mat dalna. Deal? Happy Raksha Bandhan!",
    color: "bg-accent/20 border-accent"
  },
  {
    icon: RakhiIcon,
    title: "Bhavnao ka Atyachar",
    text: "Duriyaan bhale hi ho, par apna connection bina lag wala wifi hai. Yaad aati hai, bhai!",
    color: "bg-primary/20 border-primary"
  },
    {
    icon: Gift,
    title: "Uphaar ki Chinta",
    text: "Gift? Vo sab chodo, bas ye yaad rakhna ki remote aaj mera hai. Happy Rakhi!",
    color: "bg-blue-100 border-blue-300"
  },
   {
    icon: Heart,
    title: "Dil Se",
    text: "Duniya ka sabse anmol bandhan. Tere jaisa bhai/behen kismat walon ko milta hai.",
    color: "bg-pink-100 border-pink-300"
  },
   {
    icon: Sparkles,
    title: "Raazdaar",
    text: "Mere saare secrets ka vault hai tu. Is Rakhi, chalo aur yaadein banayein chhupane ke liye!",
    color: "bg-purple-100 border-purple-300"
  }
];

export default function CreateAlbumPage() {
  const [creatorName, setCreatorName] = useState('');
  const [siblingName, setSiblingName] = useState('');
  const [creatorGender, setCreatorGender] = useState('');

  const [memories, setMemories] = useState<MemoryInput[]>([
    {
      id: 1,
      imageUrl: 'https://placehold.co/600x400.png',
      imageDescription: 'Ek bhai aur behen haste hue.',
      wish: '',
      year: new Date().getFullYear().toString(),
      dataAiHint: 'siblings laughing'
    },
  ]);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddMemoryField = () => {
    setMemories([
      ...memories,
      {
        id: Date.now(),
        imageUrl: 'https://placehold.co/600x400.png',
        imageDescription: '',
        wish: '',
        year: new Date().getFullYear().toString(),
        dataAiHint: ''
      },
    ]);
  };

  const handleRemoveMemoryField = (id: number) => {
    if (memories.length <= 1) {
      toast({
        variant: 'destructive',
        title: 'Hata nahi sakte',
        description: 'Kam se kam ek yaad honi chahiye.',
      });
      return;
    }
    setMemories(memories.filter((mem) => mem.id !== id));
  };

  const handleInputChange = (
    id: number,
    field: 'imageDescription' | 'wish' | 'year',
    value: string
  ) => {
    setMemories(
      memories.map((mem) =>
        mem.id === id ? { ...mem, [field]: value } : mem
      )
    );
  };

  const handleImageChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemories(
          memories.map((mem) =>
            mem.id === id
              ? {
                  ...mem,
                  imageFile: file,
                  imageUrl: reader.result as string,
                }
              : mem
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!creatorName || !siblingName || !creatorGender) {
        toast({
            variant: "destructive",
            title: "Poori Jaankari Dein!",
            description: "Kripya apna naam, bhai/behen ka naam aur apna gender chunein."
        });
        return;
    }

    if (memories.some(mem => !mem.imageDescription || !mem.year)) {
        toast({
            variant: "destructive",
            title: "Adhuri Yaadein",
            description: "Kripya har yaad ke liye vivaran aur saal dein."
        });
        return;
    }

    const memoriesForAlbum = memories.map((mem, index) => ({
      id: `${index + 1}`,
      imageUrl: mem.imageUrl,
      imageDescription: mem.imageDescription,
      wish: mem.wish,
      year: mem.year,
      rotation: 0,
      scale: 1,
      dataAiHint: mem.imageDescription.split(' ').slice(0, 2).join(' '),
    }));

    const albumInfo = { creatorName, siblingName, creatorGender };
    localStorage.setItem('raksha-bandhan-album-info', JSON.stringify(albumInfo));
    localStorage.setItem('raksha-bandhan-memories', JSON.stringify(memoriesForAlbum));
    localStorage.setItem('raksha-bandhan-album-created', 'true');

    router.push('/album');
  };

  return (
    <>
      <BackgroundAnimations />
      <div className="relative z-10 flex min-h-screen flex-col px-4 pt-8 sm:px-6 lg:px-8">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center">
          <Card className="w-full max-w-4xl bg-card/80 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-center text-primary-foreground/90">
                Apna Digital Rakhi Album Banaayein
              </CardTitle>
               <CardDescription className="text-center text-muted-foreground pt-2">
                Pyaar bhari yaadon ka ek sangrah, sirf aapke liye.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <div className="space-y-6 border-b border-border/50 pb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                          <Label htmlFor="creator-name" className="text-base font-medium flex items-center gap-2">
                            <User className="h-5 w-5 text-primary"/> Aapka Naam
                          </Label>
                          <Input 
                              id="creator-name" 
                              placeholder="Aapka poora naam"
                              value={creatorName}
                              onChange={(e) => setCreatorName(e.target.value)}
                              className="mt-2"
                          />
                      </div>
                      <div>
                          <Label htmlFor="sibling-name" className="text-base font-medium flex items-center gap-2">
                             <Users className="h-5 w-5 text-primary"/> Aapke Bhai/Behen ke Naam
                          </Label>
                          <Input 
                              id="sibling-name" 
                              placeholder="Priya, Riya... ya Rahul, Rohit..."
                              value={siblingName}
                              onChange={(e) => setSiblingName(e.target.value)}
                              className="mt-2"
                          />
                      </div>
                    </div>
                    <div>
                       <Label className="text-base font-medium">Aapka Gender</Label>
                       <RadioGroup
                          onValueChange={setCreatorGender}
                          value={creatorGender}
                          className="flex items-center gap-6 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male" className="text-base">Ladka</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="text-base">Ladki</Label>
                          </div>
                        </RadioGroup>
                    </div>
                </div>

              {memories.map((memory, index) => (
                <div
                  key={memory.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-border/50 pb-6 relative"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 aspect-square rounded-lg overflow-hidden shadow-md">
                       <Image
                        src={memory.imageUrl}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                     <input
                      type="file"
                      id={`file-${memory.id}`}
                      accept="image/*"
                      onChange={(e) => handleImageChange(memory.id, e)}
                      className="hidden"
                    />
                    <Button asChild variant="outline" size="sm" className="mt-2">
                       <label htmlFor={`file-${memory.id}`} className="cursor-pointer">
                          <ImagePlus className="mr-2 h-4 w-4" /> Photo Badlein
                       </label>
                    </Button>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor={`year-${memory.id}`}>
                        Yaad ka Saal
                      </Label>
                      <Input
                        id={`year-${memory.id}`}
                        type="number"
                        placeholder="Jaise, 2015"
                        value={memory.year}
                        onChange={(e) =>
                          handleInputChange(
                            memory.id,
                            'year',
                            e.target.value
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                     <div>
                      <Label htmlFor={`description-${memory.id}`}>
                        Us pal ko bayaan karein
                      </Label>
                      <Textarea
                        id={`description-${memory.id}`}
                        placeholder="Jaise, naye ghar mein hamara pehla Rakhi ka tyohaar."
                        value={memory.imageDescription}
                        onChange={(e) =>
                          handleInputChange(
                            memory.id,
                            'imageDescription',
                            e.target.value
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`wish-${memory.id}`}>
                        Ek khaas sandesh likhein (vaikalpik)
                      </Label>
                      <Input
                        id={`wish-${memory.id}`}
                        placeholder="Jaise, Pyaari behen, Rakhi ki dher saari shubhkaamnayein!"
                        value={memory.wish}
                        onChange={(e) =>
                          handleInputChange(memory.id, 'wish', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                   {memories.length > 1 && (
                     <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveMemoryField(memory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handleAddMemoryField}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Ek Aur Yaad Jodein
                </Button>
                <Button onClick={handleSubmit} size="lg">
                  Album Banaayein <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <section className="w-full max-w-5xl mx-auto mt-20 py-12">
            <h2 className="text-3xl font-headline text-center mb-2 text-primary-foreground/90 text-shadow-custom">Kuch Khatti Meethi Yaadein</h2>
            <p className="text-center text-muted-foreground mb-8">Thodi prerna chahiye? Aapke sandeshon ke liye kuch mazedaar vichaar!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirationCards.map((card, index) => (
                <div key={index} className="inspiration-card">
                  <Card className={`h-full ${card.color} bg-opacity-70 backdrop-blur-sm overflow-hidden`}>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="p-4 bg-white/50 rounded-full mb-4">
                        <card.icon className="w-8 h-8 text-primary-foreground/70" />
                      </div>
                      <h3 className="text-lg font-headline font-semibold text-primary-foreground">{card.title}</h3>
                      <p className="mt-2 text-sm text-foreground/80">{card.text}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>

        </main>
        <Footer />
      </div>
    </>
  );
}
