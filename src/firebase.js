import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup ,signOut} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_SENDER_ID,
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authenticationの取得
const auth = getAuth(app);

// Googleプロバイダーの設定
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };