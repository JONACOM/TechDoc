document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('nav-open');
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('nav-open');
    });
  });

  initParticles();
  initServiceCards();
  initTestimonialSlider();
  initContactButtons();
  initPWA();
  initBookingForm();

  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 50
      ? '0 4px 15px rgba(0, 0, 0, 0.4)'
      : '0 2px 10px rgba(0, 0, 0, 0.3)';
  });
});

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5);
      this.speedY = (Math.random() - 0.5);
      this.color = `hsla(${Math.random() * 60 + 190}, 70%, 60%, 0.8)`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          ctx.strokeStyle = `hsla(210, 70%, 60%, ${1 - distance / 100})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    if (!document.body.classList.contains('reduce-motion')) {
      requestAnimationFrame(animateParticles);
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduce-motion');
  } else {
    animateParticles();
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function initServiceCards() {
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    observer.observe(card);
  });
}

function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  const container = slider.querySelector('.testimonials-container');
  const testimonials = slider.querySelectorAll('blockquote');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');

  let currentIndex = 0;

  function updateSlider() {
    container.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === testimonials.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) currentIndex--;
    updateSlider();
    resetAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < testimonials.length - 1) currentIndex++;
    updateSlider();
    resetAutoSlide();
  });

  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      prevBtn.click();
      resetAutoSlide();
    }
    if (e.key === 'ArrowRight') {
      nextBtn.click();
      resetAutoSlide();
    }
  });

  updateSlider();

  // Auto-slide every 10 seconds
  let autoSlideInterval = setInterval(() => {
    currentIndex++;
    if (currentIndex >= testimonials.length) {
      currentIndex = 0;
    }
    updateSlider();
  }, 10000);

  // Reset auto-slide timer when user interacts
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= testimonials.length) {
        currentIndex = 0;
      }
      updateSlider();
    }, 10000);
  }
}


function initContactButtons() {
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('click', e => {
      if (card.href === '#') e.preventDefault();

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

function initPWA() {
  let deferredPrompt;
  const installBtn = document.getElementById('install-btn');

  if (!installBtn) return;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.parentElement.style.display = 'block';

    installBtn.addEventListener('click', async () => {
      installBtn.textContent = 'Installing...';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      installBtn.textContent = outcome === 'accepted' ? 'Installed!' : 'Install';
      deferredPrompt = null;
    }, { once: true });
  });

  window.addEventListener('appinstalled', () => {
    installBtn.parentElement.style.display = 'none';
  });
}

function initBookingForm() {
  const form = document.getElementById('service-form');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    try {
      const res = await fetch('https://formsubmit.co/ajax/caratscom@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (res.ok) {
        form.reset();
        form.style.display = 'none';
        successMsg.style.display = 'block';
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('There was an error submitting the form.');
    }
  });
}
