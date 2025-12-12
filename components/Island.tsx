import React from 'react';
import { Attendee } from '../types';
import { AVATARS, COLORS } from './AvatarSelector';

interface Props {
  attendees: Attendee[];
}

const Island: React.FC<Props> = ({ attendees }) => {
  const attendingList = attendees.filter(a => a.status === 'attending');
  const declinedList = attendees.filter(a => a.status === 'declined');

  const renderCharacter = (person: Attendee, isSmall: boolean = false) => {
    const avatarEmoji = AVATARS[person.avatarIndex] || "🙂";
    const bgColor = COLORS[person.avatarIndex % COLORS.length];
    
    // Scale down characters for the small island
    const sizeClass = isSmall 
      ? "w-12 h-12 text-2xl" 
      : "w-16 h-16 md:w-20 md:h-20 text-4xl md:text-5xl";
    
    const bodyClass = isSmall
      ? "w-6 h-8 -mt-1"
      : "w-8 h-10 -mt-2";

    return (
      <div 
        key={person.id} 
        className="flex flex-col items-center animate-bounce"
        style={{ animationDuration: `${2 + Math.random()}s` }}
      >
        {/* Character Head */}
        <div className={`
          ${sizeClass} rounded-full border-4 border-white shadow-md flex items-center justify-center
          ${bgColor} z-10 relative
        `}>
          {avatarEmoji}
        </div>
        
        {/* Character Body */}
        <div className={`${bodyClass} bg-ac-brown rounded-b-xl z-0 relative`}>
          {!isSmall && <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs opacity-50 text-white">👕</div>}
        </div>

        {/* Name Tag */}
        <div className="bg-white/90 px-2 py-0.5 rounded-full text-xs font-bold text-ac-brown shadow-sm -mt-1 z-20 whitespace-nowrap">
          {person.nickname || person.name}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative overflow-hidden mt-12 rounded-t-[50px] border-t-8 border-ac-blue/30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      
      {/* Sky */}
      <div className="bg-gradient-to-b from-blue-300 to-blue-100 h-48 w-full relative">
        <div className="absolute top-8 left-10 text-white/80 animate-pulse">☁️</div>
        <div className="absolute top-16 right-20 text-white/80 animate-pulse delay-700">☁️</div>
        {/* Sun */}
        <div className="absolute top-6 right-10 w-16 h-16 bg-yellow-300 rounded-full opacity-80 animate-pulse shadow-[0_0_40px_rgba(253,224,71,0.6)]"></div>
      </div>

      {/* Ocean */}
      <div className="bg-[#4DB4D7] pt-8 pb-32 relative min-h-[600px] flex flex-col items-center gap-16">
        
        {/* --- MAIN ISLAND (Attending) --- */}
        <div className="w-[90%] md:w-[80%] bg-[#95C564] rounded-[60px] border-b-8 border-[#7AA550] min-h-[300px] relative p-8 shadow-xl z-20">
           {/* Island Label */}
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#5D4037] text-[#FDF6D6] px-6 py-2 rounded-full font-black tracking-widest border-2 border-[#FDF6D6] shadow-lg">
             🥚 蛋蛋島
           </div>

           {/* Decor */}
           <div className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl opacity-10 select-none pointer-events-none">🏝️</div>
           <div className="absolute bottom-10 left-10 w-4 h-4 rounded-full bg-[#7AA550]/40"></div>
           <div className="absolute top-20 right-20 w-6 h-6 rounded-full bg-[#7AA550]/40"></div>

           {/* Characters */}
           <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10 mt-8">
              {attendingList.length === 0 ? (
                <div className="text-center text-white font-bold opacity-60 py-10">
                  目前還沒有島民入住... <br/>快選擇「準時登島」加入我們！
                </div>
              ) : (
                attendingList.map(p => renderCharacter(p, false))
              )}
           </div>
        </div>

        {/* --- SECONDARY ISLAND (Declined/Adventure) --- */}
        {/* Render this even if empty to show the concept, or conditionally if you prefer. Showing it makes the world feel bigger. */}
        <div className="w-[70%] md:w-[60%] bg-[#E6B95F] rounded-[40px] border-b-8 border-[#C69C45] min-h-[200px] relative p-6 shadow-xl z-10 opacity-90 transform scale-95">
           {/* Island Label */}
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C69C45] text-white px-4 py-1 rounded-full font-bold text-sm tracking-widest border-2 border-[#FDF6D6] shadow-md">
             🗺️ 冒險島
           </div>

           {/* Decor */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-10 select-none pointer-events-none">⛺</div>
           <div className="absolute top-4 left-8 text-2xl opacity-50">🌴</div>
           <div className="absolute bottom-4 right-8 text-2xl opacity-50">🌵</div>

           {/* Characters */}
           <div className="flex flex-wrap justify-center items-end gap-4 mt-6">
              {declinedList.length === 0 ? (
                <div className="text-center text-white/60 font-bold text-sm py-8">
                  目前大家都在蛋蛋島集合中...
                </div>
              ) : (
                declinedList.map(p => renderCharacter(p, true))
              )}
           </div>
        </div>
        
        {/* Waves decorations */}
        <div className="absolute top-1/3 left-4 text-white/30 text-2xl animate-pulse">〰️</div>
        <div className="absolute bottom-20 right-10 text-white/30 text-2xl animate-pulse delay-300">〰️</div>
        <div className="absolute bottom-40 left-20 text-white/30 text-xl animate-pulse delay-500">🐟</div>
      </div>
    </div>
  );
};

export default Island;