import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ------------------------------------------------------------------
// ⚠️ 重要：請將下方的設定替換成您自己的 Firebase Config
// 1. 前往 https://console.firebase.google.com/
// 2. 點擊您的專案 -> Project Settings (齒輪圖示)
// 3. 在 "Your apps" 區塊選擇 Web (</>) 並複製 firebaseConfig 物件
// ------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "請貼上您的_apiKey",
  authDomain: "您的專案ID.firebaseapp.com",
  projectId: "您的專案ID",
  storageBucket: "您的專案ID.firebasestorage.app",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };