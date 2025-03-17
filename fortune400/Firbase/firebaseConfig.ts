// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4GcVNakmAhdyYlmT0LyOxZV9tjW-e9xY",
  authDomain: "fortune400-c1efc.firebaseapp.com",
  projectId: "fortune400-c1efc",
  storageBucket: "fortune400-c1efc.firebasestorage.app",
  messagingSenderId: "356575685425",
  appId: "1:356575685425:web:4bd78cce91a73c113bde10",
  measurementId: "G-9QH1PGS9V7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export default app;
