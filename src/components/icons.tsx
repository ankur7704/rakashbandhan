import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const RakhiIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.5" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m4.93 19.07 1.41-1.41" />
    <path d="m17.66 6.34 1.41-1.41" />
    <path d="M2 12A10 10 0 0 0 12 22a10 10 0 0 0 10-10" strokeDasharray="4 4" strokeWidth="1" />
    <path d="M22 12a10 10 0 0 0-10-10A10 10 0 0 0 2 12" strokeDasharray="4 4" strokeWidth="1" />
  </svg>
);

export const HeartIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const DiyaIcon = (props: IconProps) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a4 4 0 0 0-4 4c0 1.5.67 2.83 1.67 3.67A6 6 0 0 0 12 11a6 6 0 0 0 2.33-1.33C15.33 8.83 16 7.5 16 6a4 4 0 0 0-4-4z" fill="currentColor" opacity="0.7" />
    <path d="M4 15s1-2 8-2 8 2 8 2H4z" />
    <path d="M4 18h16" />
  </svg>
);

export const SweetsIcon = (props: IconProps) => (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );

export const BrotherSisterIcon = (props: IconProps) => (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 20.5v-7.5a2.5 2.5 0 0 1 5 0v7.5" />
      <circle cx="12.5" cy="4.5" r="2.5" />
      <path d="M8 20.5v-4.5a.5.5 0 0 1 1 0v4.5" />
      <path d="M16 20.5v-4.5a.5.5 0 0 0-1 0v4.5" />
      <circle cx="7.5" cy="7.5" r="2.5" />
      <path d="M5.5 16v-3a2 2 0 0 1 4 0v3" />
    </svg>
  );
