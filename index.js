// =========================
// GSAP ANIMATIONS & INTERACTIONS
// =========================

gsap.registerPlugin(ScrollTrigger);

// Load ScrollTo plugin if available
if (typeof gsap.plugins.scrollTo !== 'undefined') {
  gsap.registerPlugin(gsap.plugins.scrollTo);
}

// Load stats from Firestore
async function loadStats() {
  // Check if Firebase is loaded
  if (typeof db === 'undefined') {
    return { total: 0, done: 0, processing: 0 };
  }

  try {
    const snapshot = await db.collection('reports').get();
    const reports = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        status: data.status || 'Pending'
      });
    });

    const total = reports.length;
    const done = reports.filter(r => r.status === "Selesai").length;
    const processing = reports.filter(r => r.status === "Diproses").length;

    return { total, done, processing };
  } catch (error) {
    console.error('Error loading stats:', error);
    return { total: 0, done: 0, processing: 0 };
  }
}

// Animate numbers
function animateNumber(element, target) {
  const duration = 2;
  const start = 0;
  const increment = target / (duration * 60);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = Math.floor(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 1000 / 60);
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping animations');
    return;
  }

  // Hero animations
  const heroText = document.querySelector('.hero-text');

  if (heroText) {
    gsap.from(heroText, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  // Title animation
  gsap.from('.title-main', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.8
  });

  // Button animations - ensure buttons are always visible
  const btnPrimary = document.querySelector('.hero-cta .btn-primary');
  const btnSecondary = document.querySelector('.hero-cta .btn-secondary');
  
  // Set initial state to visible
  if (btnPrimary) {
    gsap.set(btnPrimary, { opacity: 1, visibility: 'visible' });
    gsap.from(btnPrimary, {
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      delay: 1.0
    });
  }

  if (btnSecondary) {
    gsap.set(btnSecondary, { opacity: 1, visibility: 'visible' });
    gsap.from(btnSecondary, {
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      delay: 1.2
    });
  }

  // Feature cards animation
  const featureCards = document.querySelectorAll('.feature-card');
  if (featureCards.length > 0 && typeof ScrollTrigger !== 'undefined') {
    featureCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        delay: index * 0.1
      });
    });
  }

  // Stats animation - load async
  loadStats().then(stats => {
    const statItems = document.querySelectorAll('.stat-item');
    
    if (statItems.length > 0) {
      statItems.forEach((item, index) => {
        const numberEl = item.querySelector('.stat-number');
        let value = 0;
        
        if (index === 0) value = stats.total;
        else if (index === 1) value = stats.done;
        else if (index === 2) value = stats.processing;
        
        if (numberEl) {
          numberEl.setAttribute('data-target', value);
          animateNumber(numberEl, value);
        }

        if (typeof ScrollTrigger !== 'undefined') {
          gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          });
        }
      });
    }
  });


  // Smooth scroll for anchor links (if ScrollTo plugin available)
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

