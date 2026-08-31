/* ============================================================
   admin.js — Admin dashboard interactions:
   prayer request moderation + poster upload/delete
   ============================================================ */

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/* ── Check auth → redirect if not admin ─────────────────── */
async function checkAdminAuth() {
  try {
    const res  = await fetch('/api/admin/check');
    const json = await res.json();
    if (!json.isAdmin) window.location.href = '/admin/login.html';
  } catch {
    window.location.href = '/admin/login.html';
  }
}

/* ── Admin login form ────────────────────────────────────── */
function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn   = form.querySelector('button[type="submit"]');
    const msgEl = document.getElementById('login-message');
    const pw    = document.getElementById('admin-password').value;

    btn.disabled    = true;
    btn.textContent = 'Signing in…';
    msgEl.innerHTML = '';

    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      const json = await res.json();

      if (res.ok && json.success) {
        window.location.href = '/admin/dashboard.html';
      } else {
        msgEl.innerHTML = `<div class="alert alert--error">${escHtml(json.error || 'Login failed.')}</div>`;
        btn.disabled    = false;
        btn.textContent = 'Sign In';
      }
    } catch {
      msgEl.innerHTML = '<div class="alert alert--error">Network error. Please try again.</div>';
      btn.disabled    = false;
      btn.textContent = 'Sign In';
    }
  });
}

/* ── Logout ──────────────────────────────────────────────── */
function initLogout() {
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login.html';
    });
  });
}

/* ── Prayer request moderation ───────────────────────────── */
async function loadPrayerRequests() {
  const tbody = document.getElementById('prayer-tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;">
    <div class="spinner"></div></td></tr>`;

  const filter = (document.getElementById('status-filter') || {}).value || 'all';

  try {
    const res     = await fetch('/api/admin/prayer-requests');
    let   prayers = await res.json();

    if (filter !== 'all') prayers = prayers.filter(p => p.status === filter);

    if (!prayers.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--c-muted);padding:2rem;">
        No prayer requests found.</td></tr>`;
      return;
    }

    tbody.innerHTML = prayers.map(p => {
      const badgeClass = {
        pending:  'status-badge--pending',
        approved: 'status-badge--approved',
        rejected: 'status-badge--rejected',
        private:  'status-badge--private'
      }[p.status] || '';

      const canApprove = p.status === 'pending';
      const canReject  = p.status === 'pending' || p.status === 'approved';

      return `
      <tr>
        <td style="max-width:280px;">
          <p style="font-size:var(--text-sm);color:var(--c-text);margin:0;white-space:pre-wrap;word-break:break-word;">
            ${escHtml(p.text)}
          </p>
        </td>
        <td><span class="status-badge ${badgeClass}">${escHtml(p.status)}</span></td>
        <td style="font-size:var(--text-sm);">${escHtml(p.visibility)}</td>
        <td style="font-size:var(--text-sm);">${escHtml(p.displayName)}</td>
        <td style="font-size:var(--text-xs);color:var(--c-muted);white-space:nowrap;">${formatDate(p.submittedAt)}</td>
        <td>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${canApprove ? `<button class="btn btn--sm btn--primary" onclick="actionPrayer('${p.id}','approve')">Approve</button>` : ''}
            ${canReject  ? `<button class="btn btn--sm btn--ghost"   onclick="actionPrayer('${p.id}','reject')">Reject</button>`  : ''}
            <button class="btn btn--sm btn--danger" onclick="actionPrayer('${p.id}','delete')">Delete</button>
          </div>
        </td>
      </tr>`;
    }).join('');

  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="alert alert--error">Failed to load requests.</div></td></tr>`;
  }
}

async function actionPrayer(id, action) {
  if (action === 'delete' && !confirm('Delete this prayer request permanently?')) return;

  try {
    const res  = await fetch(`/api/admin/prayer-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    const json = await res.json();
    if (json.success) loadPrayerRequests();
    else alert(json.error || 'Action failed.');
  } catch {
    alert('Network error. Please try again.');
  }
}

window.actionPrayer = actionPrayer; // expose globally for inline handlers

/* ── Poster manager ──────────────────────────────────────── */
async function loadPosters(group, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  grid.innerHTML = '<div class="spinner"></div>';

  try {
    const res     = await fetch(`/api/posters/${group}`);
    const posters = await res.json();

    if (!posters.length) {
      grid.innerHTML = '<p style="color:var(--c-muted);font-size:var(--text-sm);">No posters uploaded yet.</p>';
      return;
    }

    grid.innerHTML = posters.map(p => `
      <div class="poster-admin-item">
        <img src="${p.url}" alt="Poster" loading="lazy">
        <button class="poster-admin-delete"
                onclick="deletePoster('${group}','${p.filename}')"
                title="Delete this poster" aria-label="Delete poster">
          &times;
        </button>
      </div>`).join('');
  } catch {
    grid.innerHTML = '<div class="alert alert--error">Failed to load posters.</div>';
  }
}

async function deletePoster(group, filename) {
  if (!confirm('Delete this poster? This cannot be undone.')) return;

  try {
    const res  = await fetch(`/api/admin/posters/${group}/${filename}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      // Reload the active tab's grid
      const activeTab = document.querySelector('.tab-btn.is-active');
      if (activeTab) loadPosters(activeTab.dataset.group, activeTab.dataset.tab + '-grid');
    } else {
      alert(json.error || 'Delete failed.');
    }
  } catch {
    alert('Network error.');
  }
}

window.deletePoster = deletePoster;

function initPosterUpload() {
  document.querySelectorAll('.poster-upload-form').forEach(form => {
    const group   = form.dataset.group;
    const msgEl   = document.getElementById(`upload-msg-${group}`);
    const gridId  = `${group}-grid`;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = form.querySelector('button[type="submit"]');
      const file = form.querySelector('input[type="file"]').files[0];
      if (!file) { alert('Please select a file.'); return; }

      const fd = new FormData();
      fd.append('poster', file);

      btn.disabled    = true;
      btn.textContent = 'Uploading…';
      if (msgEl) msgEl.innerHTML = '';

      try {
        const res  = await fetch(`/api/admin/posters/${group}`, { method: 'POST', body: fd });
        const json = await res.json();

        if (res.ok && json.success) {
          if (msgEl) msgEl.innerHTML = '<div class="alert alert--success">Poster uploaded successfully!</div>';
          form.reset();
          loadPosters(group, gridId);
        } else {
          if (msgEl) msgEl.innerHTML = `<div class="alert alert--error">${escHtml(json.error)}</div>`;
        }
      } catch {
        if (msgEl) msgEl.innerHTML = '<div class="alert alert--error">Upload failed. Try again.</div>';
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Upload Poster';
      }
    });
  });
}

/* ── Change password ─────────────────────────────────────── */
function initChangePassword() {
  const form = document.getElementById('change-pw-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn    = form.querySelector('button[type="submit"]');
    const msgEl  = document.getElementById('pw-message');
    const cur    = document.getElementById('current-pw').value;
    const nw     = document.getElementById('new-pw').value;
    const conf   = document.getElementById('confirm-pw').value;

    if (nw !== conf) {
      msgEl.innerHTML = '<div class="alert alert--error">New passwords do not match.</div>';
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Saving…';

    try {
      const res  = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: cur, newPassword: nw })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        msgEl.innerHTML = '<div class="alert alert--success">Password changed successfully.</div>';
        form.reset();
      } else {
        msgEl.innerHTML = `<div class="alert alert--error">${escHtml(json.error)}</div>`;
      }
    } catch {
      msgEl.innerHTML = '<div class="alert alert--error">Network error.</div>';
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Change Password';
    }
  });
}

/* ── Status filter ───────────────────────────────────────── */
function initStatusFilter() {
  const filter = document.getElementById('status-filter');
  if (filter) filter.addEventListener('change', loadPrayerRequests);
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initLogout();
  initStatusFilter();
  initPosterUpload();
  initChangePassword();
});
