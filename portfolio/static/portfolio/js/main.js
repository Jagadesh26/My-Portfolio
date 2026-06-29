/* ============================================================
   JAGADESH S PORTFOLIO — MAIN JS
   Animated Network Graph · Terminal Typing · Scroll Reveal
   ============================================================ */

'use strict';

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

    // update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // connect nodes close to each other
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

    // draw circles
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

(function initMouseGlow() {
  const glow = document.querySelector('.mouse-glow');
  if (!glow) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

(function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

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

  let lineIdx = 0;
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

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      setTimeout(nextLine, 500);
    }
  }, { threshold: 0.3 });

  observer.observe(body);
})();

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
      const json = await res.json().catch(() => ({
        success: false,
        error: `Request failed with status ${res.status}.`,
      }));

      if (res.ok && json.success) {
        status.className  = 'form-status success';
        status.textContent = json.message || '✅ Thank you! Your message has been received.';
        form.reset();
      } else {
        throw new Error(json.error || 'Something went wrong.');
      }
    } catch (err) {
      status.className  = 'form-status error';
      status.textContent = 'Error: ' + err.message;
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

(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

(function initAIAssistant() {
  const bubble = document.getElementById('ai-chat-bubble-btn');
  const container = document.getElementById('ai-chat-container');
  const closeBtn = document.getElementById('ai-chat-close-btn');
  const chatLogs = document.getElementById('ai-chat-logs');
  const userInput = document.getElementById('ai-chat-user-input');
  const sendBtn = document.getElementById('ai-chat-send-trigger');
  const suggestionsPanel = document.getElementById('chat-suggestions-panel');

  if (!bubble || !container || !chatLogs) return;

  // AI Knowledge Base dataset mapped exactly to provided context
  const qaDatabase = [
    {
      keywords: ["who is", "about", "bio", "summary", "profile", "personal details"],
      answer: "Jagadesh S is a Full Stack Developer with 1+ years of experience building enterprise applications using Python, Django, Django REST Framework, PostgreSQL, WebSockets, and Celery. He specializes in scalable backend systems, API development, database optimization, and real-time applications."
    },
    {
      keywords: ["tech", "technologies", "stack", "languages", "tools", "skills", "capabilities"],
      answer: "Jagadesh primarily works with Python, Django, Django REST Framework, PostgreSQL, MySQL, WebSocket, Celery, Docker, Git, and Linux."
    },
    {
      keywords: ["role", "current role", "company", "emayam", "where does", "current job"],
      answer: "Jagadesh currently works as a Backend Developer at Emayam Technologies Pvt Ltd, where he develops production-grade APIs, authentication systems, real-time applications, and cloud-integrated business solutions."
    },
    {
      keywords: ["projects", "what projects", "featured projects", "what has", "pms", "real estate"],
      answer: "His major projects include:<br><br>• <strong>Employee Monitoring System</strong> (Telemetry & screenshot tracking engine processing 50K+ daily events)<br>• <strong>Real Estate Property Management System</strong> (Multi-role portal which cut query read latency by 35%)<br><br>Both projects were developed using Python, Django, REST APIs, databases, and cloud integrations."
    },
    {
      keywords: ["employee", "monitoring", "employee monitoring", "screenshot", "telemetry"],
      answer: "The Employee Monitoring System is a productivity platform that tracks employee activities, captures screenshots, records screen activity, monitors application usage, supports real-time chat, integrates cloud storage, and automates reporting. The platform processes more than 50,000 activity events daily."
    },
    {
      keywords: ["real estate", "property", "property management", "real estate project"],
      answer: "The Real Estate Property Management System is a multi-role platform that enables buyers, sellers, customers, and administrators to manage properties, listings, searches, and digital assets through a secure and optimized system."
    },
    {
      keywords: ["django", "drf", "django rest framework", "experience with django"],
      answer: "Yes. Django and Django REST Framework are among Jagadesh's primary technologies. He has used them extensively for REST APIs, authentication systems, RBAC, cloud integrations, WebSockets, and enterprise application development."
    },
    {
      keywords: ["api", "apis", "rest", "rest api", "experience with apis", "development"],
      answer: "Yes. Jagadesh has built and maintained production-grade REST APIs for enterprise applications, including authentication APIs, business workflows, reporting systems, cloud integrations, and real-time features."
    },
    {
      keywords: ["database", "databases", "postgresql", "mysql", "sqlite", "query", "optimization"],
      answer: "Jagadesh has extensive experience with PostgreSQL and MySQL, including query optimization, indexing, performance tuning, backup strategies, and large dataset handling."
    },
    {
      keywords: ["strengths", "achievements", "engineering achievements", "impact"],
      answer: "Jagadesh's key strengths and engineering achievements include:<br><br>• Backend Development (Python, Django, DRF)<br>• REST API Design & JWT/RBAC security (12 production modules)<br>• Database Optimization (improving queries by ~40% across 1M+ rows)<br>• WebSocket real-time systems & Celery automation (slashing background task failures by ~90%)<br>• Cloud Storage Integrations (reducing manual handling by ~75%)<br>• Reducing code duplication by ~35% using reusable base class components."
    },
    {
      keywords: ["opportunities", "available", "hiring", "open to", "job", "status"],
      answer: "Yes. Jagadesh is actively open to opportunities and is looking for roles such as <strong>Full Stack Developer, Backend Developer, Python Developer, Django Developer, or Software Engineer</strong>."
    },
    {
      keywords: ["contact", "email", "phone", "linkedin", "how to contact", "connect", "information"],
      answer: "You can contact Jagadesh through:<br><br>✉️ Email: <a href='mailto:jagadesh2623@gmail.com' class='text-accent-blue underline'>jagadesh2623@gmail.com</a><br>🔗 LinkedIn: <a href='https://linkedin.com/in/jagadesh-s-030006218/' target='_blank' class='text-accent-blue underline'>linkedin.com/in/jagadesh-s</a><br>📞 Phone: +91 79046 57654"
    }
  ];

  // Quick Action Chips array
  const quickActions = [
    { label: "👨 About Jagadesh", query: "Who is Jagadesh?" },
    { label: "💼 Work Experience", query: "What is Jagadesh's current role?" },
    { label: "🚀 Featured Projects", query: "What projects has Jagadesh worked on?" },
    { label: "🛠 Technical Skills", query: "What technologies does Jagadesh use?" },
    { label: "🐍 Django Experience", query: "Does Jagadesh have experience with Django?" },
    { label: "⚡ API Development", query: "Does Jagadesh have experience with APIs?" },
    { label: "📊 Employee Monitoring System", query: "Tell me about the Employee Monitoring System." },
    { label: "🏠 Real Estate Project", query: "Tell me about the Real Estate Property Management System." },
    { label: "📈 Engineering Achievements", query: "What are Jagadesh's strengths?" },
    { label: "📄 Download Resume", query: "How can I contact Jagadesh?" },
    { label: "📧 Contact Information", query: "How can I contact Jagadesh?" }
  ];

  // Build the suggested chips in the panel
  function buildSuggestionChips() {
    if (!suggestionsPanel) return;
    suggestionsPanel.innerHTML = '';
    quickActions.forEach(action => {
      const chip = document.createElement('span');
      chip.className = 'suggestion-chip';
      chip.textContent = action.label;
      chip.addEventListener('click', () => {
        processQuery(action.query);
      });
      suggestionsPanel.appendChild(chip);
    });
  }

  // Toggle Visibility
  bubble.addEventListener('click', () => {
    container.classList.toggle('active');
    bubble.querySelector('.badge').style.display = 'none'; // Hide unread ping dot
  });

  closeBtn.addEventListener('click', () => {
    container.classList.remove('active');
  });

  // Query validation and execution engine
  function processQuery(queryText) {
    if (!queryText.trim()) return;

    // Output User message
    appendBubble(queryText, 'user');
    userInput.value = '';

    // Output Loader state
    const loader = appendBubble('<i class="fa-solid fa-circle-notch animate-spin text-xs"></i> Representative analyzing profile...', 'bot');
    chatLogs.scrollTop = chatLogs.scrollHeight;

    setTimeout(() => {
      loader.remove();
      const cleanText = queryText.toLowerCase().trim();
      let bestMatch = null;

      // Find the most relevant keyword array matches
      for (const item of qaDatabase) {
        const matches = item.keywords.some(keyword => cleanText.includes(keyword));
        if (matches) {
          bestMatch = item.answer;
          break;
        }
      }

      const reply = bestMatch || "I can answer questions regarding Jagadesh's professional profile, tech stack, and experience. Please try asking about his Django skills, projects, or strengths, or choose one of our Suggested Quick Actions chips above!";
      appendBubble(reply, 'bot');
      chatLogs.scrollTop = chatLogs.scrollHeight;
    }, 800);
  }

  function appendBubble(text, sender) {
    const bubbleEl = document.createElement('div');
    bubbleEl.className = `chat-bubble ${sender}`;
    bubbleEl.innerHTML = text;
    chatLogs.appendChild(bubbleEl);
    return bubbleEl;
  }

  // Triggers from Input
  sendBtn.addEventListener('click', () => processQuery(userInput.value));
  userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') processQuery(userInput.value);
  });

  // Initialize
  buildSuggestionChips();
})();
