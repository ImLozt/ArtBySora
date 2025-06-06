

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




/* ——— PŘEPSANÁ ČÁST PRO „KLIK NA OBRÁZEK + FULLSCREEN S MINI-THUMBNAILY“ ——— */
(() => {
  // 1) Vytvoříme a vložíme do <body> jediné <div class="fullscreen-overlay">, které budeme znovu a znovu zobrazovat
  const overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';
  overlay.style.display = 'none';         // na začátku skryté
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  overlay.style.zIndex = '9999';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Vložíme do overlaye HTML: křížek, hlavní <img>, kontejner pro mini-náhledy
  overlay.innerHTML = `
    <span id="overlay-close">✖</span>
    <img id="overlay-main-img" src="" alt="">
    <div id="overlay-thumbs"></div>
  `;
  document.body.appendChild(overlay);

  // 2) Proměnné pro aktuální skupinu a index v ní
  let currentGroupImgs = [];  // pole <img> elementů téže skupiny (i když jsou skryté)
  let currentIndex = 0;       // index právě zobrazeného obrázku v této skupině

  // 3) Najdeme všechny karty, které mají data-group (tj. i ty schované .card.hidden)
  const cards = document.querySelectorAll('.card[data-group]');

  // Pomocná funkce: vrátí pole <img> v rámci karet se stejným data-group
  function getImgsInGroup(groupName) {
    const arr = [];
    cards.forEach(card => {
      if (card.dataset.group === groupName) {
        const img = card.querySelector('img');
        if (img) arr.push(img);
      }
    });
    return arr;
  }

  // 4) Funkce, která vykreslí celý overlay: hlavní obrázek + mini-náhledy ostatních
  function renderOverlay() {
    const mainImgEl = document.getElementById('overlay-main-img');
    const thumbsContainer = document.getElementById('overlay-thumbs');

    // 4.1) Vykreslíme hlavní obrázek
    const clickedImg = currentGroupImgs[currentIndex];
    mainImgEl.src = clickedImg.src || clickedImg.dataset.src;
    mainImgEl.alt = clickedImg.alt || '';

    // 4.2) Vyčistíme předchozí mini-náhledy
    thumbsContainer.innerHTML = '';

    // 4.3) Pokud je ve skupině více než jeden obrázek, vytvoříme mini-náhledy
    if (currentGroupImgs.length > 1) {
      currentGroupImgs.forEach((imgEl, idx) => {
        if (idx === currentIndex) return; // přeskočit hlavní obrázek
        const thumb = document.createElement('img');
    // Pokud imgEl.src není (je prázdné kvůli lazy), použijeme data-src
        const realSrc = imgEl.src || imgEl.dataset.src;
        thumb.src = realSrc;

        thumb.alt = imgEl.alt || '';
        thumb.addEventListener('click', () => {
          currentIndex = idx;      // přepneme index na ten, na který uživatel kliknul
          renderOverlay();         // překreslíme celý overlay znovu
        });
        thumbsContainer.appendChild(thumb);
      });
    }

    // 4.4) Zobrazíme overlay
    overlay.style.display = 'flex';
  }

  // 5) Přidáme listener na všechny karty s data-group (včetně těch skrytých .hidden)
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const groupName = card.dataset.group;
      if (!groupName) return;

      // 5.1) Vytvoříme pole všech <img> stejné skupiny
      currentGroupImgs = getImgsInGroup(groupName);

      // 5.2) Najdeme v tom poli index právě kliknutého obrázku
      const clickedImg = card.querySelector('img');
      const idx = currentGroupImgs.findIndex(el => el === clickedImg);
      currentIndex = idx >= 0 ? idx : 0;

      // 5.3) Vykreslíme overlay (otevřeme fullscreeen)
      renderOverlay();
    });
  });

  // 6) Zavření overlaye: kliknutím na křížek
  document.getElementById('overlay-close').addEventListener('click', () => {
    overlay.style.display = 'none';
    document.getElementById('overlay-thumbs').innerHTML = '';
  });

  // 7) Zavření overlaye: kliknutím mimo (do pozadí, nikoli na obrázek ani mini)
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      document.getElementById('overlay-thumbs').innerHTML = '';
    }
  });
})();











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
