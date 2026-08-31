/* ============================================================
   schedule.js — Highlights today's services in the
   "This Week" card on the homepage and full schedule table.
   ============================================================ */

// 0 = Sunday, 1 = Monday … 6 = Saturday
const WEEKLY_SCHEDULE = [
  { day: 0, hour: 9,  min: 0,  service: 'Life Group',       note: '' },
  { day: 0, hour: 10, min: 0,  service: 'Worship Service',   note: '' },
  { day: 3, hour: 18, min: 0,  service: 'Prayer Meeting',    note: '' },
  { day: 5, hour: 18, min: 0,  service: 'Cottage Service',   note: '' },
  { day: 6, hour: 14, min: 0,  service: 'Missions',          note: '' },
];

const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const TIME_FORMAT = { hour: 'numeric', minute: '2-digit', hour12: true };

function fmtTime(h, m) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString('en-PH', TIME_FORMAT);
}

function findNextService() {
  const now     = new Date();
  const today   = now.getDay();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  // Sort all services by (day, time), wrapping around the week
  const sorted = [...WEEKLY_SCHEDULE].sort((a, b) => {
    const am = a.day * 1440 + a.hour * 60 + a.min;
    const bm = b.day * 1440 + b.hour * 60 + b.min;
    return am - bm;
  });

  for (const s of sorted) {
    const sMin = s.hour * 60 + s.min;
    if (s.day > today || (s.day === today && sMin > nowMins)) return s;
  }
  return sorted[0]; // wrap to first of next week
}

/* ── Homepage "This Week" card ───────────────────────────── */
function initScheduleCard() {
  const list = document.getElementById('schedule-list');
  if (!list) return;

  const now     = new Date();
  const today   = now.getDay();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const next    = findNextService();

  list.innerHTML = WEEKLY_SCHEDULE.map(s => {
    const sMin  = s.hour * 60 + s.min;
    const isToday = s.day === today;
    const isPast  = isToday && sMin < nowMins;
    const isNext  = (next && s.day === next.day && s.hour === next.hour && s.min === next.min);

    let cls = 'schedule-row';
    if (isToday && !isPast) cls += ' is-today';
    if (isNext)              cls += ' is-next';

    return `
      <div class="${cls}" role="listitem">
        <div class="schedule-day-time">
          <span class="schedule-day">${DAY_SHORT[s.day]}</span>
          <span class="schedule-time">${fmtTime(s.hour, s.min)}</span>
        </div>
        <span class="schedule-name">
          ${s.service}
          ${isNext ? '<span class="next-badge">Next</span>' : ''}
        </span>
      </div>`;
  }).join('');
}

/* ── Full schedule table (schedule.html) ─────────────────── */
function initScheduleTable() {
  const rows = document.querySelectorAll('.schedule-table tbody tr[data-day]');
  if (!rows.length) return;

  const today = new Date().getDay();
  rows.forEach(row => {
    if (parseInt(row.dataset.day, 10) === today) {
      row.classList.add('is-today-row');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScheduleCard();
  initScheduleTable();
});
