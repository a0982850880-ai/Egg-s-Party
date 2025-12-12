import React, { useRef, useState } from 'react';
import { Camera, MapPin, Calendar, Star } from 'lucide-react';

const Passport: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhoto(url);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 relative transform hover:rotate-1 transition-transform duration-500">
      {/* Tape effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/80 rotate-2 z-10 shadow-sm"></div>

      <div className="bg-ac-card rounded-[40px] shadow-xl border-4 border-ac-green overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Photo */}
        <div className="bg-ac-green/20 p-8 flex flex-col items-center justify-center w-full md:w-1/2 border-b-4 md:border-b-0 md:border-r-4 border-dashed border-ac-green/30">
          <div 
            className="w-48 h-48 rounded-full bg-white border-8 border-white shadow-lg relative overflow-hidden cursor-pointer group hover:scale-105 transition-transform"
            onClick={() => fileInputRef.current?.click()}
          >
            {photo ? (
              <img src={photo} alt="Baby" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-ac-green/50">
                <Camera size={48} />
                <span className="text-sm font-bold mt-2">點擊上傳照片</span>
              </div>
            )}
            
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-bold">更換照片</span>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handlePhotoUpload}
          />
          <div className="mt-4 bg-ac-brown text-white px-6 py-2 rounded-full font-bold text-lg shadow-md transform -rotate-2">
            Nook Inc.
          </div>
        </div>

        {/* Right Side: Info */}
        <div className="p-8 w-full md:w-1/2 flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-black text-ac-brown text-center mb-2 tracking-widest">
            無人島護照
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-ac-green font-bold text-sm block mb-1">姓名 NAME</label>
              <div className="text-4xl font-black text-ac-brown border-b-2 border-ac-brown/20 pb-1">
                李洺睿 <span className="text-2xl ml-2 text-ac-brown/60">(小皮蛋)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-ac-orange" />
              <div>
                <label className="text-ac-green font-bold text-xs block">生日 BIRTHDAY</label>
                <div className="text-xl font-bold text-ac-brown">2025.01.21</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="text-yellow-400 fill-current" />
              <div>
                <label className="text-ac-green font-bold text-xs block">抓周日期 EVENT DATE</label>
                <div className="text-xl font-bold text-ac-brown">2026.01.17 (六)</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-ac-blue" />
              <div>
                <label className="text-ac-green font-bold text-xs block">島嶼 ISLAND</label>
                <div className="text-xl font-bold text-ac-brown">蛋蛋島 Egg Island</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passport;