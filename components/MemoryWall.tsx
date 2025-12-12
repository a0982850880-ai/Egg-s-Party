import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Info } from 'lucide-react';
import { MemoryPhoto } from '../types';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { compressImage } from '../utils/compress';

interface Props {
  photos: MemoryPhoto[];
}

const MemoryWall: React.FC<Props> = ({ photos }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProcessing(true);
      setUploadStatus('正在壓縮圖片...');
      
      const file = e.target.files[0];
      
      try {
        // 1. Compress (Client side)
        const compressedBase64 = await compressImage(file);
        
        // Convert Base64 back to Blob for Firebase Upload
        const res = await fetch(compressedBase64);
        const blob = await res.blob();

        setUploadStatus('正在上傳至 Firebase...');

        // 2. Upload to Firebase Storage
        const fileName = `memories/${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        // 3. Save Metadata to Firestore
        setUploadStatus('儲存資料中...');
        await addDoc(collection(db, "photos"), {
          url: downloadUrl,
          caption: '美好回憶',
          createdAt: Date.now(),
          storagePath: fileName
        });

        setUploadStatus('上傳成功！');
        
      } catch (error: any) {
        console.error(error);
        if (error.code === 'storage/unauthorized') {
            alert("上傳失敗：權限不足。請檢查 Firebase Storage Rules 是否設為測試模式。");
        } else {
            alert("上傳失敗，請稍後再試。");
        }
      } finally {
        setProcessing(false);
        setUploadStatus('');
        if (inputRef.current) inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-6 md:p-8 border-4 border-white shadow-lg my-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
           <h3 className="text-2xl font-black text-ac-brown flex items-center gap-2">
             <span className="text-3xl">📸</span> 蛋蛋的回憶牆
           </h3>
           <p className="text-xs text-ac-brown/60 flex items-center gap-1 mt-1">
             <Info size={14}/> 上傳的照片將存放於 Firebase 雲端
           </p>
        </div>
        
        <button 
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="bg-ac-blue text-white font-bold px-4 py-2 rounded-full hover:bg-sky-400 transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {processing ? <Loader2 className="animate-spin" size={20} /> : <ImagePlus size={20} />}
          {processing ? '上傳中' : '分享照片'}
        </button>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={inputRef} 
          onChange={handleUpload} 
        />
      </div>
      
      {processing && (
        <div className="mb-4 text-center text-ac-blue font-bold text-sm animate-pulse">
           {uploadStatus}
        </div>
      )}

      {photos.length === 0 ? (
        <div className="border-4 border-dashed border-ac-brown/20 rounded-3xl h-40 flex items-center justify-center text-ac-brown/50 font-bold">
          目前還沒有照片，快來搶頭香！
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.id} className="bg-white p-3 rounded-2xl shadow-sm border border-ac-brown/10 flex flex-col gap-2 relative group hover:scale-[1.02] transition-transform duration-300">
               <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-ac-brown/5 bg-gray-100">
                 <img 
                   src={photo.url} 
                   alt="Memory" 
                   loading="lazy"
                   className="w-full h-full object-cover" 
                 />
               </div>
               <div className="px-1 py-1">
                 <p className="text-sm font-bold text-ac-brown text-center truncate">{photo.caption}</p>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryWall;