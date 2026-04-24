// ── Lightbox for .content-visual images ──────────────────────────────────────
(function () {
  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const inner = document.createElement('div');
    inner.className = 'lightbox-inner';

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    inner.appendChild(img);
    inner.appendChild(closeBtn);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // Trigger fade-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('is-open'));
    });

    function close() {
      overlay.classList.remove('is-open');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }

    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.closest('.lightbox-close')) close();
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    });
  }

  // ── QR code popover (hover to reveal) ────────────────────────────────────
  function initQRPopovers() {
    document.querySelectorAll('[data-qr-popover]').forEach(btn => {
      const popover = document.getElementById(btn.dataset.qrPopover);
      if (!popover) return;
      let hideTimer;

      function show() {
        clearTimeout(hideTimer);
        popover.classList.add('is-visible');
      }
      function scheduleHide() {
        hideTimer = setTimeout(() => popover.classList.remove('is-visible'), 180);
      }

      btn.addEventListener('mouseenter', show);
      btn.addEventListener('mouseleave', scheduleHide);
      popover.addEventListener('mouseenter', show);
      popover.addEventListener('mouseleave', scheduleHide);
    });
  }

  // ── Device-aware store buttons ────────────────────────────────────────────
  function initStoreButtons() {
    const ua = navigator.userAgent || '';
    const isIOS     = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);
    document.querySelectorAll('.store-btns').forEach(wrap => {
      if (isIOS) {
        wrap.querySelectorAll('.store-btn--android').forEach(b => { b.hidden = true; });
        wrap.querySelectorAll('.store-btn--ios').forEach(b => b.classList.add('is-primary'));
      } else if (isAndroid) {
        wrap.querySelectorAll('.store-btn--ios').forEach(b => { b.hidden = true; });
        wrap.querySelectorAll('.store-btn--android').forEach(b => b.classList.add('is-primary'));
      }
      // Desktop: both buttons shown, neither highlighted
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.content-visual img, .js-magnify').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(img.src, img.alt));
    });
    initQRPopovers();
    initStoreButtons();
  });
})();
