import React, { useState, useEffect } from 'react';
import EggPattern from './components/EggPattern';
import Passport from './components/Passport';
import RsvpForm from './components/RsvpForm';
import MemoryWall from './components/MemoryWall';
import Island from './components/Island';
import BackgroundMusic from './components/BackgroundMusic';
import AdminDashboard from './components/AdminDashboard';
import { Attendee, MemoryPhoto } from './types';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [view, setView] = useState<'invitation' | 'admin'>('invitation');
  const [loading, setLoading] = useState(true);

  // --- Realtime Data Fetching (Firebase) ---
  useEffect(() => {
    // 1. Listen to Attendees
    const qGuests = query(collection(db, "attendees"), orderBy("joinedAt", "asc"));
    const unsubscribeGuests = onSnapshot(qGuests, (snapshot) => {
      const guestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Attendee[];
      setAttendees(guestsData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Guest Error:", error);
      setLoading(false);
    });

    // 2. Listen to Photos
    const qPhotos = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsubscribePhotos = onSnapshot(qPhotos, (snapshot) => {
      const photosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MemoryPhoto[];
      setPhotos(photosData);
    }, (error) => {
      console.error("Firebase Photo Error:", error);
    });

    return () => {
      unsubscribeGuests();
      unsubscribePhotos();
    };
  }, []);

  // --- Handle Routing ---
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setView('admin');
      } else {
        setView('invitation');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (view === 'admin') {
    return (
      <AdminDashboard 
        attendees={attendees} 
        photos={photos} 
        onBack={() => {
          window.location.hash = '';
          setView('invitation');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-ac-brown overflow-x-hidden relative">
      <EggPattern />
      <BackgroundMusic />

      <main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-12 space-y-4 animate-fade-in-down">
           <div className="inline-block bg-ac-brown text-ac-card px-6 py-2 rounded-full font-black text-sm tracking-widest mb-2 shadow-lg transform -rotate-1">
             OFFICIAL INVITATION
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-ac-brown drop-shadow-sm tracking-wider">
             小皮蛋的<span className="text-ac-orange">抓周</span>派對
           </h1>
           <p className="text-xl font-bold text-ac-brown/80">
             誠摯邀請您來 蛋蛋島 玩耍！
           </p>
        </header>

        <section className="mb-16">
          <Passport />
        </section>

        <section className="mb-16 max-w-4xl mx-auto">
          <MemoryWall photos={photos} />
        </section>

        <section className="mb-20">
          <RsvpForm onJoin={() => {}} />
        </section>

        <section className="mb-20 max-w-5xl mx-auto relative">
          <div className="flex items-center justify-center gap-4 mb-8">
             <h3 className="text-3xl font-black text-center">💬 大家的祝福</h3>
          </div>

          {loading ? (
            <div className="text-center py-10 font-bold text-ac-brown/50 animate-pulse">
              正在連線至蛋蛋島資料庫...
            </div>
          ) : (
            attendees.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {attendees.map(guest => (
                  <div key={guest.id} className="bg-white rounded-[30px] p-6 shadow-md border-2 border-ac-brown/10 flex flex-col items-center text-center relative animate-fade-in-down">
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/80 rotate-2 z-10"></div>
                     <div className={`
                        absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full text-white
                        ${guest.status === 'attending' ? 'bg-ac-green' : 'bg-gray-400'}
                     `}>
                        {guest.status === 'attending' ? '準時登島' : '請假冒險'}
                     </div>

                     <div className="font-bold text-lg mb-2 mt-4">{guest.nickname}</div>
                     
                     <div className="bg-ac-bg w-full rounded-2xl p-4 min-h-[100px] flex items-center justify-center overflow-hidden">
                       {guest.isSignature ? (
                         <img src={guest.message} alt="Signature" className="max-h-20 object-contain" />
                       ) : (
                         <p className="text-ac-brown/80 font-medium break-words w-full">{guest.message}</p>
                       )}
                     </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>

      </main>

      <footer className="w-full mt-auto">
        <Island attendees={attendees} />
      </footer>
      
      <div className="fixed bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity z-50">
        <a href="#admin" className="bg-black text-white text-xs px-2 py-1 rounded">Admin</a>
      </div>
    </div>
  );
}

export default App;