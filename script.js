// ==========================================
// LOADING SCREEN - Hide immediately when page starts
// ==========================================
const loadingScreen = document.getElementById('loadingScreen');
if (loadingScreen) {
  // Hide after a short delay
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 3000);
}

setTimeout(() => {
  const ls = document.getElementById('loadingScreen');
  if (ls) {
    ls.style.display = 'none';
  }
}, 1000);

// ==========================================
// PROGRESS BAR
// ==========================================
const progressBar = document.getElementById('progressBar');

if (progressBar) {
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = progress + '%';
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
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '#top') {
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
// CURSOR TRAIL EFFECT 
// ==========================================
/*
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

document.addEventListener('mousemove', (e) => {
  particles.push({
    x: e.clientX,
    y: e.clientY,
    size: Math.random() * 5 + 1,
    speedX: Math.random() * 3 - 1.5,
    speedY: Math.random() * 3 - 1.5,
    life: 20
  });
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    ctx.fillStyle = `rgba(233, 99, 253, ${p.life / 20})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    
    if (p.life <= 0) particles.splice(i, 1);
  }
  
  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
*/

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
