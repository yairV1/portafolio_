document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initBackToTop();
  initNavbarHighlight();
  initDarkMode();
  initWhatsAppPulse();
  initTypingEffect();
  initCounters();
  initFormValidation();
  AOS.init({ duration: 1000, once: true });
});

/* 🔹 Scroll suave */
function initSmoothScroll() {
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      if (link.hash) {
        e.preventDefault();
        document.querySelector(link.hash).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


/* 🔹 Navbar activo */
function initNavbarHighlight() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
      if (pageYOffset >= sec.offsetTop - 120) {
        current = sec.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* 🔹 Modo Oscuro */
function initDarkMode() {
  const toggleBtn = document.querySelector("#darkModeToggle");
  const body = document.body;

  // Guardar preferencia en localStorage
  if (localStorage.getItem("darkMode") === "true") {
    body.classList.add("dark-mode");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
    });
  }
}

/* 🔹 WhatsApp pulso */
function initWhatsAppPulse() {
  const whatsBtn = document.querySelector(".whatsapp-float");
  if (whatsBtn) {
    setInterval(() => whatsBtn.classList.toggle("pulse"), 1500);
  }
}

/* 🔹 Efecto escritura */
function initTypingEffect() {
  const textElement = document.querySelector(".typing-text");
  if (!textElement) return;

  const text = textElement.dataset.text || "Desarrollador Web Junior";
  let i = 0;

  function type() {
    if (i < text.length) {
      textElement.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }
  type();
}

/* 🔹 Contadores */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  const speed = 200;

  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}

/* 🔹 Validación formulario */
function initFormValidation() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", e => {
    const email = form.querySelector("input[type='email']");
    const name = form.querySelector("input[name='name']");
    const message = form.querySelector("textarea");

    if (!name.value.trim() || !email.value.includes("@") || !message.value.trim()) {
      e.preventDefault();
      alert("Por favor completa todos los campos correctamente.");
    }
  });
}
