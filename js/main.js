/* ── Astral X Realm — Main JS ── */

/* Mark active nav link */
function markActive() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}
markActive();

/* Hamburger menu */
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    const open = mobileMenu.classList.toggle('open');
    mobileMenu.style.display = open ? 'block' : 'none';
  });
  document.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.style.display = 'none';
  });
  mobileMenu.addEventListener('click', e => e.stopPropagation());
}

/* Toast */
function showToast(msg, type = 'default') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 320);
  }, 3200);
}

/* Auth modal */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
}
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
});
document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
});
document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.addEventListener('click', e => {
    if (e.target === bd) closeModal(bd.id);
  });
});

/* Tab system */
function initTabs(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  const btns   = wrap.querySelectorAll('.tab-btn');
  const panels = wrap.querySelectorAll('.tab-panel');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => { p.style.display = p.id === target ? 'block' : 'none'; });
      btn.classList.add('active');
    });
  });
}
initTabs('profile-tabs');
initTabs('lb-tabs');

/* FAQ accordion */
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const chevron = btn.querySelector('.faq-chevron');
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').classList.remove('open');
      openItem.querySelector('.faq-chevron').classList.remove('open');
      openItem.querySelector('.faq-btn').classList.remove('open');
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
      chevron.classList.add('open');
      btn.classList.add('open');
    }
  });
});

/* Count-up animation */
function countUp(el, target, duration = 1400) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.dataset.current = Math.floor(ease * target);
    if (el.dataset.format === 'k') {
      el.textContent = Math.floor((ease * target) / 1000) + 'k+';
    } else {
      el.textContent = Math.floor(ease * target).toLocaleString() + (el.dataset.suffix || '');
    }
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const countEls = document.querySelectorAll('[data-count]');
if (countEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        countUp(el, parseInt(el.dataset.count));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  countEls.forEach(el => observer.observe(el));
}

/* Search filter for leaderboard */
const searchInput = document.getElementById('lb-search');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    document.querySelectorAll('.lb-row[data-name]').forEach(row => {
      const name = row.dataset.name.toLowerCase();
      const guild = (row.dataset.guild || '').toLowerCase();
      row.style.display = (name.includes(q) || guild.includes(q)) ? '' : 'none';
    });
  });
}

/* Leaderboard tab switch */
document.querySelectorAll('[data-lb-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-lb-tab]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.lbTab;
    document.querySelectorAll('[data-lb-panel]').forEach(p => {
      p.style.display = p.dataset.lbPanel === target ? 'block' : 'none';
    });
  });
});

/* Profile tabs */
document.querySelectorAll('[data-profile-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-profile-tab]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.profileTab;
    document.querySelectorAll('[data-profile-panel]').forEach(p => {
      p.style.display = p.dataset.profilePanel === target ? 'block' : 'none';
    });
  });
});

/* Auth form (demo — no real backend) */
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    closeModal('login-modal');
    showToast('Logged in (demo mode)', 'success');
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    closeModal('signup-modal');
    showToast('Account created (demo mode)', 'success');
  });
}

/* Switch between login/signup modals */
document.querySelectorAll('[data-switch-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const [from, to] = btn.dataset.switchModal.split(',');
    closeModal(from);
    setTimeout(() => openModal(to), 50);
  });
});

/* Plan purchase (demo) */
document.querySelectorAll('.plan-buy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.plan;
    showToast(`Opening payment for ${plan} — demo only`, 'default');
  });
});

/* ══════════════════════════════════════════════
   API INTEGRATION — connects to VPS via /api/*
   (Vercel proxies /api/* → your VPS)
   ══════════════════════════════════════════════ */

const API = '';  // Vercel proxy handles it

function authHeaders() {
  const token = localStorage.getItem('axr_token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

/* ── Auth ── */
const loginFormReal = document.getElementById('login-form');
const signupFormReal = document.getElementById('signup-form');

if (loginFormReal) {
  loginFormReal.addEventListener('submit', async e => {
    e.preventDefault();
    const inputs = loginFormReal.querySelectorAll('input');
    const username = inputs[0].value.trim();
    const password = inputs[1].value;
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('axr_token', data.token);
        localStorage.setItem('axr_user', JSON.stringify(data.player || data.user || { name: username }));
        closeModal('login-modal');
        showToast('Welcome back, ' + username + '!', 'success');
        updateNavForLoggedInUser();
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch {
      showToast('Could not connect to server', 'error');
    }
  });
}

if (signupFormReal) {
  signupFormReal.addEventListener('submit', async e => {
    e.preventDefault();
    const inputs = signupFormReal.querySelectorAll('input');
    const username = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value;
    try {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem('axr_token', data.token);
          localStorage.setItem('axr_user', JSON.stringify(data.player || { name: username }));
          updateNavForLoggedInUser();
        }
        closeModal('signup-modal');
        showToast('Account created! Welcome to the Realm.', 'success');
      } else {
        showToast(data.message || 'Signup failed', 'error');
      }
    } catch {
      showToast('Could not connect to server', 'error');
    }
  });
}

/* ── Nav: show username if logged in ── */
function updateNavForLoggedInUser() {
  const raw = localStorage.getItem('axr_user');
  if (!raw) return;
  try {
    const user = JSON.parse(raw);
    const name = user.name || user.username || 'Player';
    const actions = document.querySelector('.nav-actions');
    if (actions) {
      actions.innerHTML = `
        <a href="/profile.html" style="display:flex;align-items:center;gap:7px;background:rgba(139,92,246,0.1);border:0.5px solid rgba(139,92,246,0.24);border-radius:999px;padding:5px 14px 5px 8px;text-decoration:none;">
          <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,rgba(139,92,246,0.7),rgba(34,211,238,0.5));display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:800;color:#fff;">${name.charAt(0).toUpperCase()}</div>
          <span style="font-size:0.77rem;font-weight:600;color:#fff;max-width:88px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</span>
        </a>
        <button onclick="logout()" class="btn btn-ghost" style="padding:7px 14px;font-size:0.77rem;">Log out</button>
      `;
    }
  } catch {}
}

function logout() {
  localStorage.removeItem('axr_token');
  localStorage.removeItem('axr_user');
  showToast('Logged out', 'default');
  setTimeout(() => location.reload(), 600);
}

/* ── Live leaderboard ── */
async function loadLeaderboard() {
  const rows = document.querySelectorAll('.lb-row[data-name]');
  if (!rows.length) return; // not on leaderboard page
  try {
    const res = await fetch(`${API}/api/leaderboard`);
    if (!res.ok) return;
    const players = await res.json();
    const tableWrap = document.querySelector('.lb-table-wrap');
    if (!tableWrap || !players.length) return;
    // Rebuild rows from live data
    const existingHeader = tableWrap.querySelector('.lb-header');
    const liveRows = players.slice(0, 20).map((p, i) => {
      const rank = i + 1;
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
      const nameColor = rank === 1 ? '#fbbf24' : rank === 2 ? 'rgba(148,163,184,0.9)' : rank === 3 ? 'rgba(205,127,50,0.9)' : '#fff';
      const guild = p.guildName || (p.guild && !p.guild.startsWith('guild_') ? p.guild : '') || '—';
      return `<div class="lb-row" data-name="${(p.name||'').toLowerCase()}" data-guild="${guild.toLowerCase()}">
        <div class="lb-rank"><span style="font-size:${rank<=3?'1rem':'0.78rem'}">${medal}</span></div>
        <div><div class="lb-player-name" style="color:${nameColor}">${p.name||'—'}</div><div class="lb-player-sub">${p.class||'Warrior'}${p.prestige?` · ✦ P${p.prestige}`:''}</div></div>
        <div class="lb-stat">${p.level||'—'}</div>
        <div class="lb-stat">${(p.kills||0).toLocaleString()}</div>
        <div class="lb-stat desktop-only" style="font-size:0.75rem;color:rgba(255,255,255,0.3)">${guild}</div>
      </div>`;
    }).join('');
    tableWrap.innerHTML = (existingHeader ? existingHeader.outerHTML : '') + liveRows;
    // Re-attach search
    const s = document.getElementById('lb-search');
    if (s) s.dispatchEvent(new Event('input'));
  } catch {}
}
loadLeaderboard();

/* ── Live profile ── */
async function loadProfile() {
  const profileHeader = document.querySelector('.profile-header');
  if (!profileHeader) return;
  const token = localStorage.getItem('axr_token');
  if (!token) return;
  try {
    const res = await fetch(`${API}/api/profile`, { headers: authHeaders() });
    if (!res.ok) return;
    const p = await res.json();
    const nameEl = profileHeader.querySelector('h2');
    if (nameEl) nameEl.textContent = p.name || nameEl.textContent;
    // update quick stats
    const cells = profileHeader.querySelectorAll('.quick-stat-value');
    const vals = [p.kills, p.dungeons, p.pvpWins, p.pvpLosses, p.kd, p.solars, p.gems, p.prestige];
    cells.forEach((c, i) => { if (vals[i] != null) c.textContent = Number(vals[i]).toLocaleString(); });
  } catch {}
}
loadProfile();

/* ── On load: restore nav state ── */
updateNavForLoggedInUser();
