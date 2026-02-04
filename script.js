// FOOTER YEAR 
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// TYPED TEXT 
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

// GO TO TOP BUTTON 
const goTopBtn = document.getElementById("goTopBtn");

if (goTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      goTopBtn.classList.add("show");
    } else {
      goTopBtn.classList.remove("show");
    }
  });
}

// AOS INIT 
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 800,
    once: true,
    offset: 30
  });
}

// SKILL BAR ANIMATION 
window.addEventListener("scroll", () => {
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
});

// PARTICLES JS 
if (document.getElementById("particles-js") && typeof particlesJS !== "undefined") {
  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#e963fd" },
      shape: { type: "circle" },
      opacity: { value: 0.4, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#e963fd",
        opacity: 0.2,
        width: 1
      },
      move: { enable: true, speed: 1.5 }
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.4 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

// NAVBAR SCROLL-SPY 
const sections = document.querySelectorAll("header[id], section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "home";

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

  if (current === "intro") {
    const homeLink = document.querySelector('.nav-links a[href="#intro"]');
    if (homeLink) homeLink.classList.add("active");
    return;
  }


  const activeLink = document.querySelector(
    `.nav-links a[href="#${current}"]`
  );
  if (activeLink) activeLink.classList.add("active");
});

// MOBILE NAV MENU 
const menuToggle = document.getElementById("menuToggle");
const navLinksBox = document.getElementById("navLinks");
const translateBtn = document.getElementById("translateBtn");

if (menuToggle && navLinksBox) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinksBox.classList.toggle("show");
    if (translateBtn) {
      translateBtn.classList.toggle("hide", isOpen);
    }
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinksBox.classList.remove("show");
      if (translateBtn) {
        translateBtn.classList.remove("hide");
      }
    });
  });
}
