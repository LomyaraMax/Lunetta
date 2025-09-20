// setup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ⚡ Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBIM3ZzC-H4yqYAS6...",
  authDomain: "lunetta-c19f9.firebaseapp.com",
  databaseURL: "https://lunetta-c19f9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lunetta-c19f9",
  storageBucket: "lunetta-c19f9.appspot.com",
  messagingSenderId: "369430102043",
  appId: "1:369430102043:web:d6663df10fb119e928f8be"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ---- Функция генерации товаров ----
function generateProducts(prefix, startArt, count, basePrice) {
  const products = {};
  for (let i = 1; i <= count; i++) {
    const id = `${prefix}-${i}`;
    const art = (startArt + i).toString().padStart(3, "0"); // 001, 002 ...
    products[id] = {
      art: art,
      title: `Тестовый товар ${id}`,
      price: basePrice + i * 20,
      image: "images/default.jpg",
      hidden: false // добавляем поле для скрытия/показа карточки
    };
  }
  return products;
}

// ---- Создаём все категории ----
const productsData = {
  ...generateProducts("basic", 0, 10, 100),     // basic-1 … basic-10
  ...generateProducts("best", 100, 10, 200),    // best-1 … best-10
  ...generateProducts("discount", 200, 10, 80)  // discount-1 … discount-10
};

// ---- Записываем в Firebase ----
set(ref(db, "products"), productsData)
  .then(() => {
    console.log("✅ Все товары успешно добавлены в Firebase!");
  })
  .catch((error) => {
    console.error("❌ Ошибка при добавлении:", error);
  });
