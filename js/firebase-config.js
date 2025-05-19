const firebaseConfig = {
  apiKey: "AIzaSyAPnNFs_6Rdf8tqcSeT_aSjrasY2OvhxeY",
  authDomain: "gym-management-system-af81c.firebaseapp.com",
  projectId: "gym-management-system-af81c",
  storageBucket: "gym-management-system-af81c.firebasestorage.app",
  messagingSenderId: "897362274535",
  appId: "1:897362274535:web:05e58ea60c05c69f3eda42"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
