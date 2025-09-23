document.addEventListener("DOMContentLoaded", () => {
  const mainPhoto = document.getElementById("mainPhoto");
  const thumbnails = document.querySelectorAll(".main_pages .thumb");

  let currentIndex = 0;

  // клик по миниатюре
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      changeImage(index);
    });
  });

  function changeImage(index) {
    if (!thumbnails[index]) return;

    mainPhoto.classList.add("fade");

    setTimeout(() => {
      mainPhoto.src = thumbnails[index].src; // ⚡ тут обновляем картинку
      thumbnails.forEach(t => t.classList.remove("active"));
      thumbnails[index].classList.add("active");
      mainPhoto.classList.remove("fade");
      currentIndex = index;
    }, 200);
  }

  // свайпы на телефоне
  let startX = 0;

  mainPhoto.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  mainPhoto.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
      currentIndex = (currentIndex + 1) % thumbnails.length;
      changeImage(currentIndex);
    } else if (endX - startX > 50) {
      currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      changeImage(currentIndex);
    }
  });
});
