// =============================
// SHARED MODAL SCROLL-LOCK HELPERS
// Used by every popup/modal so the page behind never scrolls while a
// modal is open, and the page position is restored exactly when closed.
// =============================
let __modalScrollY = 0;
let __modalOpenCount = 0;

function lockBodyScroll() {
  if (__modalOpenCount === 0) {
    __modalScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = '-' + __modalScrollY + 'px';
    document.body.classList.add('modal-open');
  }
  __modalOpenCount++;
}

function unlockBodyScroll() {
  __modalOpenCount = Math.max(0, __modalOpenCount - 1);
  if (__modalOpenCount === 0) {
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    // Temporarily disable smooth scrolling so the restore is instant,
    // not an animated scroll (which looked like the page "reloading").
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, __modalScrollY);
    html.style.scrollBehavior = prevBehavior;
  }
}

// =============================
// LOADING SCREEN 
// =============================

const MIN_LOADING_TIME = 2000; // 2 seconds
const startTime = Date.now();

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;

  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500); 
  }, remainingTime);
});


// ==========================================
// PROGRESS BAR
// ==========================================
const progressBar = document.getElementById('progressBar');

if (progressBar) {
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    // Guard against divide-by-zero / negative values when the page content
    // is shorter than (or equal to) the viewport, which would otherwise
    // produce NaN% or a nonsensical bar width.
    const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  });
}

// ==========================================
// FOOTER YEAR
// ==========================================
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ==========================================
// TYPED TEXT EFFECT
// ==========================================
const typedText = document.getElementById("typed-text");

if (typedText) {
  const phrases = typedText.dataset.phrases.split("|");
  let i = 0;
  let j = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[i];
    typedText.textContent = currentPhrase.slice(0, j);

    if (!isDeleting && j < currentPhrase.length) {
      j++;
    } else if (isDeleting && j > 0) {
      j--;
    }

    if (j === currentPhrase.length) {
      isDeleting = true;
    }

    if (isDeleting && j === 0) {
      isDeleting = false;
      i = (i + 1) % phrases.length;
    }

    setTimeout(typeLoop, isDeleting ? 60 : 180);
  }

  typeLoop();
}

// ==========================================
// GO TO TOP BUTTON
// ==========================================
const goTopBtn = document.getElementById("goTopBtn");

if (goTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      goTopBtn.classList.add("show");
    } else {
      goTopBtn.classList.remove("show");
    }
  });

  // Smooth scroll to top
  goTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==========================================
// AOS INITIALIZATION
// ==========================================
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic'
  });
}

// ==========================================
// SKILL BAR ANIMATION
// ==========================================
const animateSkillBars = () => {
  document.querySelectorAll(".bar .fill").forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      !bar.dataset.animated
    ) {
      bar.style.width = bar.dataset.width;
      bar.dataset.animated = "true";
    }
  });
};

window.addEventListener("scroll", animateSkillBars);
window.addEventListener("load", animateSkillBars);

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
function animateStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const easeOutQuad = t => t * (2 - t);

  const animateValue = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      const current = target * eased;
      el.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isDecimal ? target.toFixed(2) : target;
      }
    }
    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateValue(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(el => observer.observe(el));
  } else {
    statNumbers.forEach(animateValue);
  }
}

document.addEventListener('DOMContentLoaded', animateStatCounters);

// ==========================================
// PARTICLES JS
// ==========================================
if (document.getElementById("particles-js")) {
  // Check if particlesJS is loaded
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: { enable: true, value_area: 800 }
        },
        color: { value: "#e963fd" },
        shape: { type: "circle" },
        opacity: {
          value: 0.5,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0.1 }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: true, speed: 2, size_min: 0.1 }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#e963fd",
          opacity: 0.3,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: { opacity: 0.5 }
          },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  } else {
    console.log('Particles.js not loaded - continuing without particles');
  }
}

// ==========================================
// NAVBAR SCROLL-SPY & STICKY EFFECT
// ==========================================
const sections = document.querySelectorAll("header[id], section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
const navbar = document.querySelector("nav");

window.addEventListener("scroll", () => {
  let current = "intro";

  // Scroll spy
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (
      window.pageYOffset >= sectionTop &&
      window.pageYOffset < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => link.classList.remove("active"));

  const activeLink = document.querySelector(
    `.nav-links a[href="#${current}"]`
  );
  if (activeLink) activeLink.classList.add("active");

  // Add scrolled class to navbar
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// ==========================================
// MOBILE NAV MENU
// ==========================================
const menuToggle = document.getElementById("menuToggle");
const navLinksBox = document.getElementById("navLinks");
const translateBtn = document.getElementById("translateBtn");

if (menuToggle && navLinksBox) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinksBox.classList.toggle("show");
    menuToggle.classList.toggle("active");
    
    if (translateBtn) {
      translateBtn.classList.toggle("hide", isOpen);
    }
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinksBox.classList.remove("show");
      menuToggle.classList.remove("active");
      if (translateBtn) {
        translateBtn.classList.remove("hide");
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinksBox.contains(e.target)) {
      navLinksBox.classList.remove("show");
      menuToggle.classList.remove("active");
      if (translateBtn) {
        translateBtn.classList.remove("hide");
      }
    }
  });
}

// ==========================================
// CONTACT FORM HANDLING (Formspree)
// ==========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Detect if we're on Kannada page
const isKannadaPage = window.location.pathname.includes('index-kn');

// Messages
const messages = isKannadaPage ? {
  sending: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
  success: '✅ ಸಂದೇಶ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ! ನಾನು ಶೀಘ್ರದಲ್ಲೇ ನಿಮಗೆ ಉತ್ತರಿಸುತ್ತೇನೆ.',
  error: '❌ ಕ್ಷಮಿಸಿ! ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ನೇರವಾಗಿ ಇಮೇಲ್ ಮಾಡಿ.',
  notificationSuccess: 'ಸಂದೇಶ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!',
  notificationError: 'ಸಂದೇಶ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.'
} : {
  sending: 'Sending...',
  success: '✅ Message sent successfully! I\'ll get back to you soon.',
  error: '❌ Oops! Something went wrong. Please try again or email me directly.',
  notificationSuccess: 'Message sent successfully!',
  notificationError: 'Failed to send message. Please try again.'
};

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = submitBtn.querySelector('span').textContent;
    
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = messages.sending;
    
    formStatus.style.display = 'none';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = messages.success;
        formStatus.classList.add('success');
        formStatus.style.display = 'block';
        contactForm.reset();
        showNotification(messages.notificationSuccess, 'success');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      formStatus.textContent = messages.error;
      formStatus.classList.add('error');
      formStatus.style.display = 'block';
      showNotification(messages.notificationError, 'error');
      console.error('Form submission error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = originalBtnText;
    }
  });
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? 'var(--accent-primary)' : '#ff4444'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add animation styles for notification
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ==========================================
// SMOOTH SCROLL FOR ALL LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // Read the href fresh at click-time, since some links (like the
    // project modal's "Visit Project" button) start as "#" but get
    // their real destination URL set dynamically via JS later on.
    const href = this.getAttribute('href');
    if (href && href.startsWith('#') && href !== '#' && href !== '#top') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ==========================================
// LAZY LOADING FOR IMAGES
// ==========================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-heavy operations
const debouncedScroll = debounce(() => {
  animateSkillBars();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log(
  '%c👋 Hello there!',
  'font-size: 20px; font-weight: bold; color: #e963fd;'
);
console.log(
  '%cThanks for checking out my portfolio! 🚀',
  'font-size: 14px; color: #d2d2d2;'
);
console.log(
  '%cIf you found any issues or have suggestions, feel free to reach out!',
  'font-size: 12px; color: #aaa;'
);

// ==========================================
// EASTER EGG - KONAMI CODE
// ==========================================
let konamiCode = [];
const konamiSequence = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateEasterEgg();
  }
});

// Mobile-friendly equivalent: the keyboard Konami code above is unreachable
// on touch devices, so tapping the logo 5 times quickly triggers the same
// easter egg for mobile visitors.
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  if (!logo) return;

  let tapCount = 0;
  let tapTimer = null;
  const TAP_WINDOW = 1500; // ms allowed between taps
  const TAPS_REQUIRED = 5;

  logo.addEventListener('click', () => {
    tapCount++;
    clearTimeout(tapTimer);

    if (tapCount >= TAPS_REQUIRED) {
      tapCount = 0;
      activateEasterEgg();
      return;
    }

    tapTimer = setTimeout(() => {
      tapCount = 0;
    }, TAP_WINDOW);
  });
});

function activateEasterEgg() {
  showNotification('🎉 You found the Easter Egg! Enjoy the sparkles!', 'success');
  
  // Add sparkle effect
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createSparkle();
    }, i * 50);
  }
}

function createSparkle() {
  const sparkle = document.createElement('div');
  sparkle.style.cssText = `
    position: fixed;
    top: ${Math.random() * 100}%;
    left: ${Math.random() * 100}%;
    width: 10px;
    height: 10px;
    background: var(--accent-primary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    animation: sparkleAnim 1s ease-out forwards;
  `;
  document.body.appendChild(sparkle);

  setTimeout(() => {
    document.body.removeChild(sparkle);
  }, 1000);
}

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkleAnim {
    0% {
      opacity: 1;
      transform: scale(0) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1) rotate(180deg);
    }
    100% {
      opacity: 0;
      transform: scale(0) rotate(360deg);
    }
  }
`;
document.head.appendChild(sparkleStyle);

// ==========================================
// INITIALIZE ON DOM LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized successfully! ✨');
  
  // Trigger initial animations
  setTimeout(() => {
    animateSkillBars();
  }, 500);
});

// ==========================================
// PROJECT DETAIL MODAL (mini project cards)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('projectModalOverlay');
  if (!overlay) return;

  const imageEl = document.getElementById('projectModalImage');
  const titleEl = document.getElementById('projectModalTitle');
  const dateEl = document.getElementById('projectModalDate');
  const dateTextEl = dateEl ? dateEl.querySelector('span') : null;
  const techEl = document.getElementById('projectModalTech');
  const featuresEl = document.getElementById('projectModalFeatures');
  const linkEl = document.getElementById('projectModalLink');
  const closeBtn = document.getElementById('projectModalClose');

  function openProjectModal(card) {
    const image = card.getAttribute('data-image') || '';
    const fallback = card.getAttribute('data-fallback') || '';
    const title = card.getAttribute('data-title') || '';
    const date = card.getAttribute('data-date') || '';
    const link = card.getAttribute('data-link') || '#';
    const tech = (card.getAttribute('data-tech') || '').split('|').map(t => t.trim()).filter(Boolean);
    const features = (card.getAttribute('data-features') || '').split('|').map(f => f.trim()).filter(Boolean);

    if (imageEl) {
      imageEl.src = image;
      imageEl.alt = title;
      imageEl.onerror = () => { if (fallback) imageEl.src = fallback; };
    }

    if (titleEl) titleEl.textContent = title;

    if (dateTextEl) {
      dateTextEl.textContent = date;
    } else if (dateEl) {
      dateEl.textContent = date;
    }

    if (techEl) {
      techEl.innerHTML = '';
      tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        techEl.appendChild(span);
      });
    }

    if (featuresEl) {
      featuresEl.innerHTML = '';
      features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        featuresEl.appendChild(li);
      });
    }

    if (linkEl) linkEl.href = link;

    overlay.classList.add('active');
    const box = document.getElementById('projectModalBox');
    if (box) box.scrollTop = 0;
    lockBodyScroll();
  }

  function closeProjectModal() {
    overlay.classList.remove('active');
    unlockBodyScroll();
  }

  // These are now native <button> elements, so keyboard activation
  // (Enter/Space) already fires a real 'click' event on its own — no need
  // for manual tabindex/role or a keypress handler (adding one back would
  // double-fire openProjectModal on Enter/Space and break the scroll lock).
  document.querySelectorAll('.project-card-mini').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeProjectModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeProjectModal();
  });
});

// ==========================================
// CERTIFICATE GALLERY MODAL ("More Certificates" popup)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const moreCard = document.getElementById('moreCertificatesCard');
  const overlay = document.getElementById('certGalleryOverlay');
  const grid = document.getElementById('certGalleryGrid');
  const closeBtn = document.getElementById('certGalleryClose');
  if (!moreCard || !overlay || !grid) return;

  // Built once and reused — previously this rebuilt fresh <img> elements
  // from scratch every single time the popup opened, which meant
  // re-creating (and potentially re-fetching) every certificate image on
  // each open. cloneNode also lets the browser reuse the already-decoded
  // image data instead of starting a brand-new <img> element from zero.
  let galleryBuilt = false;

  function buildGallery() {
    if (galleryBuilt) return;
    galleryBuilt = true;

    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    document.querySelectorAll('#certificates .certificate-item').forEach(item => {
      const clone = item.cloneNode(true);
      clone.style.display = ''; // some source items are hidden (display:none) in the main grid
      fragment.appendChild(clone);
    });

    grid.appendChild(fragment);
  }

  function openGallery() {
    buildGallery();
    overlay.classList.add('active');
    const box = document.getElementById('certGalleryBox');
    if (box) box.scrollTop = 0;
    lockBodyScroll();
  }

  function closeGallery() {
    overlay.classList.remove('active');
    unlockBodyScroll();
  }

  // moreCard is now a native <button>, so it's keyboard-activatable out of
  // the box — a manual keypress handler here would double-fire openGallery
  // on Enter/Space and break the scroll lock counter.
  moreCard.addEventListener('click', openGallery);

  if (closeBtn) closeBtn.addEventListener('click', closeGallery);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeGallery(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGallery(); });
});

// ==========================================
// CERTIFICATE LIGHTBOX (opens certificate image in-page instead of an external link)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('certLightboxOverlay');
  const imgEl = document.getElementById('certLightboxImage');
  const titleEl = document.getElementById('certLightboxTitle');
  const providerEl = document.getElementById('certLightboxProvider');
  const closeBtn = document.getElementById('certLightboxClose');
  if (!overlay || !imgEl || !closeBtn) return;

  function openLightbox(anchor) {
    const img = anchor.querySelector('img');
    const title = anchor.querySelector('h3');
    const provider = anchor.querySelector('.cert-provider');
    if (!img) return;

    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    titleEl.textContent = title ? title.textContent : '';
    providerEl.textContent = provider ? provider.textContent : '';
    overlay.classList.add('active');
    const box = document.getElementById('certLightboxBox');
    if (box) box.scrollTop = 0;
    lockBodyScroll();
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    unlockBodyScroll();
  }

  // Event delegation so this also works for certificates cloned into the
  // "More Certificates" gallery popup.
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('#certificates .certificate-item a, #certGalleryGrid .certificate-item a');
    if (!anchor) return;
    e.preventDefault();
    openLightbox(anchor);
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
});

// ==========================================
// DETAIL POPUP MODAL (achievement/activity/internship "popup-card" elements)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('detailModalOverlay');
  const titleEl = document.getElementById('detailModalTitle');
  const subEl = document.getElementById('detailModalSubtitle');
  const bodyEl = document.getElementById('detailModalBody');
  const iconEl = document.getElementById('detailModalIcon');
  const closeBtn = document.getElementById('detailModalClose');
  if (!overlay || !closeBtn) return;

  function openModal(card) {
    const icon = card.getAttribute('data-icon') || 'fas fa-info-circle';
    iconEl.innerHTML = `<i class="${icon}"></i>`;
    titleEl.textContent = card.getAttribute('data-title') || '';
    subEl.textContent = card.getAttribute('data-subtitle') || '';
    bodyEl.innerHTML = card.getAttribute('data-body') || '';
    overlay.classList.add('active');
    const box = document.getElementById('detailModalBox');
    if (box) box.scrollTop = 0;
    lockBodyScroll();
  }

  function closeModal() {
    overlay.classList.remove('active');
    unlockBodyScroll();
  }

  // popup-card elements are now native <button>s, so Enter/Space already
  // trigger a real 'click' — a manual keypress handler would double-fire
  // openModal and break the scroll lock counter.
  document.querySelectorAll('.popup-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});