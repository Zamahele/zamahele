// Enhanced functionality for BLACK TECH EMPOWER website

// Smooth scrolling with offset for fixed navbar
function smoothScrollTo(target) {
  const element = document.querySelector(target);
  if (element) {
    const offsetTop = element.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Enhanced navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Update year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Enhanced smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      smoothScrollTo(target);
    });
  });

  // Mobile navigation toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Animate hamburger menu
      const spans = navToggle.querySelectorAll('span');
      spans.forEach((span, index) => {
        if (navMenu.classList.contains('active')) {
          if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (index === 1) span.style.opacity = '0';
          if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          span.style.transform = 'none';
          span.style.opacity = '1';
        }
      });
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Reset hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        
        // Reset hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      }
    });
  }

  // Enhanced contact form handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const formStatus = document.getElementById('form-status');
      
      // Client-side validation
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const message = formData.get('message')?.trim();
      
      // Clear previous status
      formStatus.innerHTML = '';
      
      // Validation
      if (!name || !email || !message) {
        formStatus.innerHTML = '<div class="error">Please fill in all required fields.</div>';
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.innerHTML = '<div class="error">Please enter a valid email address.</div>';
        return;
      }
      
      // Show loading state
      formStatus.innerHTML = '<div class="loading">Preparing your message...</div>';
      
      // Prepare email content
      const subject = `Project Enquiry from ${name} - BLACK TECH EMPOWER`;
      const company = formData.get('company')?.trim() || 'Not specified';
      const phone = formData.get('phone')?.trim() || 'Not specified';
      const projectType = formData.get('project-type') || 'Not specified';
      const budget = formData.get('budget') || 'Not specified';
      
      const body = `
Project Enquiry - BLACK TECH EMPOWER

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Email: ${email}
Company: ${company}
Phone: ${phone}

Project Details:
━━━━━━━━━━━━━━━━━━━━━━
Service Type: ${projectType}
Budget Range: ${budget}

Message:
━━━━━━━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━━━━━━━
Sent via BLACK TECH EMPOWER contact form
${new Date().toLocaleString()}
      `.trim();
      
      // Create mailto link
      const mailtoLink = `mailto:ndimandezj@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Simulate loading delay and open email client
      setTimeout(() => {
        window.location.href = mailtoLink;
        formStatus.innerHTML = '<div class="success">✓ Thank you! Your email client should open with your message ready to send. If it doesn\'t open automatically, please copy the details and send manually to ndimandezj@gmail.com</div>';
        
        // Reset form after successful submission
        setTimeout(() => {
          this.reset();
        }, 500);
      }, 1000);
    });

    // Form field enhancements
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
      // Add floating label effect
      field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });
      
      field.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement.classList.remove('focused');
        }
      });
      
      // Initialize focused state for pre-filled fields
      if (field.value) {
        field.parentElement.classList.add('focused');
      }
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let ticking = false;
    
    function updateNavbar() {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered animation delay
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, index * 100);
        
        // Stop observing once animated
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.service-card, .portfolio-item').forEach(element => {
    animationObserver.observe(element);
  });

  // Service card interactions
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      // Add subtle glow effect
      this.style.boxShadow = '0 20px 40px rgba(14, 165, 233, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
    
    // Click to scroll to contact form
    card.addEventListener('click', function() {
      const serviceType = this.dataset.service;
      const projectTypeSelect = document.getElementById('project-type');
      
      if (projectTypeSelect && serviceType) {
        projectTypeSelect.value = serviceType;
      }
      
      smoothScrollTo('#contact');
    });
  });

  // Portfolio item interactions
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
      const navMenu = document.getElementById('nav-menu');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
      }
    }
  });

  // Preload critical assets
  const preloadAssets = [
    'assets/logo.svg',
    'assets/favicon.svg'
  ];
  
  preloadAssets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = asset.endsWith('.svg') ? 'image' : 'fetch';
    document.head.appendChild(link);
  });
});

// Performance optimization: Lazy load images if added later
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Analytics helper (for future Google Analytics integration)
function trackEvent(action, category = 'User Interaction', label = '') {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
  console.log(`Analytics: ${category} - ${action} - ${label}`);
}

// Track important user interactions
document.addEventListener('click', function(e) {
  const target = e.target;
  
  // Track CTA clicks
  if (target.matches('.btn.primary')) {
    trackEvent('cta_click', 'Conversion', target.textContent.trim());
  }
  
  // Track service interest
  if (target.closest('.service-card')) {
    const serviceName = target.closest('.service-card').querySelector('h3')?.textContent;
    trackEvent('service_interest', 'Engagement', serviceName);
  }
  
  // Track external links
  if (target.matches('a[target="_blank"]')) {
    trackEvent('external_link', 'Navigation', target.href);
  }
});

// Export functions for potential future use
window.BlackTechEmpowerSite = {
  smoothScrollTo,
  trackEvent,
  lazyLoadImages
};