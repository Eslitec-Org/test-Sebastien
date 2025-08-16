/**
 * MantaGO Website JavaScript
 * Handles all interactive functionality including animations, form validation, and user interactions
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeTheme();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeTestimonialSlider();
    initializeProcessTimeline();
    initializeContactForm();
    initializeROIChart();
    initializeParticles();
    initializeBackToTop();
});

/**
 * Theme Management
 */
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition effect
        body.style.transition = 'all 0.3s ease-in-out';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

/**
 * Navigation Management
 */
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll effects on navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Smooth scrolling and active link management
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Smooth scroll to target
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active link based on scroll position
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 150; // Offset for better UX
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Scroll Effects and Animations
 */
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .value-card, .product-card, .advantage-item, .audience-card, .process-step');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * General Animations
 */
function initializeAnimations() {
    // Hero CTA button animations
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const scheduleDemoBtn = document.getElementById('scheduleDemoBtn');
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            // Smooth scroll to about section
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (scheduleDemoBtn) {
        scheduleDemoBtn.addEventListener('click', function() {
            // Smooth scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Demo video/image interaction
    const demoPlayBtn = document.getElementById('demoPlayBtn');
    if (demoPlayBtn) {
        demoPlayBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Here you would typically open a modal or video player
                alert('Demo video would open here');
            }, 150);
        });
    }
}

/**
 * Testimonial Slider
 */
function initializeTestimonialSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');
    const dots = document.querySelectorAll('.nav-dot');
    
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    
    if (totalSlides === 0) return;
    
    function showSlide(index) {
        // Hide all cards
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current card
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-play slider
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-play on hover
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Initialize first slide
    showSlide(0);
}

/**
 * Process Timeline Animation
 */
function initializeProcessTimeline() {
    const processSteps = document.querySelectorAll('.process-step');
    const timelineProgress = document.getElementById('timelineProgress');
    
    if (processSteps.length === 0) return;
    
    // Intersection Observer for timeline
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepIndex = Array.from(processSteps).indexOf(entry.target);
                const progressPercentage = ((stepIndex + 1) / processSteps.length) * 100;
                
                // Animate progress bar
                if (timelineProgress) {
                    timelineProgress.style.width = progressPercentage + '%';
                }
                
                // Activate current step
                entry.target.classList.add('active');
                
                // Add staggered animation to step details
                const stepDetails = entry.target.querySelectorAll('.step-detail');
                stepDetails.forEach((detail, index) => {
                    setTimeout(() => {
                        detail.style.opacity = '1';
                        detail.style.transform = 'translateX(0)';
                    }, index * 100);
                });
            }
        });
    }, {
        threshold: 0.5
    });
    
    processSteps.forEach(step => {
        // Initialize step details
        const stepDetails = step.querySelectorAll('.step-detail');
        stepDetails.forEach(detail => {
            detail.style.opacity = '0';
            detail.style.transform = 'translateX(-20px)';
            detail.style.transition = 'all 0.3s ease-out';
        });
        
        timelineObserver.observe(step);
    });
}

/**
 * Contact Form Management
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!contactForm) return;
    
    // Multi-step form management
    let currentStep = 1;
    const totalSteps = 4;
    
    // Initialize multi-step form navigation
    const nextBtns = document.querySelectorAll('.next-step-btn');
    const prevBtns = document.querySelectorAll('.prev-step-btn');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Handle next button clicks
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const nextStep = parseInt(this.dataset.next);
            
            // Validate current step before moving forward
            if (validateCurrentStep(currentStep)) {
                showStep(nextStep);
                currentStep = nextStep;
                
                // If moving to review step, populate review
                if (nextStep === 4) {
                    populateReview();
                }
            }
        });
    });
    
    // Handle previous button clicks
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const prevStep = parseInt(this.dataset.prev);
            showStep(prevStep);
            currentStep = prevStep;
        });
    });
    
    // Function to show specific step
    function showStep(stepNumber) {
        // Hide all steps
        formSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // Update progress indicators
        progressSteps.forEach((step, index) => {
            if (index < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === stepNumber - 1) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Scroll to top of form
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Function to validate current step
    function validateCurrentStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const errorSpan = document.getElementById(field.id + 'Error');
            if (!field.value.trim()) {
                if (errorSpan) {
                    errorSpan.textContent = 'This field is required';
                    errorSpan.style.display = 'block';
                }
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                if (errorSpan) {
                    errorSpan.style.display = 'none';
                }
                field.style.borderColor = '';
            }
        });
        
        return isValid;
    }
    
    // Function to populate review step
    function populateReview() {
        const reviewContainer = document.getElementById('formReview');
        if (!reviewContainer) return;
        
        const formData = new FormData(contactForm);
        let reviewHTML = '<div class="review-content">';
        
        // Basic Information
        reviewHTML += '<div class="review-section"><h4>Basic Information</h4>';
        reviewHTML += `<p><strong>Name:</strong> ${formData.get('fullName') || 'Not provided'}</p>`;
        reviewHTML += `<p><strong>Email:</strong> ${formData.get('email') || 'Not provided'}</p>`;
        reviewHTML += `<p><strong>Phone:</strong> ${formData.get('phone') || 'Not provided'}</p></div>`;
        
        // Company Details
        reviewHTML += '<div class="review-section"><h4>Company Details</h4>';
        reviewHTML += `<p><strong>Company:</strong> ${formData.get('company') || 'Not provided'}</p>`;
        reviewHTML += `<p><strong>Size:</strong> ${formData.get('companySize') || 'Not provided'}</p>`;
        reviewHTML += `<p><strong>Industry:</strong> ${formData.get('industry') || 'Not provided'}</p></div>`;
        
        // Requirements
        reviewHTML += '<div class="review-section"><h4>Requirements</h4>';
        reviewHTML += `<p><strong>Interest:</strong> ${formData.get('interest') || 'Not provided'}</p>`;
        reviewHTML += `<p><strong>Timeline:</strong> ${formData.get('timeline') || 'Not provided'}</p>`;
        reviewHTML += `<p><strong>Budget:</strong> ${formData.get('budget') || 'Not provided'}</p>`;
        reviewHTML += `<p><strong>Message:</strong> ${formData.get('message') || 'Not provided'}</p></div>`;
        
        reviewHTML += '</div>';
        reviewContainer.innerHTML = reviewHTML;
    }
    
    // Form validation rules
    const validationRules = {
        fullName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            errorMsg: 'Please enter a valid full name'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMsg: 'Please enter a valid email address'
        },
        company: {
            required: true,
            minLength: 2,
            errorMsg: 'Please enter your company name'
        },
        companySize: {
            required: true,
            errorMsg: 'Please select your company size'
        },
        interest: {
            required: true,
            errorMsg: 'Please select your primary interest'
        },
        privacy: {
            required: true,
            errorMsg: 'Please accept the privacy policy'
        }
    };
    
    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorSpan = document.getElementById(fieldName + 'Error');
        
        if (field && errorSpan) {
            field.addEventListener('blur', () => validateField(field, validationRules[fieldName], errorSpan));
            field.addEventListener('input', () => clearFieldError(field, errorSpan));
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorSpan = document.getElementById(fieldName + 'Error');
            
            if (field && errorSpan) {
                if (!validateField(field, validationRules[fieldName], errorSpan)) {
                    isValid = false;
                }
            }
        });
        
        if (isValid) {
            submitForm();
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.form-error[style*="block"]');
            if (firstError) {
                firstError.closest('.form-group').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
    
    function validateField(field, rules, errorSpan) {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        
        // Required validation
        if (rules.required && (!value || (field.type === 'checkbox' && !field.checked))) {
            showFieldError(field, errorSpan, rules.errorMsg);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            clearFieldError(field, errorSpan);
            return true;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(field, errorSpan, rules.errorMsg);
            return false;
        }
        
        // Min length validation
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(field, errorSpan, rules.errorMsg);
            return false;
        }
        
        clearFieldError(field, errorSpan);
        return true;
    }
    
    function showFieldError(field, errorSpan, message) {
        field.style.borderColor = 'var(--error)';
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
    
    function clearFieldError(field, errorSpan) {
        field.style.borderColor = '';
        errorSpan.style.display = 'none';
    }
    
    function submitForm() {
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
        }, 2000);
    }
    
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.innerHTML = `
            <div style="
                background: var(--success);
                color: white;
                padding: var(--space-4);
                border-radius: var(--radius);
                margin-bottom: var(--space-4);
                display: flex;
                align-items: center;
                gap: var(--space-2);
            ">
                <i class="fas fa-check-circle"></i>
                <span>Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
            </div>
        `;
        
        // Insert before form
        contactForm.parentNode.insertBefore(successMessage.firstElementChild, contactForm);
        
        // Remove after 5 seconds
        setTimeout(() => {
            const messageEl = contactForm.parentNode.querySelector('[style*="var(--success)"]');
            if (messageEl) {
                messageEl.remove();
            }
        }, 5000);
    }
}

/**
 * ROI Chart Animation
 */
function initializeROIChart() {
    const roiChart = document.querySelector('.roi-chart');
    const roiBars = document.querySelectorAll('.roi-bar');
    
    if (!roiChart || roiBars.length === 0) return;
    
    const chartObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate bars with staggered timing
                roiBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const percentage = bar.getAttribute('data-percentage');
                        bar.style.setProperty('--percentage', percentage + '%');
                        
                        // Add count-up animation to percentage text
                        const percentageText = bar.querySelector('.roi-percentage');
                        if (percentageText) {
                            animateCountUp(percentageText, 0, parseInt(percentage), 1000);
                        }
                    }, index * 200);
                });
                
                chartObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    chartObserver.observe(roiChart);
}

/**
 * Particle Animation
 */
function initializeParticles() {
    const heroParticles = document.getElementById('heroParticles');
    
    if (!heroParticles) return;
    
    // Create floating particles
    const particleCount = window.innerWidth > 768 ? 20 : 10;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(heroParticles);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: ${Math.random() > 0.5 ? 'var(--primary-blue)' : 'var(--tech-green)'};
        border-radius: 50%;
        opacity: ${Math.random() * 0.5 + 0.1};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
    
    // Animate particle
    animateParticle(particle);
}

function animateParticle(particle) {
    const duration = Math.random() * 10000 + 5000; // 5-15 seconds
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    const endX = Math.random() * 100;
    const endY = Math.random() * 100;
    
    particle.animate([
        { 
            left: startX + '%', 
            top: startY + '%',
            opacity: particle.style.opacity 
        },
        { 
            left: endX + '%', 
            top: endY + '%',
            opacity: 0 
        }
    ], {
        duration: duration,
        easing: 'ease-in-out'
    }).onfinish = () => {
        // Reset particle position and animate again
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        animateParticle(particle);
    };
}

/**
 * Back to Top Button
 */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 100));
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Utility Functions
 */

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Count-up animation for numbers
function animateCountUp(element, start, end, duration) {
    const startTime = performance.now();
    const suffix = element.textContent.replace(/[\d.]/g, ''); // Preserve non-numeric characters
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }
    
    requestAnimationFrame(updateCount);
}

// Smooth scroll polyfill for older browsers
function smoothScrollTo(target) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.abs(distance) / 2; // Adjust speed as needed
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Error handling for missing elements
function safeQuerySelector(selector, callback) {
    const element = document.querySelector(selector);
    if (element && typeof callback === 'function') {
        callback(element);
    }
}

// Initialize additional features on window load
window.addEventListener('load', function() {
    // Initialize lazy loading for images
    initializeLazyLoading();
    
    // Optimize animations for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', 'none');
        document.documentElement.style.setProperty('--transition-normal', 'none');
        document.documentElement.style.setProperty('--transition-slow', 'none');
    }
    
    // Performance optimization: Remove unused CSS
    setTimeout(() => {
        const unusedElements = document.querySelectorAll('.loading, .placeholder');
        unusedElements.forEach(el => {
            el.remove();
        });
    }, 1000);
});

// Handle resize events
window.addEventListener('resize', debounce(function() {
    // Recalculate animations and layouts on resize
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles && window.innerWidth !== window.previousWidth) {
        // Clear existing particles and recreate for new screen size
        heroParticles.innerHTML = '';
        initializeParticles();
        window.previousWidth = window.innerWidth;
    }
}, 250));

// Store initial width
window.previousWidth = window.innerWidth;

// Export functions for external use if needed
window.MantaGO = {
    smoothScrollTo,
    animateCountUp,
    showSlide: function(index) {
        // Public API for external slide control
        const event = new CustomEvent('slideChange', { detail: { index } });
        document.dispatchEvent(event);
    }
};

// Console branding (optional fun touch)
console.log(`
    %c
    ███╗   ███╗ █████╗ ███╗   ██╗████████╗ █████╗  ██████╗  ██████╗ 
    ████╗ ████║██╔══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝ ██╔═══██╗
    ██╔████╔██║███████║██╔██╗ ██║   ██║   ███████║██║  ███╗██║   ██║
    ██║╚██╔╝██║██╔══██║██║╚██╗██║   ██║   ██╔══██║██║   ██║██║   ██║
    ██║ ╚═╝ ██║██║  ██║██║ ╚████║   ██║   ██║  ██║╚██████╔╝╚██████╔╝
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ 
    
    Welcome to MantaGO - Transform Your Business Operations
    Built with ❤️ by Eslitec
    `, 
    'color: #2563eb; font-family: monospace; font-size: 12px;'
);