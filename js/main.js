document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-links a:not(.btn)').forEach(link => {
    link.addEventListener('click', () => links.classList.remove('open'));
  });

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sent';
      btn.disabled = true;
      btn.style.background = 'rgba(34,197,94,.15)';
      btn.style.color = '#4ade80';
      btn.style.border = '1px solid rgba(34,197,94,.3)';
      setTimeout(() => {
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.border = '';
      }, 3000);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.feature-card, .subject-card, .mentoring-card, .blog-card, .resource-item, .process-step').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity .4s ease ${i % 3 * .08}s, transform .4s ease ${i % 3 * .08}s`;
    observer.observe(el);
  });
});

document.head.insertAdjacentHTML('beforeend', `<style>
  .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
</style>`);
