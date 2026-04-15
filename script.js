/* ═══════════════════════════════════════════════
   YASSINE MENAD — PORTFOLIO SCRIPT.JS
   Particles Canvas | Terminal Typewriter | Tilt 3D
   ═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   1. PARTICLE NETWORK CANVAS
   ───────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  const CONFIG = {
    particleCount: 90,
    maxSpeed:      0.55,
    minRadius:     1.5,
    maxRadius:     3.2,
    connectionDist: 140,
    mouseInfluence: 160,
    accentColor:   '0, 255, 140',
    accentBlue:    '0, 212, 255',
    baseAlpha:     0.55,
  };

  let W, H, particles, mouse;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const speed  = (Math.random() * 2 - 1) * CONFIG.maxSpeed;
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() * 2 - 1) * CONFIG.maxSpeed,
      vy: (Math.random() * 2 - 1) * CONFIG.maxSpeed,
      r:  CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      color: Math.random() < 0.7 ? CONFIG.accentColor : CONFIG.accentBlue,
      alpha: 0.35 + Math.random() * 0.5,
    };
  }

  function initParticlesArr() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(createParticle());
    }
  }

  mouse = { x: -9999, y: -9999 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
    ctx.fill();
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      // Particle–particle connections
      for (let j = i + 1; j < particles.length; j++) {
        const b    = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < CONFIG.connectionDist) {
          const alpha = (1 - dist / CONFIG.connectionDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.color}, ${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }

      // Mouse–particle connections
      const mdist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (mdist < CONFIG.mouseInfluence) {
        const alpha = (1 - mdist / CONFIG.mouseInfluence) * 0.65;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${a.color}, ${alpha})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }
    }
  }

  function updateParticle(p) {
    // Mouse repulsion
    const mdist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (mdist < CONFIG.mouseInfluence * 0.8) {
      const force = (CONFIG.mouseInfluence * 0.8 - mdist) / (CONFIG.mouseInfluence * 0.8);
      const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
      p.vx += Math.cos(angle) * force * 0.04;
      p.vy += Math.sin(angle) * force * 0.04;
    }

    // Speed cap
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > CONFIG.maxSpeed * 2.5) {
      p.vx = (p.vx / speed) * CONFIG.maxSpeed * 2.5;
      p.vy = (p.vy / speed) * CONFIG.maxSpeed * 2.5;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Wrap edges
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;
    if (p.y < -10) p.y = H + 10;
    if (p.y > H + 10) p.y = -10;
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      updateParticle(p);
      drawParticle(p);
    });
    requestAnimationFrame(loop);
  }

  resize();
  initParticlesArr();
  loop();

  window.addEventListener('resize', () => {
    resize();
    initParticlesArr();
  });
})();


/* ─────────────────────────────────────────────
   2. TERMINAL TYPEWRITER ANIMATION
   ───────────────────────────────────────────── */
(function initTerminal() {
  const cmdEl   = document.getElementById('cmd-whoami');
  const cursor1 = document.getElementById('cursor-1');
  const output  = document.getElementById('output-area');

  // Lines to type in the "whoami" command
  const COMMAND  = 'whoami --verbose';
  const DELAY_BEFORE_OUTPUT = 500;
  const TYPE_SPEED = 65;       // ms per char
  const OUTPUT_LINE_DELAY = 80; // ms between output lines

  // Terminal output structure
  const OUTPUT_LINES = [
    { cls: 'blank' },
    { cls: 'comment', text: '# ─────────────────────────────────────────' },
    { cls: 'comment', text: '#   Yassine MENAD — Profil complet' },
    { cls: 'comment', text: '# ─────────────────────────────────────────' },
    { cls: 'blank' },
    { cls: 'key-val', key: 'name         ', val: 'Yassine MENAD' },
    { cls: 'key-val', key: 'role         ', val: 'Technicien Informatique / Étudiant BTS SIO SISR' },
    { cls: 'key-val', key: 'location     ', val: 'Metz, France' },
    { cls: 'key-val', key: 'phone        ', val: '06 56 86 53 45' },
    { cls: 'key-val', key: 'email        ', val: 'yassinemenad04@gmail.com' },
    { cls: 'blank' },
    { cls: 'key-val', key: 'status       ', val: '🟢 EN RECHERCHE D\'ALTERNANCE — Disponible immédiatement' },
    { cls: 'key-val', key: 'rhythm       ', val: '4 jours/semaine en entreprise (très avantageux)' },
    { cls: 'blank' },
    { cls: 'comment', text: '#   Compétences clés' },
    { cls: 'key-val', key: 'systems      ', val: 'Linux, Windows' },
    { cls: 'key-val', key: 'networks     ', val: 'Switch · Routeur · Firewall · LAN/VLAN' },
    { cls: 'key-val', key: 'dev          ', val: 'C · C++ · HTML/CSS · SQL' },
    { cls: 'key-val', key: 'tools        ', val: 'Git · GitLab · GitHub' },
    { cls: 'blank' },
    { cls: 'cmd2', text: 'Press ↓ to explore the portfolio...' },
  ];

  let charIndex = 0;

  function typeCommand() {
    if (charIndex < COMMAND.length) {
      cmdEl.textContent += COMMAND[charIndex++];
      setTimeout(typeCommand, TYPE_SPEED + Math.random() * 30 - 15);
    } else {
      // Hide blinking cursor after command is done, wait then show output
      cursor1.style.display = 'none';
      setTimeout(showOutput, DELAY_BEFORE_OUTPUT);
    }
  }

  function showOutput() {
    output.style.display = 'block';
    let lineIndex = 0;

    function printNextLine() {
      if (lineIndex >= OUTPUT_LINES.length) return;

      const data = OUTPUT_LINES[lineIndex++];
      const el   = document.createElement('div');
      el.classList.add('output-line');

      if (data.cls === 'blank') {
        el.classList.add('blank');
      } else if (data.cls === 'comment') {
        el.classList.add('comment');
        el.textContent = data.text;
      } else if (data.cls === 'key-val') {
        el.classList.add('key');
        el.innerHTML =
          `<span class="key">${data.key}</span><span style="color:#4a4a4a"> : </span><span class="val">${data.val}</span>`;
      } else if (data.cls === 'cmd2') {
        el.classList.add('comment');
        el.style.cssText = 'color:#4a4a4a; font-style:italic; margin-top:0.3rem;';
        el.textContent = data.text;
      }

      output.appendChild(el);
      el.scrollIntoView({ block: 'nearest' });

      setTimeout(printNextLine, OUTPUT_LINE_DELAY);
    }

    printNextLine();
  }

  // Start after a short delay (let canvas render first)
  setTimeout(typeCommand, 900);
})();


/* ─────────────────────────────────────────────
   3. NAVBAR: scroll shrink + active link
   ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  const toggle    = document.getElementById('nav-toggle');
  const navList   = document.querySelector('.nav-links');

  // Scroll shrink
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActive();
  }, { passive: true });

  // Active link highlight (IntersectionObserver)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const target = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
        if (target) target.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));

  function highlightActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });
  }

  // Mobile menu
  toggle.addEventListener('click', () => {
    navList.classList.toggle('open');
    const isOpen = navList.classList.contains('open');
    toggle.querySelector('span:nth-child(1)').style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    toggle.querySelector('span:nth-child(2)').style.opacity   = isOpen ? '0' : '';
    toggle.querySelector('span:nth-child(3)').style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });
})();


/* ─────────────────────────────────────────────
   4. SCROLL FADE-IN (Intersection Observer)
   ───────────────────────────────────────────── */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();


/* ─────────────────────────────────────────────
   5. BENTO CARD — 3D TILT + GLOW FOLLOW
   ───────────────────────────────────────────── */
(function initTilt() {
  const TILT_MAX   = 12;  // degrees
  const SCALE      = 1.03;
  const PERSPECTIVE = 900;

  document.querySelectorAll('.tilt-card').forEach(card => {
    const glow = card.querySelector('.bento-card-glow');

    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -TILT_MAX;
      const rotateY = ((x - cx) / cx) *  TILT_MAX;

      card.style.transform =
        `perspective(${PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${SCALE})`;

      // Move glow to cursor position
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top  = `${y}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();


/* ─────────────────────────────────────────────
   6. INTERACTIVE TERMINAL — commandes cv / download
   ───────────────────────────────────────────── */
(function initInteractiveTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const CV_FILE      = 'CV_Yassine_Menad.pdf';

  // Déclenche le téléchargement du CV
  function downloadCV() {
    const link   = document.createElement('a');
    link.href    = CV_FILE;
    link.download = CV_FILE;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Ajoute une ligne de réponse dans le terminal
  function appendTerminalLine(html, cls) {
    const line = document.createElement('div');
    line.classList.add('output-line');
    if (cls) line.classList.add(cls);
    line.innerHTML = html;
    terminalBody.appendChild(line);
    line.scrollIntoView({ block: 'nearest' });
  }

  // Crée une ligne de prompt interactive
  function createInputLine() {
    const inputLine = document.createElement('div');
    inputLine.classList.add('terminal-line');
    inputLine.style.marginTop = '0.6rem';

    const prompt = document.createElement('span');
    prompt.classList.add('prompt');
    prompt.textContent = 'yassine@portfolio:~$';

    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('terminal-input');
    input.setAttribute('aria-label', 'Terminal input');
    input.style.cssText =
      'background:transparent;border:none;outline:none;color:#e8e8e8;' +
      'font-family:var(--font-mono);font-size:inherit;caret-color:var(--accent);' +
      'flex:1;min-width:0;padding:0;';

    inputLine.appendChild(prompt);
    inputLine.appendChild(input);
    terminalBody.appendChild(inputLine);
    inputLine.scrollIntoView({ block: 'nearest' });

    // Auto-focus à chaque clic dans le terminal
    terminalBody.addEventListener('click', () => input.focus(), { once: false });
    setTimeout(() => input.focus(), 100);

    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();

      const raw = input.value.trim();
      const cmd = raw.toLowerCase();

      // Figer la ligne de saisie
      input.disabled = true;
      input.style.color = '#e8e8e8';

      // Traitement des commandes
      if (cmd === 'cv' || cmd === 'download') {
        downloadCV();
        appendTerminalLine(
          `<span class="val">✔ Téléchargement de <strong>${CV_FILE}</strong> lancé...</span>`,
          'val'
        );
        // Lien de secours visible dans le terminal
        appendTerminalLine(
          `<span style="color:var(--text-secondary)">→ Si le téléchargement ne démarre pas, </span>` +
          `<a href="${CV_FILE}" download style="color:var(--accent);text-decoration:underline;">cliquez ici</a>.`
        );
      } else if (cmd === 'help') {
        appendTerminalLine(
          `<span class="comment"># Commandes disponibles :</span>`, 'comment'
        );
        appendTerminalLine(
          `&nbsp;&nbsp;<span class="val">cv</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
          `<span style="color:var(--text-secondary)">— télécharge CV_Yassine_Menad.pdf</span>`
        );
        appendTerminalLine(
          `&nbsp;&nbsp;<span class="val">download</span> &nbsp;&nbsp;` +
          `<span style="color:var(--text-secondary)">— alias de cv</span>`
        );
        appendTerminalLine(
          `&nbsp;&nbsp;<span class="val">whoami</span> &nbsp;&nbsp;&nbsp;` +
          `<span style="color:var(--text-secondary)">— profil complet</span>`
        );
        appendTerminalLine(
          `&nbsp;&nbsp;<span class="val">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;` +
          `<span style="color:var(--text-secondary)">— effacer le terminal</span>`
        );
      } else if (cmd === 'whoami') {
        appendTerminalLine(`<span class="val">Yassine MENAD — Technicien Informatique / BTS SIO SISR</span>`);
      } else if (cmd === 'clear') {
        const outputArea = document.getElementById('output-area');
        if (outputArea) outputArea.innerHTML = '';
        // Retire toutes les lignes de réponse précédentes sauf la ligne fixée
        terminalBody.querySelectorAll('.output-line, .terminal-line:not(:first-child)').forEach(el => {
          if (!el.contains(input)) el.remove();
        });
      } else if (cmd !== '') {
        appendTerminalLine(
          `<span style="color:#ff5f57">bash: ${raw.replace(/</g,'&lt;')}: commande introuvable</span>` +
          `<span style="color:var(--text-muted)"> (tapez <span style="color:var(--accent)">help</span> pour la liste)</span>`
        );
      }

      // Nouvelle ligne de saisie
      createInputLine();
    });
  }

  // Lance la ligne interactive une fois l'animation terminée (après ~4s)
  setTimeout(createInputLine, 4500);
})();

/* ─────────────────────────────────────────────
   7. FILTRES TECHNOLOGIES & OUTILS
   ───────────────────────────────────────────── */
(function initTechFilters() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const techCards  = document.querySelectorAll('.tech-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Gérer l'état actif des boutons
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // 2. Filtrer les cartes
      const filterValue = btn.getAttribute('data-filter');

      techCards.forEach(card => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.classList.remove('hidden');
          // Petit délai pour l'animation après avoir retiré display:none
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          // Attendre la fin de l'animation pour cacher au layout (display:none)
          setTimeout(() => {
            if (!btn.classList.contains('active')) return; // check s'il n'a pas re-cliqué entre temps
            card.classList.add('hidden');
          }, 400); // 400ms = durée transition CSS
        }
      });
    });
  });
})();

/* ─────────────────────────────────────────────
   8. FILTRES PROJETS PORTFOLIO
   ───────────────────────────────────────────── */
(function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const projCards  = document.querySelectorAll('.port-card');
  const countEl    = document.getElementById('proj-counter');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actif button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;
      let visibleCount = 0;

      projCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 10);
          visibleCount++;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            if (!btn.classList.contains('active')) return;
            card.classList.add('hidden');
          }, 400);
        }
      });
      
      // Update counter
      countEl.textContent = visibleCount;
    });
  });
})();
