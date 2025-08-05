
import React from 'react';

type FooterProps = {
  creatorName?: string;
}

const Footer = ({ creatorName = "Abhishek Kumar" }: FooterProps) => {
  return (
    <footer className="text-center py-8 mt-12">
      <p className="text-lg text-muted-foreground font-headline">
        Yeh bandhan toh pyaar ka bandhan hai 💖
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Bade pyaar se banaya hai - <span className="creator-name">{creatorName}</span> ne
      </p>
    </footer>
  );
};

export default Footer;
