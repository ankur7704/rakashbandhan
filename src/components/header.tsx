import React from 'react';
import { RakhiIcon } from './icons';

const Header = () => {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center justify-center">
        <RakhiIcon className="h-12 w-12 text-primary -mr-2" />
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary-foreground text-shadow-custom select-none">
          Happy Raksha Bandhan
        </h1>
        <RakhiIcon className="h-12 w-12 text-primary -ml-2" />
      </div>
      <p className="mt-4 text-lg text-muted-foreground font-body">
        A digital album celebrating the timeless bond of siblings.
      </p>
    </header>
  );
};

export default Header;
