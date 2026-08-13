const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

function updateNavigation() {
  header.classList.toggle('scrolled', window.scrollY > 24);
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#top');
  });
}
window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

document.querySelector('.to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const track = document.querySelector('.carousel-track');
const slides = [...document.querySelectorAll('.showcase-slide')];
const dots = [...document.querySelectorAll('.carousel-dots button')];
const counter = document.querySelector('.carousel-count b');
const carousel = document.querySelector('.carousel');
let activeSlide = 0;
let autoplay;
let pointerStart = 0;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${activeSlide * 100}%)`;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === activeSlide;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', String(active));
  });
  counter.textContent = String(activeSlide + 1).padStart(2, '0');
}

function startAutoplay() {
  window.clearInterval(autoplay);
  autoplay = window.setInterval(() => showSlide(activeSlide + 1), 6000);
}

dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); startAutoplay(); }));
carousel.addEventListener('pointerdown', (event) => { pointerStart = event.clientX; });
carousel.addEventListener('pointerup', (event) => {
  const distance = event.clientX - pointerStart;
  if (Math.abs(distance) > 60) showSlide(activeSlide + (distance < 0 ? 1 : -1));
  startAutoplay();
});
carousel.addEventListener('mouseenter', () => window.clearInterval(autoplay));
carousel.addEventListener('mouseleave', startAutoplay);
carousel.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showSlide(activeSlide - 1);
  if (event.key === 'ArrowRight') showSlide(activeSlide + 1);
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startAutoplay();
