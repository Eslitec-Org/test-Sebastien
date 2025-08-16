/**
 * Advanced Features for MantaGO Website
 * Performance optimizations, animations, and enhanced interactivity
 */

// Performance monitoring utility
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load performance
        if (window.performance && performance.getEntriesByType) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.metrics.loadTime = perfData.loadEventEnd - perfData.fetchStart;
                    this.metrics.domContentLoaded = perfData.domContentLoadedEventEnd - perfData.fetchStart;
                    this.metrics.firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
                    this.metrics.firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0;
                    this.reportMetrics();
                }
            });
        }

        // Monitor Core Web Vitals
        this.observeWebVitals();
    }

    observeWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                this.metrics.fid = entry.processingStart - entry.startTime;
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.cls = clsValue;
                }
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    reportMetrics() {
        console.log('Performance Metrics:', this.metrics);
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance', {
                'event_category': 'Web Vitals',
                'event_label': 'Page Load',
                'value': Math.round(this.metrics.loadTime),
                'non_interaction': true
            });
        }
    }
}

// Advanced Lazy Loading with Intersection Observer
class LazyLoader {
    constructor() {
        this.imageObserver = null;
        this.videoObserver = null;
        this.init();
    }

    init() {
        // Image lazy loading
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Video lazy loading
        this.videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    this.loadVideo(video);
                    this.videoObserver.unobserve(video);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        this.observeElements();
    }

    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (!src) return;

        // Create a new image to preload
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            if (srcset) img.srcset = srcset;
            img.classList.add('loaded');
            
            // Fade in animation
            img.style.opacity = '0';
            requestAnimationFrame(() => {
                img.style.transition = 'opacity 0.5s';
                img.style.opacity = '1';
            });
        };

        tempImg.src = src;
    }

    loadVideo(video) {
        const src = video.dataset.src;
        if (!src) return;

        video.src = src;
        video.load();
    }

    observeElements() {
        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });

        // Observe all videos with data-src
        document.querySelectorAll('video[data-src]').forEach(video => {
            this.videoObserver.observe(video);
        });
    }
}

// Particle Animation System for Hero Background
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(37, 99, 235, ${particle.opacity})`;
            this.ctx.fill();
        });

        // Draw connections between nearby particles
        this.particles.forEach((particle1, index) => {
            this.particles.slice(index + 1).forEach(particle2 => {
                const distance = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) +
                    Math.pow(particle1.y - particle2.y, 2)
                );

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.element.textContent = '';
        this.element.style.minHeight = '1.5em';
        this.type();
    }

    type() {
        if (this.currentIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.element.classList.add('typewriter-complete');
        }
    }
}

// Advanced Number Counter with Easing
class NumberCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = parseFloat(target);
        this.duration = duration;
        this.startTime = null;
        this.startValue = 0;
        this.suffix = element.dataset.suffix || '';
        this.decimals = element.dataset.decimals || 0;
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    animate(currentTime) {
        if (!this.startTime) this.startTime = currentTime;
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        const easedProgress = this.easeOutQuart(progress);
        const currentValue = this.startValue + (this.target - this.startValue) * easedProgress;
        
        this.element.textContent = currentValue.toFixed(this.decimals) + this.suffix;
        
        if (progress < 1) {
            requestAnimationFrame((time) => this.animate(time));
        }
    }

    start() {
        requestAnimationFrame((time) => this.animate(time));
    }
}

// Parallax Scrolling Effect
class ParallaxEffect {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Find all elements with data-parallax attribute
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            this.elements.push({ element, speed });
        });

        if (this.elements.length > 0) {
            this.bindEvents();
            this.updateParallax();
        }
    }

    bindEvents() {
        let ticking = false;
        
        const updateParallax = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateParallax);
        window.addEventListener('resize', updateParallax);
    }

    updateParallax() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(({ element, speed }) => {
            const rect = element.getBoundingClientRect();
            const yPos = -(scrollY * speed);
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
}

// Smooth Reveal Animations
class RevealAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.dataset.delay || 0;
                    
                    setTimeout(() => {
                        element.classList.add('revealed');
                        
                        // Trigger counter animation if it's a counter element
                        if (element.classList.contains('counter')) {
                            const target = element.dataset.target;
                            if (target) {
                                const counter = new NumberCounter(element, target);
                                counter.start();
                            }
                        }
                    }, delay);
                    
                    this.observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.observeElements();
    }

    observeElements() {
        // Observe all elements with reveal animations
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .counter').forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Interactive Timeline Animation
class TimelineAnimation {
    constructor() {
        this.timeline = document.querySelector('.process-timeline');
        if (!this.timeline) return;
        
        this.steps = this.timeline.querySelectorAll('.process-step');
        this.progress = document.getElementById('timelineProgress');
        this.playBtn = document.getElementById('timelinePlayBtn');
        this.resetBtn = document.getElementById('timelineResetBtn');
        this.currentStep = 0;
        this.isPlaying = false;
        
        this.init();
    }

    init() {
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.play());
        }
        
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.reset());
        }

        // Auto-play on scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isPlaying) {
                    setTimeout(() => this.play(), 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if (this.timeline) {
            observer.observe(this.timeline);
        }
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        
        if (this.playBtn) {
            this.playBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause</span>';
        }
        
        this.animateStep();
    }

    animateStep() {
        if (this.currentStep >= this.steps.length) {
            this.isPlaying = false;
            if (this.playBtn) {
                this.playBtn.innerHTML = '<i class="fas fa-play"></i><span>Replay</span>';
            }
            return;
        }

        // Activate current step
        this.steps[this.currentStep].classList.add('active');
        
        // Update progress bar
        if (this.progress) {
            const progressPercent = ((this.currentStep + 1) / this.steps.length) * 100;
            this.progress.style.width = `${progressPercent}%`;
        }

        this.currentStep++;
        
        // Continue to next step
        if (this.isPlaying) {
            setTimeout(() => this.animateStep(), 1500);
        }
    }

    reset() {
        this.isPlaying = false;
        this.currentStep = 0;
        
        this.steps.forEach(step => step.classList.remove('active'));
        
        if (this.progress) {
            this.progress.style.width = '0%';
        }
        
        if (this.playBtn) {
            this.playBtn.innerHTML = '<i class="fas fa-play"></i><span>Play Timeline</span>';
        }
    }
}

// Form File Upload Handler
class FileUploadHandler {
    constructor() {
        this.fileInput = document.getElementById('attachments');
        this.uploadArea = document.getElementById('fileUploadArea');
        this.fileList = document.getElementById('fileList');
        this.files = new Map();
        
        if (this.fileInput && this.uploadArea) {
            this.init();
        }
    }

    init() {
        // Click to upload
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });

        // File selection
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragging');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragging');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragging');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    handleFiles(fileList) {
        Array.from(fileList).forEach(file => {
            // Validate file
            if (!this.validateFile(file)) return;
            
            // Add to files map
            const id = Date.now() + Math.random();
            this.files.set(id, file);
            
            // Display file
            this.displayFile(id, file);
        });
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        if (file.size > maxSize) {
            this.showNotification('File size exceeds 10MB limit', 'error');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Invalid file type. Please upload PDF, DOC, XLS, or PPT files.', 'error');
            return false;
        }

        return true;
    }

    displayFile(id, file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-${this.getFileIcon(file.type)}"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
            </div>
            <button class="file-remove" data-id="${id}">
                <i class="fas fa-times"></i>
            </button>
        `;

        fileItem.querySelector('.file-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFile(id);
        });

        this.fileList.appendChild(fileItem);
    }

    removeFile(id) {
        this.files.delete(id);
        const fileItem = this.fileList.querySelector(`[data-id="${id}"]`).parentElement.parentElement;
        fileItem.remove();
    }

    getFileIcon(type) {
        if (type.includes('pdf')) return 'pdf';
        if (type.includes('word')) return 'word';
        if (type.includes('excel') || type.includes('sheet')) return 'excel';
        if (type.includes('powerpoint') || type.includes('presentation')) return 'powerpoint';
        return 'alt';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ROI Chart Animation
class ROIChartAnimation {
    constructor() {
        this.charts = document.querySelectorAll('.roi-bar');
        if (this.charts.length === 0) return;
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percentage = bar.dataset.percentage;
                    
                    setTimeout(() => {
                        bar.style.width = `${percentage}%`;
                        bar.classList.add('animated');
                    }, 200);
                    
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.1 });

        this.charts.forEach(chart => {
            observer.observe(chart);
        });
    }
}

// Interactive Demo Tabs
class DemoTabs {
    constructor() {
        this.tabContainer = document.getElementById('demoTabs');
        if (!this.tabContainer) return;
        
        this.tabButtons = this.tabContainer.querySelectorAll('.demo-tab-btn');
        this.tabPanels = this.tabContainer.querySelectorAll('.demo-tab-panel');
        this.interactiveBtn = document.getElementById('interactiveDemoBtn');
        
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId);
            });
        });

        if (this.interactiveBtn) {
            this.interactiveBtn.addEventListener('click', () => {
                this.tabContainer.classList.toggle('active');
                this.tabContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }

    switchTab(tabId) {
        // Remove active class from all buttons and panels
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to selected button and panel
        const selectedButton = this.tabContainer.querySelector(`[data-tab="${tabId}"]`);
        const selectedPanel = document.getElementById(`${tabId}-tab`);
        
        if (selectedButton) selectedButton.classList.add('active');
        if (selectedPanel) selectedPanel.classList.add('active');
    }
}

// Feature Hotspot Tooltips
class FeatureHotspots {
    constructor() {
        this.hotspots = document.querySelectorAll('.feature-hotspot');
        if (this.hotspots.length === 0) return;
        
        this.init();
    }

    init() {
        this.hotspots.forEach(hotspot => {
            hotspot.addEventListener('mouseenter', () => {
                hotspot.classList.add('active');
            });
            
            hotspot.addEventListener('mouseleave', () => {
                hotspot.classList.remove('active');
            });
            
            hotspot.addEventListener('click', () => {
                const feature = hotspot.dataset.feature;
                this.showFeatureDetails(feature);
            });
        });
    }

    showFeatureDetails(feature) {
        // Trigger corresponding tab
        const demoTabs = new DemoTabs();
        const tabContainer = document.getElementById('demoTabs');
        if (tabContainer) {
            tabContainer.classList.add('active');
            demoTabs.switchTab(feature);
            tabContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Initialize all advanced features
document.addEventListener('DOMContentLoaded', () => {
    // Performance monitoring
    const performanceMonitor = new PerformanceMonitor();
    
    // Lazy loading
    const lazyLoader = new LazyLoader();
    
    // Particle system
    const particleSystem = new ParticleSystem('heroParticles');
    
    // Typewriter effect
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.dataset.text || typewriterElement.textContent;
        new TypewriterEffect(typewriterElement, text, 50);
    }
    
    // Parallax effect
    const parallax = new ParallaxEffect();
    
    // Reveal animations
    const reveals = new RevealAnimations();
    
    // Timeline animation
    const timeline = new TimelineAnimation();
    
    // File upload handler
    const fileUpload = new FileUploadHandler();
    
    // ROI charts
    const roiCharts = new ROIChartAnimation();
    
    // Demo tabs
    const demoTabs = new DemoTabs();
    
    // Feature hotspots
    const hotspots = new FeatureHotspots();
    
    // Browser update check
    const checkBrowserCompatibility = () => {
        const isIE = /MSIE|Trident/.test(navigator.userAgent);
        const isOldEdge = /Edge\/\d+/.test(navigator.userAgent) && !(/Edg\/\d+/.test(navigator.userAgent));
        
        if (isIE || isOldEdge) {
            const banner = document.getElementById('browserUpdateBanner');
            if (banner) {
                banner.style.display = 'block';
                
                const closeBtn = document.getElementById('closeBrowserBanner');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        banner.style.display = 'none';
                    });
                }
            }
        }
    };
    
    checkBrowserCompatibility();
    
    // High contrast mode
    const contrastToggle = document.getElementById('contrastToggle');
    if (contrastToggle) {
        contrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
        });
        
        // Check saved preference
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
        }
    }
    
    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Loading screen
    window.addEventListener('load', () => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceMonitor,
        LazyLoader,
        ParticleSystem,
        TypewriterEffect,
        NumberCounter,
        ParallaxEffect,
        RevealAnimations,
        TimelineAnimation,
        FileUploadHandler,
        ROIChartAnimation,
        DemoTabs,
        FeatureHotspots
    };
}