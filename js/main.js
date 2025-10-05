
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
document.querySelectorAll(".demo-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const url = btn.getAttribute("data-demo");
    document.getElementById("demoFrame").src = url;
    document.getElementById("demoPreviewLabel");
  });
});



const busqueda = document.getElementById("search");
const projects = document.querySelectorAll(".project");

busqueda.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  projects.forEach(proj => {
    const title = proj.dataset.title.toLowerCase();
    const tags = proj.dataset.tags.toLowerCase();
    if (title.includes(value) || tags.includes(value)) {
      proj.style.display = "";
    } else {
      proj.style.display = "none";
    }
  });
});
