/* ============================================================
   gallery.js — Loads poster grids from the API and opens
   a native <dialog> lightbox on click.
   ============================================================ */

const lightbox     = document.getElementById('poster-lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxClose= document.getElementById('lightbox-close');

function openLightbox(url, alt) {
  if (!lightbox) return;
  lightboxImg.src = url;
  lightboxImg.alt = alt || '';
  lightbox.showModal();
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.close();
  lightboxImg.src = '';
}

// Close on backdrop click
lightbox && lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

lightboxClose && lightboxClose.addEventListener('click', closeLightbox);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox && lightbox.open) closeLightbox();
});

/* ── Load poster grid ────────────────────────────────────── */
async function loadPosterGrid(group, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="spinner" aria-label="Loading posters…"></div>';

  try {
    const res     = await fetch(`/api/posters/${group}`);
    const posters = await res.json();

    if (!posters.length) {
      container.innerHTML = `
        <div class="poster-empty">
          <p>No posters yet for this group. Check back soon!</p>
        </div>`;
      return;
    }

    container.innerHTML = posters.map(p => `
      <div class="poster-item" tabindex="0" role="button"
           aria-label="View poster"
           data-url="${p.url}">
        <img src="${p.url}" alt="Event poster" loading="lazy">
      </div>`).join('');

    container.querySelectorAll('.poster-item').forEach(item => {
      const activate = () => openLightbox(item.dataset.url, 'Event poster');
      item.addEventListener('click', activate);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

  } catch {
    container.innerHTML = `
      <div class="alert alert--error">Unable to load posters. Please try again later.</div>`;
  }
}

/* ── Accordion (About / Statement of Faith) ──────────────── */
function initAccordions() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
    });
  });
}

/* ── Tabs ─────────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabs => {
    tabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = document.getElementById(btn.dataset.tab);
        if (!panel) return;

        // Deactivate all
        tabs.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });

        const tabWrap = tabs.closest('.tab-wrap') || document.body;
        tabWrap.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));

        // Activate clicked
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        panel.classList.add('is-active');
      });
    });
  });
}

/* ── YouTube facade ──────────────────────────────────────── */
function initYoutubeFacades() {
  document.querySelectorAll('.youtube-facade').forEach(facade => {
    const btn = facade.querySelector('.youtube-play-btn');
    if (!btn) return;

    const activate = () => {
      const videoId = facade.dataset.videoId;
      const channelUrl = facade.dataset.channelUrl;

      if (videoId) {
        const iframe = document.createElement('div');
        iframe.className = 'youtube-iframe-container';
        iframe.innerHTML = `<iframe
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>`;
        facade.replaceWith(iframe);
      } else if (channelUrl) {
        window.open(channelUrl, '_blank', 'noopener');
      }
    };

    btn.addEventListener('click', activate);
    facade.addEventListener('keydown', e => { if (e.key === 'Enter') activate(); });
    facade.setAttribute('tabindex', '0');
  });
}

/* ── Group sticky nav active state ──────────────────────── */
function initGroupsNav() {
  const sections = document.querySelectorAll('.group-section[id]');
  const navLinks = document.querySelectorAll('.groups-nav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', () => {
  initAccordions();
  initTabs();
  initYoutubeFacades();
  initGroupsNav();
});
