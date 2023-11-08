import firebase from 'firebase/compat/app'; 
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA76t-PE2Ke3o-ci9OQgJGeAqqDY9bPRY4",
    authDomain: "base-marvin.firebaseapp.com",
    projectId: "base-marvin",
    storageBucket: "base-marvin.appspot.com",
    messagingSenderId: "940753198072",
    appId: "1:940753198072:web:6ecad6406de84d8388940d"
  };

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth(); 

export default firebaseConfig;
