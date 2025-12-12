import React, { useState } from 'react';
import { Send, Plane, Map, Loader2 } from 'lucide-react';
import AvatarSelector from './AvatarSelector';
import SignaturePad from './SignaturePad';
import { Attendee } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Props {
  onJoin: (attendee: Attendee) => void;
}

const RsvpForm: React.FC<Props> = ({ onJoin }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [messageMode, setMessageMode] = useState<'text' | 'draw'>('text');
  const [textMessage, setTextMessage] = useState('');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("請填寫姓名喔！");

    setIsSubmitting(true);

    try {
      const docData = {
        name,
        nickname: nickname || name,
        avatarIndex: avatarIdx,
        message: messageMode === 'text' ? textMessage : (signatureData || ''),
        isSignature: messageMode === 'draw',
        joinedAt: Date.now(),
        status
      };

      // Write to Firebase Firestore
      await addDoc(collection(db, "attendees"), docData);
      
      // Reset Form
      setName('');
      setNickname('');
      setTextMessage('');
      setSignatureData(null);
      setStatus('attending');
      alert("回函成功！感謝您的填寫！");
      
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("傳送失敗，請檢查網路連線或 Firebase 設定");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-ac-card rounded-[40px] p-6 md:p-10 shadow-xl border-4 border-ac-orange/50 max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black text-ac-brown mb-2">📩 島民回函</h2>
        <p className="text-ac-brown/70 font-bold">請填寫以下資訊，準備登機！</p>
      </div>

      {/* Attendance Status */}
      <div className="bg-ac-bg/50 p-6 rounded-3xl border-2 border-ac-brown/10">
        <label className="text-ac-brown font-bold text-lg mb-4 block text-center">請問您當天是否出席？</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setStatus('attending')}
            className={`
              relative p-4 rounded-2xl border-4 transition-all duration-300 flex items-center justify-center gap-3
              ${status === 'attending' 
                ? 'bg-ac-green text-white border-ac-green scale-105 shadow-md' 
                : 'bg-white text-ac-brown border-transparent hover:bg-white/80'}
            `}
          >
            <Plane className={status === 'attending' ? 'animate-bounce' : ''} />
            <span className="font-black text-lg">當日會準時登島</span>
            {status === 'attending' && <div className="absolute top-2 right-2 text-yellow-300">★</div>}
          </button>

          <button
            type="button"
            onClick={() => setStatus('declined')}
            className={`
              relative p-4 rounded-2xl border-4 transition-all duration-300 flex items-center justify-center gap-3
              ${status === 'declined' 
                ? 'bg-ac-orange text-white border-ac-orange scale-105 shadow-md' 
                : 'bg-white text-ac-brown border-transparent hover:bg-white/80'}
            `}
          >
            <Map />
            <span className="font-black text-lg">當日需前往其他島冒險</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-ac-brown font-bold ml-2">參加人姓名</label>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-ac-bg border-2 border-ac-brown/20 rounded-2xl px-4 py-3 text-lg font-bold text-ac-brown focus:outline-none focus:border-ac-blue"
            placeholder="請輸入真實姓名"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-ac-brown font-bold ml-2">島上暱稱</label>
          <input 
            type="text" 
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="w-full bg-ac-bg border-2 border-ac-brown/20 rounded-2xl px-4 py-3 text-lg font-bold text-ac-brown focus:outline-none focus:border-ac-blue"
            placeholder="大家怎麼稱呼你？"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-ac-brown font-bold ml-2 block">
          {status === 'attending' ? '選擇你的島民大頭貼' : '雖然不能來，也選個大頭貼留念吧！'}
        </label>
        <AvatarSelector selected={avatarIdx} onSelect={setAvatarIdx} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
           <label className="text-ac-brown font-bold ml-2">給小皮蛋的祝福</label>
           <div className="flex bg-ac-bg rounded-full p-1 border-2 border-ac-brown/10">
              <button
                type="button"
                onClick={() => setMessageMode('text')}
                className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${messageMode === 'text' ? 'bg-ac-brown text-white shadow' : 'text-ac-brown/50'}`}
              >
                打字
              </button>
              <button
                type="button"
                onClick={() => setMessageMode('draw')}
                className={`px-4 py-1 rounded-full text-sm font-bold transition-all ${messageMode === 'draw' ? 'bg-ac-brown text-white shadow' : 'text-ac-brown/50'}`}
              >
                手寫
              </button>
           </div>
        </div>

        {messageMode === 'text' ? (
          <textarea
            value={textMessage}
            onChange={e => setTextMessage(e.target.value)}
            className="w-full h-32 bg-white border-2 border-ac-brown/20 rounded-2xl p-4 text-lg font-medium text-ac-brown focus:outline-none focus:border-ac-blue resize-none"
            placeholder="寫下對寶寶的祝福..."
          />
        ) : (
          <SignaturePad onSave={setSignatureData} />
        )}
      </div>

      <div className="pt-4 flex justify-center">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`
            bg-ac-green text-white text-xl font-black px-12 py-4 rounded-full shadow-lg 
            flex items-center gap-3 transition-all
            ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-[#68A04B] hover:scale-105'}
          `}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send strokeWidth={3} />}
          {isSubmitting ? '傳送中...' : '確認送出'}
        </button>
      </div>
    </form>
  );
};

export default RsvpForm;