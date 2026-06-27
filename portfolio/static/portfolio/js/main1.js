/* ============================================================
   JAGADESH S PORTFOLIO — MAIN JS
   Animated Network Graph · Terminal Typing · Scroll Reveal
   ============================================================ */

'use strict';

/* ── Network Graph Background Canvas ── */
(function initNetworkGraph() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes, raf;
  const NODE_COUNT = 70;
  const MAX_DIST   = 160;
  const COLORS     = ['#3B82F6', '#06B6D4', '#8B5CF6'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r:  Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.3,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // update
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${a})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color + Math.round(n.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  resize();
  createNodes();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); createNodes(); }, 150);
  });
})();


/* ── Mouse Glow ── */
(function initMouseGlow() {
  const glow = document.querySelector('.mouse-glow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


/* ── Sticky Navbar ── */
(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Mobile Menu ── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
})();


/* ── Active Nav Link on Scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ── Scroll Reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


/* ── Counter Animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1800;
      const start  = performance.now();

      function update(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ── Terminal Typing Animation ── */
(function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const lines = [
    { type: 'cmd',  text: 'whoami' },
    { type: 'out',  text: 'jagadesh-s', cls: 'green' },
    { type: 'cmd',  text: 'cat role.txt' },
    { type: 'out',  text: 'Full Stack Developer', cls: 'white' },
    { type: 'cmd',  text: 'echo $EXPERIENCE' },
    { type: 'out',  text: '1+ Years · Backend-First Engineering', cls: 'white' },
    { type: 'cmd',  text: 'echo $STACK' },
    { type: 'out',  text: 'Python · Django · DRF · PostgreSQL · WebSocket · Celery', cls: 'cyan' },
    { type: 'cmd',  text: 'echo $LOCATION' },
    { type: 'out',  text: 'Chennai, India 🇮🇳', cls: 'white' },
    { type: 'cmd',  text: 'git status' },
    { type: 'out',  text: 'On branch: main  ·  Status: Open To Opportunities ✓', cls: 'green' },
  ];

  let lineIdx = 0, charIdx = 0;
  let currentEl = null;

  function nextLine() {
    if (lineIdx >= lines.length) {
      appendCursor();
      return;
    }
    const line = lines[lineIdx];
    const wrapper = document.createElement('div');
    wrapper.className = 'term-line';

    if (line.type === 'cmd') {
      const row = document.createElement('span');
      row.className = 'term-prompt';
      row.innerHTML = '<span class="dollar">$</span>';
      currentEl = document.createElement('span');
      row.appendChild(currentEl);
      wrapper.appendChild(row);
    } else {
      currentEl = document.createElement('span');
      currentEl.className = `term-output ${line.cls || ''}`;
      wrapper.appendChild(currentEl);
    }

    body.appendChild(wrapper);
    typeChar(line.text, 0, () => {
      lineIdx++;
      charIdx = 0;
      setTimeout(nextLine, line.type === 'cmd' ? 120 : 80);
    });
  }

  function typeChar(text, idx, done) {
    if (idx >= text.length) { done(); return; }
    currentEl.textContent += text[idx];
    body.scrollTop = body.scrollHeight;
    setTimeout(() => typeChar(text, idx + 1, done), 28 + Math.random() * 22);
  }

  function appendCursor() {
    const row = document.createElement('div');
    row.className = 'term-line';
    row.innerHTML = '<span class="term-prompt"><span class="dollar">$</span></span><span class="term-cursor"></span>';
    body.appendChild(row);
  }

  // start when terminal scrolls into view
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      setTimeout(nextLine, 500);
    }
  }, { threshold: 0.3 });

  observer.observe(body);
})();


/* ── Contact Form ── */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('form-submit');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'form-status';

    const data = {
      name:    form.querySelector('[name="name"]').value.trim(),
      email:   form.querySelector('[name="email"]').value.trim(),
      subject: form.querySelector('[name="subject"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim(),
    };

    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch('/contact/', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success) {
        status.className  = 'form-status success';
        status.textContent = '✓ ' + json.message;
        form.reset();
      } else {
        throw new Error(json.error || 'Something went wrong.');
      }
    } catch (err) {
      status.className  = 'form-status error';
      status.textContent = '✗ ' + err.message;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });

  function getCookie(name) {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : '';
  }
})();


/* ── Back To Top ── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
