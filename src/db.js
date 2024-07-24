
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0eHfH1zA_LLnMb00wWgZnCj74uQikVjk",
  authDomain: "lista-mercado-d9e71.firebaseapp.com",
  projectId: "lista-mercado-d9e71",
  storageBucket: "lista-mercado-d9e71.appspot.com",
  messagingSenderId: "808842499076",
  appId: "1:808842499076:web:786c91195be40c506b1151",
  measurementId: "G-W921NZT26C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export default auth