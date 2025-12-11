// ============================================
// NAVEGACIÓN MÓVIL
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ============================================
// SCROLL SUAVE
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// NAVBAR ACTIVO SEGÚN SCROLL
// ============================================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// ============================================
// ANIMACIONES AL HACER SCROLL
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Aplicar animación a elementos
document.querySelectorAll('.project-card, .experience-item, .habilidad-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ============================================
// ANIMACIÓN BARRAS DE PROGRESO
// ============================================
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.progress-bar');
      bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.carousel-item').forEach(item => {
  progressObserver.observe(item);
});

// ============================================
// CONTROL DE TABS - HABILIDADES
// ============================================
const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');

tabButtons.forEach(button => {
  button.addEventListener('shown.bs.tab', function () {
    // Re-animar barras cuando cambie de tab
    const activePane = document.querySelector(button.getAttribute('data-bs-target'));
    const bars = activePane.querySelectorAll('.progress-bar');

    bars.forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  });
});

// ============================================
// MEJORAR NAVEGACIÓN DEL CARRUSEL
// ============================================
const carousels = document.querySelectorAll('.carousel');

carousels.forEach(carousel => {
  // Pausar autoplay al hover
  carousel.addEventListener('mouseenter', function () {
    const bsCarousel = bootstrap.Carousel.getInstance(carousel);
    if (bsCarousel) {
      bsCarousel.pause();
    }
  });

  carousel.addEventListener('mouseleave', function () {
    const bsCarousel = bootstrap.Carousel.getInstance(carousel);
    if (bsCarousel) {
      bsCarousel.cycle();
    }
  });

  // Soporte para gestos táctiles
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const bsCarousel = bootstrap.Carousel.getInstance(carousel);
    if (!bsCarousel) return;

    if (touchEndX < touchStartX - 50) {
      bsCarousel.next();
    }
    if (touchEndX > touchStartX + 50) {
      bsCarousel.prev();
    }
  }
});

// ============================================
// EFECTO PARALLAX EN ICONOS DE HABILIDADES
// ============================================
function addParallaxEffect() {
  const cards = document.querySelectorAll('.habilidad-card');

  cards.forEach(card => {
    const icon = card.querySelector('i');
    if (!icon) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      icon.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
    });

    card.addEventListener('mouseleave', () => {
      icon.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// Inicializar efecto parallax
addParallaxEffect();

// ============================================
// EFECTO 3D DEL CARNET
// ============================================
const card = document.getElementById("idCard");

if (card) {
  // Efecto 3D mejorado con el mouse
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(1.02, 1.02, 1.02)
    `;
    card.style.boxShadow = `
      ${-rotateY * 2}px ${rotateX * 2}px 60px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255,255,255,0.1)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.boxShadow = "0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)";
  });

  // Animación de entrada suave
  window.addEventListener('load', () => {
    setTimeout(() => {
      card.style.transition = "transform 0.1s ease-out, box-shadow 0.1s ease-out";
    }, 2000);
  });
}