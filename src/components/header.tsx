import React from 'react';
import { RakhiIcon } from './icons';

type HeaderProps = {
  siblingName?: string;
  creatorGender?: string;
};

const Header = ({ siblingName, creatorGender }: HeaderProps) => {

  const getGreeting = () => {
    if (!siblingName || !creatorGender) {
      return "Raksha Bandhan ki Yaadein";
    }

    const hasMultipleSiblings = siblingName.includes(',');

    if (creatorGender === 'male') {
      if (hasMultipleSiblings) {
        return `Raksha Bandhan ki Badhai ho, Pyaari Behno!`;
      }
      return `Raksha Bandhan ki Badhai ho, Pyaari Behen ${siblingName}!`;
    }
    
    if (creatorGender === 'female') {
      if (hasMultipleSiblings) {
        return `Raksha Bandhan ki Badhai ho, Pyaare Bhaiyon!`;
      }
      return `Raksha Bandhan ki Badhai ho, Pyaare Bhai ${siblingName}!`;
    }
    
    return "Raksha Bandhan ki Yaadein";
  };

  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center justify-center">
        <RakhiIcon className="h-12 w-12 text-primary -mr-2" />
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary-foreground text-shadow-custom select-none">
          {getGreeting()}
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
