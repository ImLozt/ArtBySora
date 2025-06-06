
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

document.addEventListener("DOMContentLoaded", () => {
  // 1) najdeme všechny obrázky s třídou 'lazy'
  const lazyImages = document.querySelectorAll("img.lazy");

  if (lazyImages.length) {
    // 2) vytvoříme Observer
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        // když se obrázek přiblíží aspoň 10 % do viewportu
        if (entry.isIntersecting) {
          const img = entry.target;

          // 3) nastavíme skutečný src z data-src
          img.src = img.dataset.src;

          // 4) když se obrázek plně načte, přidáme třídu 'loaded'
          img.addEventListener("load", () => {
            img.classList.add("loaded");
            // volitelně můžeme zrušit jakékoli pozadí, pokud jsi dříve definoval .lazy { background-color... }
            img.style.background = "none";
          });

          // 5) už ho pak dál nepozorujeme
          obs.unobserve(img);
        }
      });
    }, {
      rootMargin: "200px 0px",  // stáhni obrázek 200px před tím, než je vidět
      threshold: 0.1            // spustí se, když je alespoň 10 % obrázku v zorném poli
    });

    // 6) a nyní každé 'img.lazy' přidáme do Observeru
    lazyImages.forEach(img => {
      observer.observe(img);
    });
  }

  // (Pod tím můžeš nechat svůj existující kód pro 
  //  – fullscreen overlay 
  //  – scroll handler hlavičky 
  //  – atd. – ale už ne dvakrát řešit `.lazy`.)
});
