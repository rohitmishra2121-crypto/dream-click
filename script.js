// ===== Dream Click Photography — Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 1000);
    });

    // Fallback for preloader
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 2500);
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===== BACK TO TOP =====
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== MOBILE NAVIGATION =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        // If it's a dropdown toggle on mobile, don't close the menu, just toggle the dropdown
        if (window.innerWidth <= 992 && link.classList.contains('dropdown-toggle')) {
          e.preventDefault();
          link.parentElement.classList.toggle('active');
          return;
        }
        
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== RESIZE HANDLER =====
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      if (hamburger) hamburger.classList.remove('active');
      if (navLinks) {
        navLinks.classList.remove('active');
        navLinks.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
      }
      document.body.style.overflow = '';
    }
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.indexOf('services') !== -1) return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ===== HERO SLIDER =====
  const heroSlides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  const slideInterval = 5000;

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
  };

  if (heroSlides.length > 1) {
    setInterval(nextSlide, slideInterval);
  }

  // ===== PORTFOLIO FILTER & SEARCH ENGINE =====
  const filterButtons = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioSearch = document.getElementById('portfolioSearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const noResults = document.getElementById('noResults');

  let activeFilter = 'all';

  const filterGallery = () => {
    const query = portfolioSearch ? portfolioSearch.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    portfolioItems.forEach(item => {
      const category = item.dataset.category || '';
      const title = (item.dataset.title || '').toLowerCase();
      const location = (item.dataset.location || '').toLowerCase();
      const camera = (item.dataset.camera || '').toLowerCase();

      const matchesCategory = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = !query || title.includes(query) || location.includes(query) || category.includes(query) || camera.includes(query);

      if (matchesCategory && matchesSearch) {
        item.style.display = '';
        item.style.animation = 'fadeIn 0.4s ease forwards';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (clearSearchBtn) {
      clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
    }
  };

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        filterGallery();
      });
    });
  }

  if (portfolioSearch) {
    portfolioSearch.addEventListener('input', filterGallery);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      portfolioSearch.value = '';
      filterGallery();
    });
  }

  // ===== ADVANCED LIGHTBOX WITH EXIF & VIDEO REELS =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxLocation = document.getElementById('lightboxLocation');
  const lightboxCamera = document.getElementById('lightboxCamera');
  const lightboxLens = document.getElementById('lightboxLens');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentItemIndex = 0;
  let visibleGalleryItems = [];

  const updateLightboxContent = (index) => {
    if (visibleGalleryItems.length === 0) return;
    
    // Normalize index loop
    if (index < 0) index = visibleGalleryItems.length - 1;
    if (index >= visibleGalleryItems.length) index = 0;
    currentItemIndex = index;

    const item = visibleGalleryItems[currentItemIndex];
    const isVideo = item.dataset.type === 'video';
    const videoUrl = item.dataset.video;
    const imgElement = item.querySelector('img');

    const title = item.dataset.title || item.querySelector('h4')?.textContent || 'Gallery Showcase';
    const location = item.dataset.location || item.querySelector('p')?.textContent || 'Delhi NCR';
    const camera = item.dataset.camera || 'Sony Alpha Pro';
    const lens = item.dataset.lens || 'Prime G-Master';

    if (isVideo && lightboxVideo && videoUrl) {
      lightboxImg.style.display = 'none';
      lightboxVideo.style.display = 'block';
      lightboxVideo.src = videoUrl;
      lightboxVideo.play().catch(() => {});
    } else if (lightboxImg) {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.style.display = 'none';
      }
      lightboxImg.style.display = 'block';
      lightboxImg.src = imgElement ? imgElement.src : '';
      lightboxImg.alt = title;
    }

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxLocation) lightboxLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${location}`;
    if (lightboxCamera) lightboxCamera.innerHTML = `<i class="fas fa-camera"></i> ${camera}`;
    if (lightboxLens) lightboxLens.innerHTML = `<i class="fas fa-circle-dot"></i> ${lens}`;
    if (lightboxCounter) lightboxCounter.textContent = `${currentItemIndex + 1} of ${visibleGalleryItems.length}`;
  };

  const openLightbox = (item) => {
    visibleGalleryItems = Array.from(document.querySelectorAll('.portfolio-item')).filter(el => el.style.display !== 'none');
    const index = visibleGalleryItems.indexOf(item);
    if (index !== -1 && lightbox) {
      updateLightboxContent(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
      document.body.style.overflow = '';
    }
  };

  if (portfolioItems.length > 0) {
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => updateLightboxContent(currentItemIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => updateLightboxContent(currentItemIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-dialog')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateLightboxContent(currentItemIndex - 1);
      if (e.key === 'ArrowRight') updateLightboxContent(currentItemIndex + 1);
    });
  }

  // ===== INSTANT PACKAGE PRICE CALCULATOR ENGINE =====
  const daysSlider = document.getElementById('daysSlider');
  const daysValueDisplay = document.getElementById('daysValueDisplay');
  const crewSelect = document.getElementById('crewSelect');
  const calculatedTotalPrice = document.getElementById('calculatedTotalPrice');
  
  const summaryEvent = document.getElementById('summaryEvent');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryCrew = document.getElementById('summaryCrew');
  const summaryAddons = document.getElementById('summaryAddons');
  const modalPackageSummary = document.getElementById('modalPackageSummary');

  let currentAnimatedPrice = 90000;

  const animatePriceCounter = (targetPrice) => {
    if (!calculatedTotalPrice) return;
    const startPrice = currentAnimatedPrice;
    const duration = 400;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(startPrice + (targetPrice - startPrice) * progress);
      calculatedTotalPrice.textContent = val.toLocaleString('en-IN');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentAnimatedPrice = targetPrice;
      }
    };

    requestAnimationFrame(step);
  };

  const calculatePackage = () => {
    if (!daysSlider || !crewSelect || !calculatedTotalPrice) return;

    // 1. Event Type
    const selectedEventRadio = document.querySelector('input[name="eventType"]:checked');
    const basePrice = selectedEventRadio ? parseInt(selectedEventRadio.dataset.base || '45000') : 45000;
    const eventName = selectedEventRadio ? selectedEventRadio.closest('.calc-radio-card').querySelector('.radio-title').textContent : 'Wedding & Reception';

    // 2. Days
    const days = parseInt(daysSlider.value);
    if (daysValueDisplay) daysValueDisplay.textContent = `${days} Day${days > 1 ? 's' : ''}`;

    // 3. Crew
    const selectedCrewOption = crewSelect.options[crewSelect.selectedIndex];
    const crewAddon = parseInt(selectedCrewOption.dataset.add || '0');
    const crewName = selectedCrewOption.textContent.split('(')[0].trim();

    // 4. Addons
    const checkedAddons = document.querySelectorAll('.addon-checkbox:checked');
    let addonsPriceTotal = 0;
    let addonNamesList = [];

    checkedAddons.forEach(cb => {
      addonsPriceTotal += parseInt(cb.dataset.price || '0');
      const title = cb.closest('.calc-checkbox-card').querySelector('.checkbox-title').textContent.trim();
      addonNamesList.push(title);
    });

    // Multi-day scaling formula
    const multiplier = 1 + (days - 1) * 0.75;
    const totalPrice = Math.round((basePrice + crewAddon) * multiplier + addonsPriceTotal);

    // Update Summary UI
    if (summaryEvent) summaryEvent.textContent = eventName;
    if (summaryDuration) summaryDuration.textContent = `${days} Day${days > 1 ? 's' : ''}`;
    if (summaryCrew) summaryCrew.textContent = crewName;
    if (summaryAddons) summaryAddons.textContent = `${checkedAddons.length} Item${checkedAddons.length !== 1 ? 's' : ''}`;

    // Animate Price
    animatePriceCounter(totalPrice);

    // Build Package Summary Text for Modal
    const summaryText = `[CUSTOM PACKAGE QUOTE]\nEvent: ${eventName}\nDuration: ${days} Day(s)\nCrew: ${crewName}\nAdd-ons: ${addonNamesList.join(', ') || 'None'}\nEstimated Total: ₹${totalPrice.toLocaleString('en-IN')}`;
    if (modalPackageSummary) modalPackageSummary.value = summaryText;
  };

  // Event Listeners for Calculator
  if (daysSlider) {
    daysSlider.addEventListener('input', calculatePackage);
  }

  if (crewSelect) {
    crewSelect.addEventListener('change', calculatePackage);
  }

  document.querySelectorAll('input[name="eventType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.calc-radio-card').forEach(card => card.classList.remove('active'));
      e.target.closest('.calc-radio-card').classList.add('active');
      calculatePackage();
    });
  });

  document.querySelectorAll('.addon-checkbox').forEach(cb => {
    cb.addEventListener('change', calculatePackage);
  });

  // Initial Calculation Run
  calculatePackage();

  // ===== INSTANT BOOKING & RESERVATION HANDLERS =====
  if (openReserveModalBtn) {
    openReserveModalBtn.addEventListener('click', () => {
      const summaryText = modalPackageSummary ? modalPackageSummary.value : '';
      const msg = `Hi Dream Click! I created a custom package on your website:%0A%0A${encodeURIComponent(summaryText)}%0A%0AI would like to check availability and lock this quote!`;
      window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    });
  }

  // Quick Select Buttons on Standard Pricing Cards
  document.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.dataset.plan || 'Curated Package';
      const planPrice = parseInt(btn.dataset.price || '0').toLocaleString('en-IN');
      const msg = `Hi Dream Click! I am interested in booking your *${planName}* (₹${planPrice}). Please let me know your date availability!`;
      window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
    });
  });

  // Top Nav CTA Button
  document.querySelectorAll('.nav-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'contact.html';
    });
  });

  // ===== TESTIMONIALS SLIDER =====
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonial = 0;
  let testimonialTimer;

  if (testimonialCards.length > 0) {
    const showTestimonial = (index) => {
      testimonialCards.forEach(card => card.classList.remove('active'));
      testimonialDots.forEach(dot => dot.classList.remove('active'));
      
      if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
        if (testimonialDots[index]) testimonialDots[index].classList.add('active');
        currentTestimonial = index;
      }
    };

    const nextTestimonial = () => {
      const next = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(next);
    };

    testimonialDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        showTestimonial(index);
        clearInterval(testimonialTimer);
        testimonialTimer = setInterval(nextTestimonial, 5000);
      });
    });

    testimonialTimer = setInterval(nextTestimonial, 5000);
  }

  // ===== COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          stat.textContent = Math.floor(current) + '+';
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target + '+';
        }
      };

      updateCounter();
    });
  };

  // ===== SCROLL REVEAL ANIMATION =====
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger counters when stats section is visible
          if (entry.target.closest('.stats') && !countersStarted) {
            countersStarted = true;
            animateCounters();
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Simulate submission
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Package Booked!';
        submitBtn.style.background = '#22c55e';
        
        // Construct WhatsApp message
        const whatsappMsg = `Hi Dream Click!%0A%0A*Luxury Wedding Enquiry*%0A👤 Name: ${data.name}%0A📞 Phone: ${data.phone}%0A📧 Email: ${data.email}%0A📋 Service: ${data.service || 'Wedding Collection'}%0A💬 Message: ${data.message || 'No message'}`;
        
        window.open(`https://wa.me/919876543210?text=${whatsappMsg}`, '_blank');

        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = 'Send Enquiry';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  // ===== PARALLAX EFFECT ON HERO (subtle) =====
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 1.2;
      }
    }, { passive: true });
  }

  // ===== CURSOR GLOW EFFECT (Desktop only) =====
  if (window.innerWidth > 1024) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    Object.assign(cursorGlow.style, {
      position: 'fixed',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(197,160,89,0.05) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: '1',
      transform: 'translate(-50%, -50%)',
      transition: 'left 0.1s ease-out, top 0.1s ease-out'
    });
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

});
