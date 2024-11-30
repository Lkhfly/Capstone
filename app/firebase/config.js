// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc,collection, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export default db
export {app, auth, db};

//Firebase retrieve all data
export async function getData() {
  // Fetch data from your API here.
  const querySnapshot = await getDocs(collection(db, "pfc"));
  const return_stuff = []
  querySnapshot.forEach((doc) => {
    return_stuff.push(doc.data())
  });
   if(typeof window !== 'undefined'){
     localStorage.setItem('data', return_stuff);
   }
  return return_stuff
}