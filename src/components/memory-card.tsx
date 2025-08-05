import React from 'react';
import type { Memory } from '@/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Pin } from 'lucide-react';

type MemoryCardProps = {
  memory: Memory;
  onClick: () => void;
};

const MemoryCard = ({ memory, onClick }: MemoryCardProps) => {
  return (
    <div
      className="group relative cursor-pointer"
      style={{
        transform: `rotate(${memory.rotation}deg)`,
      }}
      onClick={onClick}
    >
      <Card
        className="overflow-hidden bg-white p-2 pb-4 shadow-lg transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:scale-105"
      >
        <Pin className="absolute -top-3 -right-2 h-8 w-8 text-accent/70 -rotate-12 transform-gpu transition-transform group-hover:rotate-0 group-hover:scale-110" />
        <CardContent className="p-0">
          <div className="relative aspect-square w-full">
            <Image
              src={memory.imageUrl}
              alt={memory.imageDescription}
              fill
              className="object-cover rounded-sm"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={memory.dataAiHint}
            />
          </div>
          <blockquote className="mt-4 px-2 text-center font-headline text-base italic text-gray-700 border-l-4 border-primary/50 pl-4">
            <p className="line-clamp-3">{memory.wish}</p>
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryCard;
