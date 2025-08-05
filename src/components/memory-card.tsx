import React from 'react';
import type { Memory } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Pin } from 'lucide-react';

type MemoryCardProps = {
  memory: Memory;
  isActive: boolean;
  onClick?: () => void;
};

const MemoryCard = ({ memory, isActive, onClick }: MemoryCardProps) => {
  return (
    <div
      className={cn("group relative h-full transition-all duration-300", isActive ? "cursor-pointer" : "cursor-default")}
      onClick={onClick}
    >
      <Card
        className={cn("overflow-hidden bg-white/80 backdrop-blur-sm p-2 pb-4 shadow-lg transition-all duration-300 ease-in-out h-full flex flex-col", isActive ? "shadow-2xl scale-100" : "shadow-lg scale-95 opacity-80" )}
      >
        <Pin className="absolute -top-3 -right-2 h-8 w-8 text-accent/70 -rotate-12 transform-gpu transition-transform group-hover:rotate-0 group-hover:scale-110" />
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={memory.imageUrl}
              alt={memory.imageDescription}
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={memory.dataAiHint}
            />
          </div>
          <blockquote className="mt-4 px-2 text-center font-headline text-base italic text-gray-700 border-l-4 border-primary/50 pl-4 flex-grow flex items-center justify-center">
            <p className="line-clamp-4">{memory.wish || memory.imageDescription}</p>
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryCard;
