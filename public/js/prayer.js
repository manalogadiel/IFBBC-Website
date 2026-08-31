/* ============================================================
   prayer.js — Prayer wall fetch + submission form
   ============================================================ */

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/* ── Prayer Wall ─────────────────────────────────────────── */
async function loadPrayerWall() {
  const wall = document.getElementById('prayer-wall');
  if (!wall) return;

  wall.innerHTML = '<div class="spinner" aria-label="Loading prayer requests…"></div>';

  try {
    const res     = await fetch('/api/prayer-requests');
    const prayers = await res.json();

    if (!prayers.length) {
      wall.innerHTML = `
        <div class="poster-empty" style="grid-column:1/-1">
          <p style="margin:0;font-size:var(--text-sm);color:var(--c-muted);">
            No public prayer requests yet. Be the first to share!
          </p>
        </div>`;
      return;
    }

    wall.innerHTML = prayers.map(p => `
      <article class="prayer-card" aria-label="Prayer request">
        <p class="prayer-card-name">${escHtml(p.displayName)}</p>
        <p class="prayer-card-text">${escHtml(p.text)}</p>
        <time class="prayer-card-date" datetime="${p.submittedAt}">
          ${formatDate(p.submittedAt)}
        </time>
      </article>`).join('');
  } catch {
    wall.innerHTML = `
      <div class="alert alert--error" style="grid-column:1/-1">
        Unable to load prayer requests. Please try again later.
      </div>`;
  }
}

/* ── Submission form ─────────────────────────────────────── */
function initPrayerForm() {
  const form = document.getElementById('prayer-form');
  if (!form) return;

  const visPublic  = document.getElementById('vis-public');
  const visPrivate = document.getElementById('vis-private');
  const nameOpts   = document.getElementById('name-options');
  const nameChoice = document.querySelectorAll('input[name="nameChoice"]');
  const customName = document.getElementById('custom-name');
  const msgEl      = document.getElementById('form-message');

  // Show/hide name options based on visibility
  function updateNameOptions() {
    if (visPublic && visPublic.checked) {
      nameOpts && (nameOpts.style.display = 'block');
    } else {
      nameOpts && (nameOpts.style.display = 'none');
    }
  }

  // Show/hide custom name input
  function updateCustomName() {
    const selected = document.querySelector('input[name="nameChoice"]:checked');
    if (customName) {
      customName.style.display = (selected && selected.value === 'name') ? 'block' : 'none';
    }
  }

  visPublic  && visPublic.addEventListener('change', updateNameOptions);
  visPrivate && visPrivate.addEventListener('change', updateNameOptions);
  nameChoice.forEach(r => r.addEventListener('change', updateCustomName));

  updateNameOptions();
  updateCustomName();

  // Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msgEl.innerHTML = '';

    const btn  = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    const body = {
      text:       data.get('text'),
      visibility: data.get('visibility'),
      nameChoice: data.get('nameChoice') || 'anonymous',
      customName: data.get('customName') || ''
    };

    btn.disabled    = true;
    btn.textContent = 'Submitting…';

    try {
      const res  = await fetch('/api/prayer-requests', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body)
      });
      const json = await res.json();

      if (res.ok && json.success) {
        msgEl.innerHTML = `
          <div class="alert alert--success">
            ✝ ${escHtml(json.message)}
          </div>`;
        form.reset();
        updateNameOptions();
        updateCustomName();
        // If public submission, reload wall
        if (body.visibility === 'public') setTimeout(loadPrayerWall, 1000);
      } else {
        msgEl.innerHTML = `<div class="alert alert--error">${escHtml(json.error || 'Submission failed.')}</div>`;
      }
    } catch {
      msgEl.innerHTML = '<div class="alert alert--error">Network error. Please try again.</div>';
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Submit Prayer Request';
    }
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
  loadPrayerWall();
  initPrayerForm();
});
