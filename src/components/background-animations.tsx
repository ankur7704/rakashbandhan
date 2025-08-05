'use client';
import React, { useEffect, useState } from 'react';
import { HeartIcon, DiyaIcon, RakhiIcon } from './icons';

const ICONS = [
  { Icon: HeartIcon, color: 'text-primary' },
  { Icon: DiyaIcon, color: 'text-accent' },
  { Icon: RakhiIcon, color: 'text-secondary-foreground' },
];

const BackgroundAnimations = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }).map((_, i) => {
        const { Icon, color } = ICONS[Math.floor(Math.random() * ICONS.length)];
        return {
          id: i,
          Icon,
          color,
          style: {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${15 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * 25}s`,
            transform: `scale(${0.5 + Math.random()})`,
          },
          size: Math.random() > 0.5 ? 'h-8 w-8' : 'h-12 w-12',
        };
      });
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {particles.map(({ id, Icon, color, style, size }) => (
        <div key={id} className="particle floating" style={style}>
          <Icon className={`${size} ${color} opacity-30`} />
        </div>
      ))}
    </div>
  );
};

export default BackgroundAnimations;
