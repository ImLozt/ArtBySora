// main.js
/* klik na obrázek – jen pro karty s <img> */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const imgEl = card.querySelector('img');
    if (!imgEl) return;                 

    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.innerHTML =
      `<img src="${imgEl.src}" alt="">
       <p>${card.querySelector('p')?.textContent ?? ''}</p>`;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

  /*— 2. video preview (bude-li na stránce) —*/
  document.querySelectorAll('.video-box').forEach(box => {
    const video = box.querySelector('.preview-video');
    const btn   = box.querySelector('.sound-toggle');
    box.addEventListener('mouseenter', () => video.play());
    box.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    btn?.addEventListener('click', () => {
      video.muted = !video.muted;
      btn.textContent = video.muted ? '🔈' : '🔊';
    });
  });
  
  /*— 2b. Otevřít video do fullscreen overlay —*/
document.querySelectorAll('.video-box').forEach(box => {
  const video = box.querySelector('.preview-video');
  const caption = box.querySelector('p')?.textContent ?? '';

  // klik na celé pole (mimo tlačítko zvuku)
  box.addEventListener('click', e => {
    // nechceme reagovat, když uživatel klepne na ikonku 🔈/🔊
    if (e.target.closest('.sound-toggle')) return;

    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    overlay.innerHTML = `
      <video src="${video.currentSrc || video.src}" autoplay loop controls></video>
      <p>${caption}</p>
    `;
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});


  /*— 3. slideshow jen když existují #bg1 & #bg2 —*/
  const bg1 = document.getElementById('bg1');
  const bg2 = document.getElementById('bg2');
  if (bg1 && bg2) {
    const pics = [
      '../obrazky/kresby/Saber2.webp',
      '../obrazky/kresby/leblanc2.webp',
      '../obrazky/kresby/Návrhová plocha 4.webp',
      '../obrazky/kresby/titulni_strana_done.webp'
    ];
    let i = 0, showBg1 = true;
    bg1.style.backgroundImage = `url('${pics[0]}')`;
    bg1.classList.add('active');
    setInterval(() => {
      i = (i + 1) % pics.length;
      const next = pics[i];
      if (showBg1) {
        bg2.style.backgroundImage = `url('${next}')`;
        bg2.classList.add('active');
        bg1.classList.remove('active');
      } else {
        bg1.style.backgroundImage = `url('${next}')`;
        bg1.classList.add('active');
        bg2.classList.remove('active');
      }
      
      showBg1 = !showBg1;
    }, 5000);
  }


/* — SCHOVÁNÍ / ZOBRAZENÍ HLAVIČKY PŘES OPACITY — */
(() => {
  const header = document.getElementById('hero-header');
  let prev = window.scrollY;

  window.addEventListener('scroll', () => {
    const cur = window.scrollY;

    if (cur > prev && cur > 80) {   // 80 px = kousek pod header
      header.classList.add('hidden');   // scroll dolů
    } else {
      header.classList.remove('hidden'); // scroll nahoru
    }
    prev = cur;
  });
})();

/* --- Intersection Observer: spustí animaci, když je obrázek ve viewportu --- */
document.addEventListener('DOMContentLoaded', () => {
  const lazyImgs = document.querySelectorAll('.lazy');

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('show'); // spustí CSS animaci
        obs.unobserve(entry.target);        // už ho dál nesledujeme
      }
    });
  },{
    threshold: .15   // stačí aby bylo vidět 15 % obrázku
  });

  lazyImgs.forEach(el => io.observe(el));
});


// JS
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll('.lazy');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // Odpozorovat, už hotovo
      }
    });
  }, {
    rootMargin: "0px 0px 200px 0px", // začne předtím, než dojde na obrazovku
    threshold: 0.1
  });

  lazyImages.forEach(img => observer.observe(img));
});