// script/main.js
import { subscribeProducts, updateProduct } from './firebase.js';

// ================== Админ-панель ==================

// Открытие/закрытие админки по Ctrl + Shift + F12
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'F12') {
    const panel = document.getElementById('admin-panel');
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
});

// Кнопка закрытия внутри панели
const closeBtn = document.getElementById('close-admin');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    const panel = document.getElementById('admin-panel');
    if (panel) panel.style.display = 'none';
  });
}

// Рендер админ-панели
// Удаляем старую renderAdminPanel
function renderAdminPanel(products) {
  const container = document.getElementById('admin-products');
  if (!container) return;

  container.innerHTML = '';

  for (const id in products) {
    const data = products[id];

    const div = document.createElement('div');
    div.style.border = '1px solid #ccc';
    div.style.margin = '10px';
    div.style.padding = '10px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '15px';

    div.innerHTML = `
      <img src="${data.image || 'images/default.jpg'}" alt="Product Image" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #ccc;">
      <div>
        <h3>${id}</h3>
        <label>Title: <input type="text" value="${data.title || ''}" class="admin-title"></label><br>
        <label>Art: <input type="text" value="${data.art || ''}" class="admin-art"></label><br>
        <label>Price: <input type="number" value="${data.price || 0}" class="admin-price"></label><br>
        <label>Скрыть: <input type="checkbox" class="admin-hidden" ${data.hidden ? 'checked' : ''}></label><br>
        <button class="admin-save">Сохранить</button>
      </div>
    `;

    div.querySelector('.admin-save').addEventListener('click', () => {
      const newTitle = div.querySelector('.admin-title').value;
      const newArt = div.querySelector('.admin-art').value;
      const newPrice = parseFloat(div.querySelector('.admin-price').value) || 0;
      const isHidden = div.querySelector('.admin-hidden').checked;

      updateProduct(id, {
        title: newTitle,
        art: newArt,
        price: newPrice,
        hidden: isHidden
      });
    });

    container.appendChild(div);
  }
}


// ================== Карточки ==================
const productCards = document.querySelectorAll('.product');

subscribeProducts((products) => {
  productCards.forEach(card => {
    const id = card.dataset.id;
    const data = products[id];

    if (data) {
      card.querySelector('.product-title').textContent = data.title || '';
      card.querySelector('.product-art').textContent = data.art || '';
      card.querySelector('.product-price').textContent = data.price ? `${data.price} грн` : '';
      card.querySelector('.product-img').src = data.image || 'images/default.jpg';
      card.style.display = data.hidden ? 'none' : 'block';
    } else {
      card.style.display = 'none';
    }
  });

  renderAdminPanel(products);
});


// === main.js ===
document.addEventListener("DOMContentLoaded", () => {
  const cartElement = document.querySelector(".cart");
  const cartToggleBtn = document.querySelector(".backet");
  const cartCloseBtn = document.querySelector(".cart-close-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const orderForm = document.getElementById("order-form");
  const orderDetailsInput = document.getElementById("orderDetails");
  const cartCountEl = document.querySelector(".cart-count");

  cartElement.style.display = "none";

  cartToggleBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    cartElement.style.display = cartElement.style.display === "block" ? "none" : "block";
  });

  cartCloseBtn?.addEventListener("click", () => cartElement.style.display = "none");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateOrderDetailsField() {
    if (orderDetailsInput) {
      orderDetailsInput.value = cart.map(i =>
        `${i.name} x${i.quantity} = ${i.price * i.quantity} грн`
      ).join("\n");
    }
  }

  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalItems;
      cartCountEl.style.display = totalItems > 0 ? "flex" : "none";
    }
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div style="flex:1;">
          <strong>${item.name}</strong><br>
          Ціна: ${item.price} грн<br>
          Кількість: <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity"><br>
          Сума: ${item.price * item.quantity} грн
        </div>
        <button data-index="${index}" class="remove">Х</button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartTotal.textContent = `Разом: ${total} грн`;

    updateOrderDetailsField();
    saveCart();
    updateCartCount();
  }

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.closest(".product");
      const name = product.querySelector(".product-title").textContent.trim();
      const price = parseFloat(product.querySelector(".product-price").textContent) || 0;
      const image = product.querySelector("img")?.src || "";

      const existing = cart.find(item => item.name === name);
      if (existing) existing.quantity += 1;
      else cart.push({ name, price, image, quantity: 1 });

      renderCart();
    });
  });

  cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      renderCart();
    }
  });

  cartItemsContainer.addEventListener("input", (e) => {
    if (e.target.classList.contains("quantity")) {
      const index = e.target.dataset.index;
      const newQty = parseInt(e.target.value);
      if (newQty > 0) {
        cart[index].quantity = newQty;
        renderCart();
      }
    }
  });

  orderForm?.addEventListener("submit", (e) => {
    let valid = true;
    orderForm.querySelectorAll("input[required]").forEach(input => {
      if (!input.value.trim()) {
        input.style.border = "2px solid red";
        valid = false;
      } else {
        input.style.border = "";
      }
    });

    if (!valid) {
      e.preventDefault();
      alert("Заполните все обязательные поля!");
      return;
    }

    if (cart.length === 0) {
      e.preventDefault();
      alert("Ваш кошик порожній!");
      return;
    }

    updateOrderDetailsField();

    setTimeout(() => {
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
    }, 2000);
  });

  renderCart();
});
