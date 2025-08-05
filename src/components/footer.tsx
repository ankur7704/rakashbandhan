
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

type FooterProps = {
  creatorName?: string;
}

const Footer = ({ creatorName = "Abhishek Kumar" }: FooterProps) => {
  return (
    <footer className="w-full max-w-2xl mx-auto text-center py-8 mt-12 px-4">
       <div className="footer-greeting-card">
        <Card className="bg-primary/20 border-primary/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-center mb-4">
                <Heart className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-base md:text-lg text-primary-foreground/90 font-headline">
              Yeh bandhan toh pyaar ka bandhan hai
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Bade pyaar se banaya hai - <span className="creator-name">{creatorName}</span> ne
            </p>
            <hr className="my-4 border-primary/30" />
            <p className="text-xs text-muted-foreground/80 italic">
              Abhishek Kumar ki ore se sabhi pyaari behno ko Raksha Bandhan 2025 ki dher saari shubhkaamnayein!
            </p>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
};

export default Footer;
