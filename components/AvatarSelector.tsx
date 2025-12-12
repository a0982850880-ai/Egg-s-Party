import React from 'react';

interface Props {
  selected: number;
  onSelect: (index: number) => void;
}

// Strictly front-facing, cute animal faces
const AVATARS = [
  "🐱", "🐶", "🐰", "🐻", "🐼", "🐨", 
  "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", 
  "🐔", "🐧", "🐤", "🐹", "🐭", "🦊"
];

const COLORS = [
  "bg-red-200", "bg-orange-200", "bg-amber-200", "bg-yellow-200", "bg-lime-200", "bg-green-200",
  "bg-emerald-200", "bg-teal-200", "bg-cyan-200", "bg-sky-200", "bg-blue-200", "bg-indigo-200",
  "bg-violet-200", "bg-purple-200", "bg-fuchsia-200", "bg-pink-200", "bg-rose-200", "bg-stone-200"
];

const AvatarSelector: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-6 gap-2 md:gap-3 p-4 bg-ac-card rounded-3xl border-2 border-ac-brown/10">
      {AVATARS.map((emoji, index) => {
         const bgColor = COLORS[index % COLORS.length];
         const isSelected = selected === index;
         
         return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={`
              aspect-square rounded-full flex items-center justify-center text-2xl md:text-3xl
              transition-all duration-200 border-4
              ${bgColor}
              ${isSelected 
                ? 'border-ac-blue scale-110 shadow-lg' 
                : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'}
            `}
          >
            {emoji}
          </button>
         );
      })}
    </div>
  );
};

export default AvatarSelector;
export { AVATARS, COLORS };