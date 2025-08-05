import React from 'react';
import { RakhiIcon } from './icons';

const Header = () => {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center justify-center">
        <RakhiIcon className="h-12 w-12 text-primary -mr-2" />
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground text-shadow-custom select-none">
          Raksha Bandhan ki Yaadein
        </h1>
        <RakhiIcon className="h-12 w-12 text-primary -ml-2" />
      </div>
      <p className="mt-4 text-lg text-muted-foreground font-body">
        Remote ki ladai se lekar Maggi ki aakhri bite tak ka safar.
      </p>
    </header>
  );
};

export default Header;
