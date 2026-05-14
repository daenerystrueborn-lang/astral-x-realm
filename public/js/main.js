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
