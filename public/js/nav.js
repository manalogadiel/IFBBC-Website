/* ============================================================
   nav.js — Injects shared navigation + footer, handles
   mobile drawer, dropdown hover, and active link detection.
   ============================================================ */

const LOGO_SVG = `
<svg class="nav-logo-icon" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- Left page -->
  <path d="M8 26 C8 26 10 66 48 72 L50 72 L50 24 C34 18 10 24 8 26Z" fill="currentColor" opacity="0.85"/>
  <!-- Left bracket -->
  <path d="M8 22 L8 17 L15 17" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
  <path d="M8 75 L8 70 L15 70" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
  <!-- Right page -->
  <path d="M92 26 C92 26 90 66 52 72 L50 72 L50 24 C66 18 90 24 92 26Z" fill="currentColor" opacity="0.85"/>
  <!-- Right bracket -->
  <path d="M92 22 L92 17 L85 17" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
  <path d="M92 75 L92 70 L85 70" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9"/>
  <!-- Spine -->
  <line x1="50" y1="24" x2="50" y2="72" stroke="currentColor" stroke-width="2.5" opacity="0.5"/>
  <!-- Cross vertical -->
  <rect x="45" y="2" width="10" height="32" rx="2" fill="currentColor"/>
  <!-- Cross horizontal -->
  <rect x="34" y="11" width="32" height="9" rx="2" fill="currentColor"/>
</svg>`;

const NAV_HTML = `
<a href="#main-content" class="skip-link">Skip to main content</a>
<nav class="nav no-print" id="site-nav" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="IFBBC Home">
      ${LOGO_SVG}
      <span class="nav-brand-text">Inicbulan Fundamental<br>Baptist Bible Church</span>
    </a>

    <button class="nav-toggle" id="nav-toggle" aria-controls="nav-links" aria-expanded="false" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>

    <ul class="nav-links" id="nav-links" role="list">
      <li><a href="/" class="nav-link" data-page="index.html">Home</a></li>
      <li><a href="/about.html" class="nav-link" data-page="about.html">About</a></li>
      <li><a href="/leadership.html" class="nav-link" data-page="leadership.html">Leadership</a></li>
      <li class="nav-has-dropdown">
        <a href="/groups.html" class="nav-link" data-page="groups.html">Groups</a>
        <ul class="nav-dropdown" role="menu">
          <li><a href="/groups.html#kiddos" role="menuitem">🧒 Kiddos</a></li>
          <li><a href="/groups.html#adelphoi" role="menuitem">🎓 Adelphoi</a></li>
          <li><a href="/groups.html#caya" role="menuitem">💼 CAYA</a></li>
          <li><a href="/groups.html#amen" role="menuitem">🙏 A-Men</a></li>
          <li><a href="/groups.html#womisso" role="menuitem">🌸 Womisso</a></li>
        </ul>
        <!-- Mobile sub-links -->
        <div class="mobile-group-links" aria-hidden="true">
          <a href="/groups.html#kiddos">🧒 Kiddos</a>
          <a href="/groups.html#adelphoi">🎓 Adelphoi</a>
          <a href="/groups.html#caya">💼 CAYA</a>
          <a href="/groups.html#amen">🙏 A-Men</a>
          <a href="/groups.html#womisso">🌸 Womisso</a>
        </div>
      </li>
      <li><a href="/schedule.html" class="nav-link" data-page="schedule.html">Schedule</a></li>
      <li><a href="/sermons.html" class="nav-link" data-page="sermons.html">Sermons</a></li>
      <li><a href="/prayer.html" class="nav-link" data-page="prayer.html">Prayer</a></li>
      <li><a href="/contact.html" class="nav-link" data-page="contact.html">Contact</a></li>
      <li class="nav-mobile-give">
        <a href="/give.html" class="btn btn--primary btn--sm btn--block">Give</a>
      </li>
    </ul>

    <div class="nav-cta">
      <a href="/give.html" class="btn btn--primary btn--sm">Give</a>
    </div>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer class="footer no-print" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <!-- Brand -->
      <div>
        <a href="/" class="footer-brand" aria-label="IFBBC Home">
          ${LOGO_SVG.replace('class="nav-logo-icon"', 'class="footer-brand-icon"')}
          <span class="footer-brand-name">Inicbulan Fundamental<br>Baptist Bible Church, Inc.</span>
        </a>
        <p class="footer-tagline">"The Church with an open Bible"</p>
        <address class="footer-address" style="font-style:normal;">
          Purok Munlawin, Barangay Inicbulan<br>
          Bauan, Batangas 4201, Philippines
        </address>
      </div>

      <!-- Quick links -->
      <div>
        <p class="footer-col-title">Pages</p>
        <ul class="footer-links">
          <li><a href="/about.html">About</a></li>
          <li><a href="/leadership.html">Leadership</a></li>
          <li><a href="/groups.html">Core Groups</a></li>
          <li><a href="/schedule.html">Schedule &amp; Visit</a></li>
          <li><a href="/sermons.html">Sermons</a></li>
          <li><a href="/prayer.html">Prayer Wall</a></li>
          <li><a href="/give.html">Give</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </div>

      <!-- Connect -->
      <div>
        <p class="footer-col-title">Connect</p>
        <ul class="footer-links">
          <li>
            <a href="https://www.facebook.com/inicbulanfundamental.baptistbiblechurch"
               target="_blank" rel="noopener noreferrer">Facebook</a>
          </li>
          <li>
            <a href="https://www.youtube.com/@ifbbc"
               target="_blank" rel="noopener noreferrer">YouTube (@ifbbc)</a>
          </li>
          <li>
            <a href="mailto:iffbc2021@gmail.com">iffbc2021@gmail.com</a>
          </li>
        </ul>
        <p class="footer-col-title" style="margin-top:1.5rem;">Service Times</p>
        <ul class="footer-links">
          <li style="color:rgba(255,255,255,0.6);font-size:var(--text-xs);">Sun 9:00 AM — Life Group</li>
          <li style="color:rgba(255,255,255,0.6);font-size:var(--text-xs);">Sun 10:00 AM — Worship Service</li>
          <li style="color:rgba(255,255,255,0.6);font-size:var(--text-xs);">Wed 6:00 PM — Prayer Meeting</li>
          <li style="color:rgba(255,255,255,0.6);font-size:var(--text-xs);">Fri 6:00 PM — Cottage Service</li>
          <li style="color:rgba(255,255,255,0.6);font-size:var(--text-xs);">Sat 2:00 PM — Missions</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copy">
        &copy; ${new Date().getFullYear()} Inicbulan Fundamental Baptist Bible Church, Incorporated.
        All rights reserved.
      </p>
      <a href="/admin/login.html" class="footer-admin-link" tabindex="-1" aria-hidden="true">Admin</a>
    </div>
  </div>
</footer>`;

(function () {
  // Inject nav at the top of body
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  // Inject footer at the bottom of body
  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

  // ── Active link detection ──────────────────────────────
  const page = window.location.pathname.replace(/^\//, '') || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(a => {
    if (a.dataset.page === page) a.classList.add('is-active');
  });

  // ── Mobile hamburger ───────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close drawer on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close drawer on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      links.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
