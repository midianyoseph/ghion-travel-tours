/* ============================================================
   GHION TRAVEL & TOURS — LIGHTBOX
   ============================================================ */

class Lightbox {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.el = null;
    this.imgEl = null;
    this.captionEl = null;
    this.build();
    this.bindGallery();
    this.bindKeys();
  }

  build() {
    this.el = document.createElement('div');
    this.el.className = 'lightbox';
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-label', 'Image lightbox');
    this.el.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <img class="lightbox-img" src="" alt="" />
      <button class="lightbox-nav lightbox-next" aria-label="Next image">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(this.el);

    this.imgEl = this.el.querySelector('.lightbox-img');
    this.captionEl = this.el.querySelector('.lightbox-caption');

    this.el.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.el.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    this.el.querySelector('.lightbox-next').addEventListener('click', () => this.next());

    // Close on backdrop click
    this.el.addEventListener('click', e => {
      if (e.target === this.el) this.close();
    });
  }

  bindGallery() {
    // Collect all gallery items
    const collectImages = () => {
      this.images = [];
      document.querySelectorAll('.gallery-item').forEach((item, i) => {
        const img = item.querySelector('img');
        if (!img) return;
        this.images.push({
          src: img.dataset.full || img.src,
          alt: img.alt || '',
          caption: img.dataset.caption || img.alt || ''
        });

        item.addEventListener('click', () => this.open(i));
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.open(i);
          }
        });
      });
    };

    collectImages();
    // Re-collect after filter changes
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => setTimeout(collectImages, 100));
    });
  }

  open(index) {
    this.currentIndex = index;
    this.show();
    this.el.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.el.focus();
  }

  close() {
    this.el.classList.remove('open');
    document.body.style.overflow = '';
  }

  show() {
    const img = this.images[this.currentIndex];
    if (!img) return;
    this.imgEl.src = img.src;
    this.imgEl.alt = img.alt;
    this.captionEl.textContent = img.caption ? `${img.caption}  (${this.currentIndex + 1} / ${this.images.length})` : `${this.currentIndex + 1} / ${this.images.length}`;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.show();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.show();
  }

  bindKeys() {
    document.addEventListener('keydown', e => {
      if (!this.el.classList.contains('open')) return;
      if (e.key === 'Escape')       this.close();
      if (e.key === 'ArrowRight')   this.next();
      if (e.key === 'ArrowLeft')    this.prev();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.gallery-item')) {
    new Lightbox();
  }
});
