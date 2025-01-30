// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc,collection, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDiR862oLiSccRg1d9_C-GL6smhUQ-tPJk",
  authDomain: "capstone-pfc.firebaseapp.com",
  projectId: "capstone-pfc",
  storageBucket: "capstone-pfc.appspot.com",
  messagingSenderId: "1066520940902",
  appId: "1:1066520940902:web:66ef9a33b37f153964b8a7",
  measurementId: "G-PVJ8RE3BJC"
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

  return return_stuff
}
export const dynamic = "force-dynamic";