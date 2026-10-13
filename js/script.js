// ==========================================================================
// Leizel Abana — Portfolio Site
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Tool chip logos: brand icon when one exists, plain text otherwise ----
  // Looked up by the chip's exact label, pulled from the Simple Icons CDN.
  // If a slug is wrong or missing on the CDN, the image 404s and removes
  // itself — the label text (already in the chip) is the fallback.
  const CHIP_ICON_SLUGS = {
    'Figma': 'figma',
    'Canva': 'canva',
    'WordPress': 'wordpress',
    'Shopify': 'shopify',
    'Squarespace': 'squarespace',
    'HubSpot': 'hubspot',
    'Webflow': 'webflow',
    'Wix': 'wix',
    'Mailchimp': 'mailchimp',
    'PHP': 'php',
    'Laravel': 'laravel',
    'HTML': 'html5',
    'CSS': 'css3',
    'React JS': 'react',
    'Node JS': 'nodedotjs',
    'Zapier': 'zapier',
    'Make.com': 'make',
    'Zoho': 'zoho',
    'AWS': 'amazonaws',
    'Firebase': 'firebase',
    'MySQL': 'mysql',
    'MongoDB': 'mongodb',
    'PostgreSQL': 'postgresql',
    'Digital Ocean': 'digitalocean',
    'Hostinger': 'hostinger',
    'GoDaddy': 'godaddy',
    'Cloudflare': 'cloudflare',
    'GitHub': 'github',
    'GitLab': 'gitlab',
    'Bitbucket': 'bitbucket',
    'Google Search Console': 'googlesearchconsole',
    'Google Analytics': 'googleanalytics',
    'Yoast SEO': 'yoast',
    'SEMrush': 'semrush',
    'Ahrefs': 'ahrefs',
    'ChatGPT': 'openai',
    'Claude': 'claude',
    'Perplexity.ai': 'perplexity',
  };

  document.querySelectorAll('.chip').forEach((chip) => {
    const slug = CHIP_ICON_SLUGS[chip.textContent.trim()];
    if (!slug) return;
    const img = document.createElement('img');
    img.src = `https://cdn.simpleicons.org/${slug}`;
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'chip-icon';
    img.onerror = () => img.remove();
    chip.prepend(img);
  });

  // Metrics strip is now a pure-CSS continuously scrolling marquee — no JS needed.

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('main section[id], header#top');
  const navLinks = document.querySelectorAll('.nav-link');

  const setActiveLink = () => {
    let currentId = 'top';
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ---- Scroll-reveal animation ----
  const animatedEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach((el) => observer.observe(el));
  } else {
    animatedEls.forEach((el) => el.classList.add('in-view'));
  }

  // ---- Portfolio filtering ----
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.port-card');
  const resultsCount = document.getElementById('results-count');

  // Tally how many cards belong to each category and label each filter pill.
  const counts = { all: portfolioCards.length };
  portfolioCards.forEach((card) => {
    const cat = card.dataset.cat;
    counts[cat] = (counts[cat] || 0) + 1;
  });
  filterButtons.forEach((btn) => {
    const countEl = btn.querySelector('.filter-count');
    if (countEl) countEl.textContent = counts[btn.dataset.filter] || 0;
  });

  const updateResultsCount = (visible) => {
    if (!resultsCount) return;
    resultsCount.textContent = `Showing ${visible} project${visible === 1 ? '' : 's'}`;
  };

  const applyFilter = (filter) => {
    let visibleIndex = 0;

    portfolioCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.cat === filter;

      if (match) {
        card.classList.remove('hidden');
        card.style.animationDelay = `${visibleIndex * 35}ms`;
        // restart the pop animation even if it already played once
        card.classList.remove('pop');
        void card.offsetWidth;
        card.classList.add('pop');
        visibleIndex += 1;
      } else {
        card.classList.add('hidden');
      }
    });

    updateResultsCount(visibleIndex);
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  applyFilter('all');

  // ---- Contact section "Figma Design Work" link: jump to Portfolio and
  // pre-select the Figma filter tab, rather than just landing on "All" ----
  const figmaLink = document.getElementById('figma-link');
  const figmaFilterBtn = document.querySelector('.filter-btn[data-filter="figma"]');
  if (figmaLink && figmaFilterBtn) {
    figmaLink.addEventListener('click', () => figmaFilterBtn.click());
  }

  // ---- Career roadmap: criss-cross connector that draws itself on scroll ----
  const roadmap = document.querySelector('.roadmap');

  if (roadmap) {
    const svg = roadmap.querySelector('.roadmap-line');
    const path = roadmap.querySelector('#roadmap-path');
    const items = [...roadmap.querySelectorAll('.roadmap-item')];
    const ROADMAP_BREAKPOINT = 700; // matches the CSS breakpoint that swaps to a straight line
    let pathLength = 0;
    let points = [];
    let pointLengths = [];

    // Length along the path at which it reaches height y (y only ever increases).
    const lengthAtY = (y) => {
      let lo = 0;
      let hi = pathLength;
      for (let i = 0; i < 24; i += 1) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
      }
      return hi;
    };

    const buildPath = () => {
      if (!svg || !path || !items.length) return;

      const totalHeight = roadmap.offsetHeight;
      if (!totalHeight) return;

      // Layout positions (offsetTop) ignore the cards' slide-in transform, so
      // the line always meets the dots exactly, even before they've animated in.
      // x comes from the dots themselves, so the line passes through their centres.
      const svgLeft = svg.getBoundingClientRect().left;
      points = items.map((item) => {
        const dot = item.querySelector('.roadmap-dot');
        const dotRect = dot ? dot.getBoundingClientRect() : null;
        return {
          x: dotRect ? dotRect.left + dotRect.width / 2 - svgLeft : (item.classList.contains('roadmap-left') ? 0 : 80),
          y: item.offsetTop + item.offsetHeight / 2,
        };
      });

      // Mobile's straight CSS line runs from the first dot to the last, no further.
      roadmap.style.setProperty('--line-top', `${points[0].y}px`);
      roadmap.style.setProperty('--line-bottom', `${totalHeight - points[points.length - 1].y}px`);

      if (window.innerWidth <= ROADMAP_BREAKPOINT) return; // mobile uses the plain CSS line instead

      const gutter = 80;
      svg.setAttribute('viewBox', `0 0 ${gutter} ${totalHeight}`);

      let d = `M${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i += 1) {
        const prev = points[i - 1];
        const curr = points[i];
        const midY = (prev.y + curr.y) / 2;
        d += ` C${prev.x},${midY} ${curr.x},${midY} ${curr.x},${curr.y}`;
      }
      path.setAttribute('d', d);

      pathLength = path.getTotalLength();
      pointLengths = points.map((p, i) => {
        if (i === 0) return 0;
        if (i === points.length - 1) return pathLength;
        return lengthAtY(p.y);
      });
      path.style.strokeDasharray = String(pathLength);
      path.classList.add('ready');
      updateRoadmapProgress();
    };

    // The line grows dot-to-dot: it always stops exactly on the last lit dot
    // rather than ending mid-air at an arbitrary scroll position.
    const updateRoadmapProgress = () => {
      if (!path || window.innerWidth <= ROADMAP_BREAKPOINT || !pathLength) return;

      const rect = roadmap.getBoundingClientRect();
      const readingLine = window.innerHeight * 0.65 - rect.top;
      let lastLit = -1;
      points.forEach((p, i) => { if (p.y <= readingLine) lastLit = i; });

      path.style.strokeDashoffset = String(lastLit < 0 ? pathLength : pathLength - pointLengths[lastLit]);

      items.forEach((item, i) => {
        const dot = item.querySelector('.roadmap-dot');
        if (dot) dot.classList.toggle('lit', i <= lastLit);
      });
    };

    let roadmapTicking = false;
    window.addEventListener('scroll', () => {
      if (!roadmapTicking) {
        window.requestAnimationFrame(() => {
          updateRoadmapProgress();
          roadmapTicking = false;
        });
        roadmapTicking = true;
      }
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildPath, 150);
    });

    window.addEventListener('load', buildPath);
    buildPath();
  }

  // ---- Scroll parallax for the floating shapes & blobs ----
  // Each layer drifts on its own ambient CSS animation already; this adds a
  // second, scroll-linked motion on top so the whole layer visibly shifts as
  // you scroll past it, instead of only bobbing gently in place.
  const parallaxLayers = [
    ...[...document.querySelectorAll('.floaties')].map((el) => ({ el, speed: 0.16 })),
    ...[...document.querySelectorAll('.blob-layer')].map((el) => ({ el, speed: 0.08 })),
  ];

  if (parallaxLayers.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Capped so shapes never slide past their section's edge and get sliced.
    const MAX_SHIFT = 40;
    const updateParallax = () => {
      const vh = window.innerHeight;
      parallaxLayers.forEach(({ el, speed }) => {
        // Measure the section, not the layer itself, so the layer's own
        // transform doesn't feed back into the next calculation.
        const rect = el.parentElement.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return; // skip offscreen layers
        const centerDelta = (rect.top + rect.height / 2) - vh / 2;
        const shift = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, centerDelta * speed));
        el.style.transform = `translateY(${shift.toFixed(1)}px)`;
      });
    };

    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  // ---- Floating "Email Me" button: hide once the real Contact card is on screen ----
  const emailFab = document.getElementById('email-fab');
  const contactSection = document.getElementById('contact');

  if (emailFab && contactSection && 'IntersectionObserver' in window) {
    const fabObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        emailFab.classList.toggle('is-hidden', entry.isIntersecting);
      });
    }, { threshold: 0.25 });

    fabObserver.observe(contactSection);
  }

});
