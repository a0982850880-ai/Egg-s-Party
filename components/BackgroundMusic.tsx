import React, { useRef, useState } from 'react';
import { Music, Volume2, VolumeX, Upload } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSource, setHasSource] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setHasSource(true);
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border-2 border-ac-brown/20 flex items-center gap-2">
        {/* Play/Pause Button */}
        <button 
          onClick={togglePlay}
          disabled={!hasSource}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-white transition-all
            ${hasSource 
              ? 'bg-ac-green hover:scale-110 shadow' 
              : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Upload Button */}
        <button 
          onClick={() => inputRef.current?.click()}
          className="w-10 h-10 bg-ac-orange rounded-full flex items-center justify-center text-white hover:scale-110 shadow transition-all"
          title="匯入音樂"
        >
          {hasSource ? <Music size={20} className="animate-spin-slow" /> : <Upload size={20} />}
        </button>
      </div>

      <input 
        type="file" 
        ref={inputRef} 
        accept="audio/*" 
        className="hidden" 
        onChange={handleUpload}
      />
      
      {!hasSource && (
        <div className="bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-ac-brown shadow-sm animate-bounce">
          ⬆️ 點此匯入背景音樂
        </div>
      )}

      <audio ref={audioRef} loop className="hidden" />
    </div>
  );
};

export default BackgroundMusic;