/**
 * Tecnoterm UI controller.
 * Handles hero motion, navigation, modals and scroll interactions.
 */

function initApp() {
  // 1. Core Navigation & Inertial Motion
  initSmoothScroll();
  initHeader();
  initMobileDrawer();
  initScrollSpy();

  // 2. Landing Page Interactive Modules
  initHeroCinematic();
  initHeroScrollTransition();
  initExperiencePillars();
  initServicesHorizontalScroll();
  initPhotoContinuousCarousel();
  initScrollReveals();
  initMagneticAndTilt();
  initFooterLogoZoomReveal();

  // 3. Dedicated Services Page (servizi.html)
  initSplitServicesShowcase();
  initServicesQuoteButtonVisibility();

  // 4. Global Accessibility & Modal Dialogs
  initGalleryLightbox();
  initPrivacyModal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* --------------------------------------------------------------------------
   Header: Gestione trasparenza e visualizzazione tasto Home
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const hero = document.getElementById('hero');
  if (!hero) {
    header.classList.add('is-scrolled');
    return;
  }

  const handleScroll = () => {
    const triggerThreshold = hero.offsetHeight * 0.65;
    if (window.scrollY > triggerThreshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   Menu: Apertura, chiusura e navigazione popup
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const menuBtn = document.getElementById('hero-menu-btn');
  const menuPopup = document.getElementById('compactMenuPopup');
  const pillBar = document.getElementById('heroCenterPillBar');
  const btnLabel = document.getElementById('menuBtnLabel');
  const hamburgerIcon = document.getElementById('menuHamburgerIcon');

  if (!menuBtn || !menuPopup) return;

  let closeTimer = null;

  const openMenu = () => {
    clearTimeout(closeTimer);
    menuPopup.classList.add('is-open');
    menuPopup.setAttribute('aria-hidden', 'false');
    menuBtn.classList.add('is-active');
    menuBtn.setAttribute('aria-expanded', 'true');

    if (btnLabel) btnLabel.textContent = 'Chiudi';
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
  };

  const closeMenu = () => {
    menuPopup.classList.remove('is-open');
    menuPopup.setAttribute('aria-hidden', 'true');
    menuBtn.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');

    if (btnLabel) btnLabel.textContent = 'Menu';
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML = `<span></span><span></span>`;
    }
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeMenu, 240);
  };

  if (pillBar) {
    pillBar.addEventListener('mouseenter', openMenu);
    pillBar.addEventListener('mouseleave', scheduleClose);

    const homeBtn = document.getElementById('heroHomeBtn');
    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        closeMenu();
      });
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menuPopup.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (pillBar && !pillBar.contains(e.target) && menuPopup.classList.contains('is-open')) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuPopup.classList.contains('is-open')) {
      closeMenu();
    }
  });

  const navLinks = menuPopup.querySelectorAll('.compact-nav-link, .compact-contact-btn');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      closeMenu();

      if (href && href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => {
          if (href === '#' || href === '#hero') {
            if (typeof globalLenis !== 'undefined' && globalLenis) {
              globalLenis.scrollTo(0, { duration: 1.2 });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            const targetEl = document.querySelector(href);
            if (targetEl) {
              if (typeof globalLenis !== 'undefined' && globalLenis) {
                globalLenis.scrollTo(targetEl, { offset: -60, duration: 1.2 });
              } else {
                targetEl.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }
        }, 120);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   ScrollSpy: Indicatore del link di navigazione attivo
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.compact-nav-link');
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('is-active');
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   Lightbox: Visualizzatore immagini galleria
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const backdrop = document.getElementById('lightbox-backdrop');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (!modal || !modalImg || !triggers.length) return;

  const openLightbox = (imgSrc, imgAlt) => {
    modalImg.src = imgSrc;
    modalImg.alt = imgAlt || '';
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const img = trigger.querySelector('img');
      const imgSrc = trigger.getAttribute('href') || (img ? img.src : '');
      const imgAlt = img ? img.alt : '';
      openLightbox(imgSrc, imgAlt);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   Privacy & Cookie Policy: Apertura e chiusura modale informativa
   -------------------------------------------------------------------------- */
function initPrivacyModal() {
  const modal = document.getElementById('privacy-modal');
  const title = document.getElementById('privacy-modal-title');
  const body = document.getElementById('privacy-modal-body');
  const closeBtn = document.getElementById('privacy-close');
  const backdrop = document.getElementById('privacy-backdrop');

  if (!modal) return;

  window.openPrivacyModal = (type) => {
    if (type === 'privacy') {
      title.textContent = 'Informativa sulla Privacy (GDPR)';
      body.innerHTML = `
        <p><strong>Tecnoterm di Valenza</strong>, con sede in Via San Francesco D'Assisi, 1 - 46020 Pegognaga (MN), P.IVA 00177020203, in qualità di Titolare del trattamento, garantisce che i dati personali raccolti tramite il presente sito web sono trattati in conformità al Regolamento UE 2016/679 (GDPR).</p>
        <p style="margin-top: 10px;">I dati forniti spontaneamente per mezzo del modulo contatti (nome, telefono, email, note di richiesta) vengono utilizzati al solo scopo di fornire informazioni, preventivi e assistenza tecnica per gli impianti richiesti. Non vengono ceduti a terzi per scopi di marketing né diffusi.</p>
        <p style="margin-top: 10px;">Per qualsiasi richiesta di rettifica o cancellazione, è possibile contattare l'azienda all'indirizzo email: <strong>tecnoterm.valenza@gmail.com</strong>.</p>
      `;
    } else {
      title.textContent = 'Cookie Policy';
      body.innerHTML = `
        <p>Il presente sito web utilizza unicamente cookie tecnici necessari per il corretto funzionamento della navigazione e per garantire l'accessibilità dei moduli interattivi.</p>
        <p style="margin-top: 10px;">Non sono attivi cookie di profilazione di terze parti a scopi pubblicitari. La navigazione all'interno del sito implica l'accettazione dei soli cookie tecnici essenziali.</p>
      `;
    }
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   Galleria 50 Anni: Marquee orizzontale continuo con pausa al passaggio
   -------------------------------------------------------------------------- */
function initPhotoContinuousCarousel() {
  const container = document.getElementById('photoMarqueeContainer');
  if (!container) return;
  const track = container.querySelector('.photo-marquee-track');
  if (!track) return;

  container.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  container.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });

  container.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  container.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Servizi: Scorrimento orizzontale, navigazione a punti e drag
   -------------------------------------------------------------------------- */
function initServicesHorizontalScroll() {
  const section = document.getElementById('servizi');
  if (!section) return;

  const track = section.querySelector('.services-cards-track');
  const viewport = section.querySelector('.services-track-viewport');
  const dots = section.querySelectorAll('.service-dot');
  const cards = section.querySelectorAll('.service-scroll-card');
  const prevBtn = document.getElementById('servicesPrevBtn');
  const nextBtn = document.getElementById('servicesNextBtn');

  if (!track || !viewport || !cards.length) return;

  let currentActiveStep = 0;
  let isProgrammaticScrolling = false;
  let scrollTimeoutId = null;

  let cachedCardCenters = [];
  let cachedTargetLefts = [];
  let cachedMaxScroll = 0;

  const measurePositions = () => {
    cachedMaxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const trackLeft = track.offsetLeft;
    const vpWidth = viewport.clientWidth;

    cachedCardCenters = Array.from(cards).map((card) => {
      return (card.offsetLeft - trackLeft) + card.offsetWidth * 0.5;
    });

    cachedTargetLefts = Array.from(cards).map((card, idx) => {
      if (idx === 0) return 0;
      if (idx === cards.length - 1) return cachedMaxScroll;
      const targetLeft = (card.offsetLeft - trackLeft) - (vpWidth - card.offsetWidth) / 2;
      return Math.max(0, Math.min(targetLeft, cachedMaxScroll));
    });
  };

  const updateActiveDot = (stepIndex) => {
    const nextStep = Math.max(0, Math.min(cards.length - 1, stepIndex));
    if (nextStep === currentActiveStep && cards[nextStep] && cards[nextStep].classList.contains('is-active')) {
      return;
    }
    currentActiveStep = nextStep;

    dots.forEach((dot, idx) => {
      if (idx === currentActiveStep) {
        dot.classList.add('is-active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('is-active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    cards.forEach((card, idx) => {
      if (idx === currentActiveStep) {
        card.classList.add('is-active');
        card.setAttribute('aria-current', 'true');
      } else {
        card.classList.remove('is-active');
        card.removeAttribute('aria-current');
      }
    });

    if (prevBtn) prevBtn.disabled = currentActiveStep === 0;
    if (nextBtn) nextBtn.disabled = currentActiveStep === cards.length - 1;
  };

  const scrollToStep = (stepIndex) => {
    if (cachedTargetLefts.length === 0) measurePositions();
    const targetScroll = cachedTargetLefts[stepIndex];
    if (targetScroll === undefined) return;

    isProgrammaticScrolling = true;
    updateActiveDot(stepIndex);

    viewport.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    clearTimeout(scrollTimeoutId);
    scrollTimeoutId = setTimeout(() => {
      isProgrammaticScrolling = false;
    }, 450);
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      scrollToStep(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentActiveStep > 0) {
        scrollToStep(currentActiveStep - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentActiveStep < cards.length - 1) {
        scrollToStep(currentActiveStep + 1);
      }
    });
  }

  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (idx !== currentActiveStep) {
        scrollToStep(idx);
      }
    });
  });

  viewport.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.stopPropagation();
    }
  }, { passive: true });

  let rafScrollId = null;
  viewport.addEventListener('scroll', () => {
    if (isProgrammaticScrolling) return;

    if (rafScrollId) cancelAnimationFrame(rafScrollId);
    rafScrollId = requestAnimationFrame(() => {
      const scrollLeft = viewport.scrollLeft;
      const vpCenter = scrollLeft + viewport.clientWidth * 0.5;

      if (scrollLeft <= 20) {
        updateActiveDot(0);
        return;
      }
      if (scrollLeft >= cachedMaxScroll - 20) {
        updateActiveDot(cards.length - 1);
        return;
      }

      let closestIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < cachedCardCenters.length; i++) {
        const dist = Math.abs(cachedCardCenters[i] - vpCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }
      updateActiveDot(closestIdx);
    });
  }, { passive: true });

  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;

  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('a') || e.target.closest('button')) return;
    isDragging = true;
    hasDragged = false;
    startX = e.pageX - viewport.offsetLeft;
    scrollStart = viewport.scrollLeft;
    viewport.style.cursor = 'grabbing';
    viewport.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.35;
    if (Math.abs(walk) > 4) {
      hasDragged = true;
    }
    viewport.scrollLeft = scrollStart - walk;
  });

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.cursor = '';
    viewport.style.userSelect = '';
    setTimeout(() => {
      hasDragged = false;
    }, 50);
  };

  window.addEventListener('mouseup', endDrag);
  window.addEventListener('mouseleave', endDrag);

  viewport.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  window.addEventListener('resize', () => {
    measurePositions();
  });

  measurePositions();
  updateActiveDot(0);

  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => {
      measurePositions();
      ScrollTrigger.refresh();
    }, 100);
  }
}

/* --------------------------------------------------------------------------
   Esperienza: Schede espandibili interattive a fisarmonica
   -------------------------------------------------------------------------- */
function initExperiencePillars() {
  const grid = document.querySelector('.experience-pillars-grid');
  const cards = document.querySelectorAll('.experience-pillar-card');
  if (!grid || !cards.length) return;

  function closeAllCards() {
    cards.forEach((c) => {
      c.classList.remove('is-active', 'is-expanded', 'is-contracted');
      const actionBtn = c.querySelector('.pillar-action-btn');
      if (actionBtn) {
        actionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  cards.forEach((card) => {
    const actionBtn = card.querySelector('.pillar-action-btn');
    const closeBtn = card.querySelector('.pillar-close-btn');

    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCurrentlyActive = card.classList.contains('is-active');

        if (isCurrentlyActive) {
          closeAllCards();
        } else {
          cards.forEach((c) => {
            const btn = c.querySelector('.pillar-action-btn');
            if (c === card) {
              c.classList.add('is-active', 'is-expanded');
              c.classList.remove('is-contracted');
              if (btn) btn.setAttribute('aria-expanded', 'true');
            } else {
              c.classList.add('is-contracted');
              c.classList.remove('is-active', 'is-expanded');
              if (btn) btn.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllCards();
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.experience-pillars-grid')) {
      closeAllCards();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllCards();
    }
  });
}

/* --------------------------------------------------------------------------
   Smooth Scroll: Scorrimento inerziale fluido con Lenis
   -------------------------------------------------------------------------- */
let globalLenis = null;

function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  globalLenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    infinite: false
  });

  if (typeof ScrollTrigger !== 'undefined') {
    globalLenis.on('scroll', ScrollTrigger.update);
  }

  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      globalLenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#content' || targetId === '#hero') {
        e.preventDefault();
        globalLenis.scrollTo(0, { duration: 1.2 });
        return;
      }
      if (targetId === '#anniversario') {
        e.preventDefault();
        const hero = document.getElementById('hero');
        const targetPos = hero ? hero.offsetHeight : 0;
        globalLenis.scrollTo(targetPos, { duration: 1.2 });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        globalLenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
      }
    });
  });

  // Handle direct hash navigation on page load (e.g. index.html#storia)
  if (window.location.hash && !document.getElementById('servizi-split')) {
    setTimeout(() => {
      try {
        const hashTarget = document.querySelector(window.location.hash);
        if (hashTarget) {
          globalLenis.scrollTo(hashTarget, { offset: -90, duration: 1.0 });
        }
      } catch (err) {}
    }, 200);
  }
}


/* --------------------------------------------------------------------------
   Hero: Animazione cinematografica di ingresso degli elementi
   -------------------------------------------------------------------------- */
function initHeroCinematic() {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const header = document.querySelector('.hero-header-21oaks');
  const photoBg = document.querySelector('.hero-photo-bg');
  const logoPanel = document.querySelector('.hero-bottom-left-panel');
  const scrollPrompt = document.querySelector('.hero-scroll-prompt');

  if (photoBg) {
    heroTl.fromTo(photoBg, { opacity: 0.8 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0);
  }
  if (header) {
    heroTl.fromTo(header, { y: -25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1);
  }
  if (logoPanel) {
    heroTl.fromTo(logoPanel, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.25);
  }
  if (scrollPrompt) {
    heroTl.fromTo(scrollPrompt, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.0);
  }
}

/* --------------------------------------------------------------------------
   Hero -> Anniversario: Transizione continua 1:1 agganciata allo scroll
   -------------------------------------------------------------------------- */
function initHeroScrollTransition() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroSection = document.getElementById('hero');
  const nextSection = document.getElementById('anniversario');
  const logoBox = document.querySelector('.hero-logo-vignette-box');
  const scrollPrompt = document.querySelector('.hero-scroll-prompt');
  const annivGrid = nextSection ? nextSection.querySelector('.anniversary-grid') : null;

  if (!heroSection || !nextSection || !logoBox) return;

  nextSection.style.position = 'relative';
  nextSection.style.zIndex = '15';
  nextSection.style.opacity = '1';
  logoBox.style.willChange = 'transform, opacity';
  if (annivGrid) annivGrid.style.willChange = 'transform, opacity';

  // Maschera alpha sfumata dinamica durante lo scroll
  const updateAnniversaryMask = (progress) => {
    if (progress >= 0.97) {
      nextSection.style.webkitMaskImage = 'none';
      nextSection.style.maskImage = 'none';
    } else {
      const ratio = progress > 0.68 ? (0.96 - progress) / 0.25 : 1;
      const feather = Math.max(0, Math.round(180 * ratio));
      if (feather <= 4) {
        nextSection.style.webkitMaskImage = 'none';
        nextSection.style.maskImage = 'none';
      } else {
        const m = `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.06) ${Math.round(feather * 0.15)}px, rgba(0,0,0,0.4) ${Math.round(feather * 0.45)}px, rgba(0,0,0,0.85) ${Math.round(feather * 0.75)}px, black ${feather}px, black 100%)`;
        nextSection.style.webkitMaskImage = m;
        nextSection.style.maskImage = m;
      }
    }
  };

  updateAnniversaryMask(0);

  const tetherTl = gsap.timeline({
    defaults: { duration: 1, ease: 'none' },
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateAnniversaryMask(self.progress);
        if (scrollPrompt) {
          scrollPrompt.style.pointerEvents = self.progress > 0.15 ? 'none' : 'auto';
        }
      },
      onLeave: () => {
        nextSection.style.webkitMaskImage = 'none';
        nextSection.style.maskImage = 'none';
        if (scrollPrompt) {
          gsap.set(scrollPrompt, { opacity: 0, pointerEvents: 'none' });
        }
      },
      onLeaveBack: () => {
        updateAnniversaryMask(0);
        if (scrollPrompt) {
          gsap.set(scrollPrompt, { opacity: 1, pointerEvents: 'auto' });
        }
      }
    }
  });

  // Salita del logo sincrona con lo scroll
  tetherTl.to(logoBox, {
    y: () => -window.innerHeight * 1.02,
    scale: 0.96,
    duration: 1,
    ease: 'none'
  }, 0);

  tetherTl.to(logoBox, {
    opacity: 0,
    duration: 0.28,
    ease: 'power2.in'
  }, 0.65);

  if (scrollPrompt) {
    tetherTl.fromTo(scrollPrompt, { opacity: 1 }, {
      opacity: 0,
      duration: 0.2,
      ease: 'power1.out',
      immediateRender: false
    }, 0);
  }

  if (annivGrid) {
    tetherTl.fromTo(annivGrid, { y: 50, opacity: 0.35 }, {
      y: 0,
      opacity: 1.0,
      duration: 0.85,
      ease: 'power1.out'
    }, 0);
  }
}

/* --------------------------------------------------------------------------
   Scroll Reveals: Comparsa progressiva al raggiungimento delle sezioni
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sectionHeaders = document.querySelectorAll('.section-header, .experience-header-block');
  sectionHeaders.forEach((header) => {
    gsap.fromTo(header, { y: 35, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  const expPillars = document.querySelectorAll('.experience-pillar-card');
  if (expPillars.length) {
    gsap.fromTo(expPillars, { y: 35, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.experience-pillars-grid',
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }

  const quoteCard = document.querySelector('.quote-minimal-card, .quote-card-shell');
  if (quoteCard) {
    gsap.fromTo(quoteCard, { y: 40, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: quoteCard,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Micro-interazioni: Effetto magnetico sui pulsanti CTA
   -------------------------------------------------------------------------- */
function initMagneticAndTilt() {
  if (window.innerWidth < 992) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const magneticBtns = document.querySelectorAll('.btn-outline, .btn-primary');
  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      btn.style.transition = 'transform 0.1s ease-out';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}


/* --------------------------------------------------------------------------
   Footer: Zoom reveal del logo guidato dallo scroll
   -------------------------------------------------------------------------- */
function initFooterLogoZoomReveal() {
  const container = document.getElementById('footerRevealContainer');
  const sticky = document.getElementById('footerRevealSticky');
  const logoGroup = document.getElementById('footerLogoMaskGroup');
  const pillGroup = document.getElementById('footerPillContourGroup');
  const maskStage = document.getElementById('footerZoomMaskStage');
  const darkContent = document.getElementById('footerDarkContent');

  if (!container || !sticky || !logoGroup || !maskStage) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Compute responsive initial scale to comfortably frame inside viewport
  const computeInitialScale = () => {
    const w = window.innerWidth;
    if (w > 1200) return 0.38;
    if (w > 768) return 0.28;
    return 0.18;
  };

  let currentScale = computeInitialScale();

  const zoomState = {
    scale: currentScale,
    pillScale: currentScale,
    maskOpacity: 1,
    contentProgress: 0
  };

  function applyZoomState() {
    logoGroup.setAttribute('transform', `translate(960, 540) scale(${zoomState.scale.toFixed(4)})`);
    if (pillGroup) {
      pillGroup.setAttribute('transform', `translate(960, 540) scale(${zoomState.pillScale.toFixed(4)})`);
      const pOpacity = Math.max(0, 1 - (zoomState.scale - currentScale) / (currentScale * 4));
      pillGroup.style.opacity = pOpacity.toFixed(3);
    }
    if (maskStage) {
      maskStage.style.opacity = zoomState.maskOpacity.toFixed(3);
      if (zoomState.maskOpacity <= 0.01) {
        maskStage.style.visibility = 'hidden';
        maskStage.style.display = 'none';
        maskStage.style.pointerEvents = 'none';
      } else {
        maskStage.style.visibility = 'visible';
        maskStage.style.display = 'block';
        maskStage.style.pointerEvents = 'none';
      }
    }
    if (darkContent) {
      const p = zoomState.contentProgress;
      // Fade content in smoothly, reaching 100% full opacity as the mask dissolves
      const fadeProgress = Math.max(0, Math.min(1, (p - 0.10) / 0.45));
      darkContent.style.transform = `scale(${(0.95 + 0.05 * fadeProgress).toFixed(4)}) translateY(${(24 * (1 - fadeProgress)).toFixed(2)}px)`;
      darkContent.style.opacity = fadeProgress.toFixed(3);
    }
  }

  // Apply initial state
  applyZoomState();

  // Master timeline scrubbed by ScrollTrigger
  const footerTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.9,
      pin: sticky,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: () => applyZoomState()
    }
  });

  footerTl.to(zoomState, {
    scale: 22.0,
    pillScale: currentScale * 4.5,
    contentProgress: 1,
    ease: 'power2.inOut',
    duration: 1,
    onUpdate: applyZoomState
  }, 0);

  // Fade out mask early so by progress ~0.53 the white mask is 100% dissolved and hidden (display: none)
  footerTl.to(zoomState, {
    maskOpacity: 0,
    ease: 'power2.out',
    duration: 0.35,
    onUpdate: applyZoomState
  }, 0.18);

  window.__footerTl = footerTl;

  // Support deterministic verification via URL parameter (?footerProgress=0..1)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const testProgress = urlParams.get('footerProgress');
    if (testProgress !== null) {
      const p = parseFloat(testProgress);
      if (!isNaN(p)) {
        setTimeout(() => {
          footerTl.progress(p);
          applyZoomState();
          container.scrollIntoView({ block: 'start' });
        }, 150);
      }
    }
  } catch (e) {}

  // Handle responsive resize gracefully
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newScale = computeInitialScale();
      if (Math.abs(newScale - currentScale) > 0.02) {
        currentScale = newScale;
        zoomState.scale = currentScale;
        zoomState.pillScale = currentScale;
        applyZoomState();
        ScrollTrigger.refresh();
      }
    }, 250);
  });
}

/* --------------------------------------------------------------------------
   Servizi Split: Vetrina a scorrimento speculare sincronizzata con lo scroll
   -------------------------------------------------------------------------- */
function initSplitServicesShowcase() {
  const showcase = document.getElementById('servizi-split');
  if (!showcase) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const leftPanels = [
    document.getElementById('panel-l0'),
    document.getElementById('panel-l1'),
    document.getElementById('panel-l2'),
    document.getElementById('panel-l3'),
    document.getElementById('panel-l4'),
    document.getElementById('panel-l5')
  ];

  const rightPanels = [
    document.getElementById('panel-r0'),
    document.getElementById('panel-r1'),
    document.getElementById('panel-r2'),
    document.getElementById('panel-r3'),
    document.getElementById('panel-r4'),
    document.getElementById('panel-r5')
  ];

  // Verify panels
  if (!leftPanels[0] || !rightPanels[0]) return;

  const dots = document.querySelectorAll('.split-dots-nav .split-dot');
  const cardWindow = document.getElementById('splitCardWindow');
  if (cardWindow) cardWindow.classList.add('split-card-active-0');

  // Initial positioning:
  // Panel 0 on both sides is at yPercent: 0
  // Panels 1..5: Left enters from bottom (+100%), Right enters from top (-100%)
  for (let i = 1; i < 6; i++) {
    if (leftPanels[i]) gsap.set(leftPanels[i], { yPercent: 100 });
    if (rightPanels[i]) gsap.set(rightPanels[i], { yPercent: -100 });
  }
  gsap.set(leftPanels[0], { yPercent: 0 });
  gsap.set(rightPanels[0], { yPercent: 0 });

  // Master Timeline for smooth card transitions (duration = 5.0)
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

  // Build the 5 transitions (0->1, 1->2, 2->3, 3->4, 4->5)
  for (let i = 0; i < 5; i++) {
    const next = i + 1;
    const label = `step_${i}_to_${next}`;
    tl.addLabel(label, i);

    // Left column: Current panel moves UP (-100%), Next panel moves UP into view (100% -> 0%)
    tl.to(leftPanels[i], { yPercent: -100, duration: 1 }, label);
    tl.to(leftPanels[next], { yPercent: 0, duration: 1 }, label);

    // Right column: Current panel moves DOWN (+100%), Next panel moves DOWN into view (-100% -> 0%)
    tl.to(rightPanels[i], { yPercent: 100, duration: 1 }, label);
    tl.to(rightPanels[next], { yPercent: 0, duration: 1 }, label);
  }

  // Snap points corresponding to cards 0..5
  const snapPoints = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];

  // UI state update (active dot, card halo)
  let currentStep = 0;
  const updateStepUI = (step) => {
    if (step === currentStep && cardWindow && cardWindow.classList.contains(`split-card-active-${step}`)) return;
    currentStep = step;
    if (cardWindow) {
      cardWindow.classList.remove('split-card-active-0', 'split-card-active-1', 'split-card-active-2', 'split-card-active-3', 'split-card-active-4', 'split-card-active-5');
      cardWindow.classList.add(`split-card-active-${step}`);
    }
    dots.forEach((dot, idx) => {
      const active = idx === step;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  const st = ScrollTrigger.create({
    trigger: showcase,
    pin: true,
    scrub: 0.4,
    start: 'top 70px',
    end: '+=2500',
    animation: tl,
    snap: {
      snapTo: snapPoints,
      duration: { min: 0.15, max: 0.32 },
      delay: 0.05,
      ease: 'power1.out'
    },
    onUpdate: (self) => {
      const p = self.progress;
      let step = Math.round(p * 5);
      step = Math.max(0, Math.min(5, step));
      if (!isAnimating) {
        updateStepUI(step);
      }
    }
  });

  // Step-by-Step Navigation Controller:
  // Guarantees that even with a strong scroll, exactly 1 card advances at a time
  let isAnimating = false;

  const goToStep = (targetStep) => {
    if (targetStep < 0 || targetStep > 5) return;
    isAnimating = true;

    currentStep = targetStep;
    updateStepUI(targetStep);

    const targetProgress = targetStep / 5;
    const targetScroll = st.start + (st.end - st.start) * targetProgress;

    if (typeof globalLenis !== 'undefined' && globalLenis) {
      globalLenis.scrollTo(targetScroll, {
        duration: 0.72,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          setTimeout(() => {
            isAnimating = false;
          }, 160);
        }
      });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      setTimeout(() => {
        isAnimating = false;
      }, 700);
    }

    // Safety timeout to prevent any deadlock
    setTimeout(() => {
      isAnimating = false;
    }, 950);
  };

  // Intercept Wheel Gestures while inside the pinned showcase
  const onWheel = (e) => {
    if (!st || !st.isActive) return;

    // Filter tiny vibration jitter
    if (Math.abs(e.deltaY) < 12) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    if (e.deltaY > 0) {
      // User scrolling DOWN
      if (currentStep < 5) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!isAnimating) {
          goToStep(currentStep + 1);
        }
      } else {
        // At last card (step 5): allow smooth natural exit down into #contatti
        if (window.scrollY <= st.end) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (!isAnimating) {
            isAnimating = true;
            if (typeof globalLenis !== 'undefined' && globalLenis) {
              globalLenis.scrollTo(st.end + 100, {
                duration: 0.7,
                onComplete: () => { setTimeout(() => { isAnimating = false; }, 150); }
              });
            } else {
              window.scrollTo({ top: st.end + 100, behavior: 'smooth' });
              setTimeout(() => { isAnimating = false; }, 700);
            }
          }
        }
      }
    } else if (e.deltaY < 0) {
      // User scrolling UP
      if (currentStep > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!isAnimating) {
          goToStep(currentStep - 1);
        }
      } else {
        // At first card (step 0): allow smooth natural exit up to hero
        if (window.scrollY >= st.start) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (!isAnimating) {
            isAnimating = true;
            if (typeof globalLenis !== 'undefined' && globalLenis) {
              globalLenis.scrollTo(Math.max(0, st.start - 100), {
                duration: 0.7,
                onComplete: () => { setTimeout(() => { isAnimating = false; }, 150); }
              });
            } else {
              window.scrollTo({ top: Math.max(0, st.start - 100), behavior: 'smooth' });
              setTimeout(() => { isAnimating = false; }, 700);
            }
          }
        }
      }
    }
  };

  window.addEventListener('wheel', onWheel, { passive: false, capture: true });

  // Touch swipe support for mobile / tablet
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true, capture: true });

  window.addEventListener('touchmove', (e) => {
    if (!st || !st.isActive) return;
    if (!e.touches || !e.touches[0]) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY; // positive = swipe up = scroll down

    if (Math.abs(deltaY) < 30) return;

    if (deltaY > 0) {
      if (currentStep < 5) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!isAnimating) {
          touchStartY = touchY;
          goToStep(currentStep + 1);
        }
      }
    } else if (deltaY < 0) {
      if (currentStep > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!isAnimating) {
          touchStartY = touchY;
          goToStep(currentStep - 1);
        }
      }
    }
  }, { passive: false, capture: true });

  // Keyboard navigation support (Arrow keys / Space)
  window.addEventListener('keydown', (e) => {
    if (!st || !st.isActive) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      if (currentStep < 5) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!isAnimating) goToStep(currentStep + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      if (currentStep > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!isAnimating) goToStep(currentStep - 1);
      }
    }
  }, { capture: true });

  // Clicking on dots navigates directly to that card
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      goToStep(step);
    });
  });

  // Handle Hash Deep Linking (e.g. #caldaie, #pavimento)
  const hashStepMap = {
    '#climatizzazione': 0,
    '#caldaie': 1,
    '#idraulica': 2,
    '#riparazioni': 3,
    '#solare': 4,
    '#pavimento': 5
  };

  const handleHash = (hash) => {
    if (hash && hashStepMap[hash] !== undefined) {
      const step = hashStepMap[hash];
      setTimeout(() => {
        goToStep(step);
      }, 300);
    }
  };

  if (window.location.hash) {
    handleHash(window.location.hash);
  }
  window.addEventListener('hashchange', () => handleHash(window.location.hash));
}

/* --------------------------------------------------------------------------
   Servizi CTA: Gestione visibilità del pulsante preventivo prima dei contatti
   -------------------------------------------------------------------------- */
function initServicesQuoteButtonVisibility() {
  const quoteBtn = document.getElementById('heroQuoteBtn');
  const contatti = document.getElementById('contatti');
  if (!quoteBtn || !contatti) return;

  let isHidden = false;

  const setHidden = (hide) => {
    if (hide === isHidden) return;
    isHidden = hide;

    if (hide) {
      quoteBtn.classList.add('is-hidden');
      quoteBtn.setAttribute('tabindex', '-1');
      quoteBtn.setAttribute('aria-hidden', 'true');
    } else {
      quoteBtn.classList.remove('is-hidden');
      quoteBtn.removeAttribute('tabindex');
      quoteBtn.removeAttribute('aria-hidden');
    }
  };

  const evaluatePosition = () => {
    const rect = contatti.getBoundingClientRect();
    // When the top of #contatti enters the viewport (within 80% from top of screen),
    // or when the user is scrolled further down in #contatti / footer, hide the button.
    const isAtQuoteSection = rect.top <= window.innerHeight * 0.8;
    setHidden(isAtQuoteSection);
  };

  // 1. GSAP ScrollTrigger integration for synchronized transitions with Lenis
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: contatti,
      start: 'top 80%',
      end: 'max',
      onEnter: () => setHidden(true),
      onLeaveBack: () => setHidden(false),
      onEnterBack: () => setHidden(true),
      onRefresh: (self) => {
        if (self.isActive) {
          setHidden(true);
        } else {
          evaluatePosition();
        }
      }
    });
  }

  // 2. Continuous listeners for native scroll, Lenis, resize and orientation change
  window.addEventListener('scroll', evaluatePosition, { passive: true });
  window.addEventListener('resize', evaluatePosition, { passive: true });
  window.addEventListener('orientationchange', evaluatePosition, { passive: true });

  if (typeof globalLenis !== 'undefined' && globalLenis) {
    globalLenis.on('scroll', evaluatePosition);
  }

  // Initial check on load
  evaluatePosition();
}

