import React from 'react';

const EggPattern: React.FC = () => {
  // Encoded SVG for a cute egg pattern
  const svgString = `
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <g fill="#F4E6B0" fill-opacity="0.6">
        <path d="M30 5 C 40 5, 45 15, 45 25 C 45 40, 38 48, 30 48 C 22 48, 15 40, 15 25 C 15 15, 20 5, 30 5 Z" transform="rotate(15, 30, 30) scale(0.6) translate(-10, -10)" />
        <path d="M30 5 C 40 5, 45 15, 45 25 C 45 40, 38 48, 30 48 C 22 48, 15 40, 15 25 C 15 15, 20 5, 30 5 Z" transform="rotate(-25, 10, 50) scale(0.4) translate(40, 40)" />
      </g>
    </svg>
  `;
  
  const encoded = encodeURIComponent(svgString);
  const dataUri = `url("data:image/svg+xml;charset=utf-8,${encoded}")`;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[-1] opacity-50"
      style={{ backgroundImage: dataUri }}
    />
  );
};

export default EggPattern;