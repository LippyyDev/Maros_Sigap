// =========================
// CARA KERJA PAGE ANIMATIONS
// =========================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping animations');
    return;
  }

  // Hero animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.from(heroContent, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  // Steps animation
  const stepCards = document.querySelectorAll('.step-card');
  if (stepCards.length > 0 && typeof ScrollTrigger !== 'undefined') {
    stepCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: index * 0.1
      });
    });
  }

  // Features animation
  const featureItems = document.querySelectorAll('.feature-item');
  if (featureItems.length > 0 && typeof ScrollTrigger !== 'undefined') {
    featureItems.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: index * 0.1
      });
    });
  }

  // Tech cards animation
  const techCards = document.querySelectorAll('.tech-card');
  if (techCards.length > 0 && typeof ScrollTrigger !== 'undefined') {
    techCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: index * 0.05
      });
    });
  }

  // CTA animation
  const ctaContent = document.querySelector('.cta-content');
  if (ctaContent && typeof ScrollTrigger !== 'undefined') {
    gsap.from(ctaContent, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ctaContent,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Parallax effect on hero
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-section', {
      y: -50,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

