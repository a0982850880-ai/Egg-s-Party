import React from 'react';
import { Trash2, ArrowLeft } from 'lucide-react';
import { Attendee, MemoryPhoto } from '../types';
import { AVATARS } from './AvatarSelector';
import { db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

interface Props {
  attendees: Attendee[];
  photos: MemoryPhoto[];
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ attendees, photos, onBack }) => {
  const attendingCount = attendees.filter(a => a.status === 'attending').length;
  const declinedCount = attendees.filter(a => a.status === 'declined').length;

  const handleDeleteAttendee = async (id: string) => {
    if (confirm("確定要刪除這位訪客嗎？")) {
      try {
        await deleteDoc(doc(db, "attendees", id));
      } catch (error) {
        alert("刪除失敗");
        console.error(error);
      }
    }
  };

  const handleDeletePhoto = async (photo: MemoryPhoto) => {
     if (confirm("確定要刪除這張照片嗎？")) {
       try {
         // 1. Delete from Storage (if path exists)
         if (photo.url.includes("firebasestorage")) {
            // Extract path or use saved path if you stored it. 
            // For simplicity, we just delete the document reference first in this MVP.
            // Ideally: const imgRef = ref(storage, photo.storagePath); await deleteObject(imgRef);
         }
         
         // 2. Delete from Firestore
         await deleteDoc(doc(db, "photos", photo.id));
       } catch (error) {
         alert("刪除失敗");
         console.error(error);
       }
     }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">🏝️ 島務所後台 (Firebase)</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-ac-green">
            <h3 className="text-gray-500 font-bold mb-1">準時登島 (出席)</h3>
            <p className="text-4xl font-black text-ac-green">{attendingCount} <span className="text-sm text-gray-400">人</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-ac-orange">
            <h3 className="text-gray-500 font-bold mb-1">冒險去 (請假)</h3>
            <p className="text-4xl font-black text-ac-orange">{declinedCount} <span className="text-sm text-gray-400">人</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-ac-blue">
            <h3 className="text-gray-500 font-bold mb-1">雲端照片</h3>
            <p className="text-4xl font-black text-ac-blue">{photos.length} <span className="text-sm text-gray-400">張</span></p>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">📋 島民名單</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold">
                <tr>
                  <th className="p-4">狀態</th>
                  <th className="p-4">頭像</th>
                  <th className="p-4">姓名 / 暱稱</th>
                  <th className="p-4">留言</th>
                  <th className="p-4">管理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendees.map(guest => (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${guest.status === 'attending' ? 'bg-ac-green' : 'bg-ac-orange'}`}>
                        {guest.status === 'attending' ? '出席' : '請假'}
                      </span>
                    </td>
                    <td className="p-4 text-2xl">{AVATARS[guest.avatarIndex]}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{guest.name}</div>
                      <div className="text-sm text-gray-400">{guest.nickname}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate text-gray-600">
                      {guest.isSignature ? '[手寫簽名]' : guest.message}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleDeleteAttendee(guest.id)}
                        className="text-gray-300 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Photo Manager */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <h2 className="text-xl font-bold text-gray-800">🖼️ 雲端照片牆</h2>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={photo.url} className="w-full h-full object-cover" alt="User upload" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                   <button 
                     onClick={() => handleDeletePhoto(photo)}
                     className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;