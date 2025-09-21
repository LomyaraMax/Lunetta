// script/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIM3ZzC-H4yqYAS6...",
  authDomain: "lunetta-c19f9.firebaseapp.com",
  databaseURL: "https://lunetta-c19f9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lunetta-c19f9",
  storageBucket: "lunetta-c19f9.appspot.com",
  messagingSenderId: "369430102043",
  appId: "1:369430102043:web:d6663df10fb119e928f8be"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Подписка на изменения
export function subscribeProducts(callback) {
  const productsRef = ref(db, 'products');
  onValue(productsRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  });
}

// Обновление товара
export function updateProduct(id, newData) {
  const productRef = ref(db, `products/${id}`);
  return update(productRef, newData);
}