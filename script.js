const jobTitles = ["Software Engineer", ".NET Developer"];
let currentTitleIndex = 0;
let isTyping = false;

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

// ===== INITIALIZATION =====
function initializePortfolio() {
    setupScrollAnimations();
    setupParticleSystem();
    setupNavigation();
    setupFormHandling();
    setupHeaderScroll();
    startTypewriterEffect();
}

// ===== TYPEWRITER EFFECT =====
function startTypewriterEffect() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    // Start the typewriter effect after a short delay
    setTimeout(() => {
        typeText(typewriterElement, jobTitles[0]);
        setTimeout(cycleJobTitles, 4000);
    }, 1000);
}

function typeText(element, text, speed = 100) {
    if (isTyping) return;
    isTyping = true;
    
    let i = 0;
    element.textContent = '';
    
    const typing = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else {
            isTyping = false;
        }
    };
    
    typing();
}

function eraseText(element, speed = 50) {
    if (isTyping) return;
    isTyping = true;
    
    const currentText = element.textContent;
    let i = currentText.length;
    
    const erasing = () => {
        if (i > 0) {
            element.textContent = currentText.substring(0, i - 1);
            i--;
            setTimeout(erasing, speed);
        } else {
            isTyping = false;
        }
    };
    
    erasing();
}

function cycleJobTitles() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;
    
    // Erase current text
    eraseText(typewriterElement, 50);
    
    // Wait for erasing to complete, then type new text
    setTimeout(() => {
        currentTitleIndex = (currentTitleIndex + 1) % jobTitles.length;
        typeText(typewriterElement, jobTitles[currentTitleIndex]);
        
        // Schedule next cycle
        setTimeout(cycleJobTitles, 4000);
    }, 1500); // Wait for erasing to complete
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for education items
                if (entry.target.classList.contains('education-item')) {
                    const items = document.querySelectorAll('.education-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ===== PARTICLE SYSTEM =====
function setupParticleSystem() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const startPositionX = Math.random() * window.innerWidth;
        const animationDuration = Math.random() * 10 + 10; // 10-20 seconds
        const opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8
        const size = Math.random() * 3 + 2; // 2-5px
        
        // Set properties
        particle.style.left = startPositionX + 'px';
        particle.style.animationDuration = animationDuration + 's';
        particle.style.opacity = opacity;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random colors from our palette
        const colors = [
            'rgba(214, 51, 132, 0.7)', 
            'rgba(232, 62, 140, 0.7)', 
            'rgba(45, 55, 72, 0.5)',
            'rgba(214, 51, 132, 0.5)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Add to container
        particlesContainer.appendChild(particle);
        
        // Remove after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, animationDuration * 1000);
    }

    // Create particles periodically
    const createParticleInterval = setInterval(createParticle, 500);
    
    // Stop creating particles when page is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(createParticleInterval);
        }
    });
}

// ===== NAVIGATION =====
function setupNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

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

    window.addEventListener('scroll', debounce(updateActiveNav, 10));
}

// ===== HEADER SCROLL EFFECT =====
function setupHeaderScroll() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', debounce(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.15)';
            header.style.backdropFilter = 'blur(25px)';
            header.style.borderBottom = '1px solid rgba(214, 51, 132, 0.3)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.borderBottom = '1px solid rgba(214, 51, 132, 0.2)';
        }

        lastScrollY = currentScrollY;
    }, 10));
}

// ===== FORM HANDLING =====
function setupFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });

    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    clearFieldError(field);

    // Validation rules
    switch (fieldName) {
        case 'fullName':
            if (!value) {
                errorMessage = 'Full name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'phone':
            if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
            break;

        case 'subject':
            if (!value) {
                errorMessage = 'Subject is required';
                isValid = false;
            } else if (value.length < 5) {
                errorMessage = 'Subject must be at least 5 characters';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#dc3545';
    field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#e2e8f0';
    field.style.boxShadow = '';

    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showNotification('Please correct the errors above', 'error');
        return;
    }

    // Submit to Google Sheets
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Replace with your actual Google Apps Script web app URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyB6n1nUKDbC-mjOGOtU1cuVQ3cBTdIb7AEJKpeUZzib1VGWDcvgrtnbC7wyOq-s7el/exec';

    console.log('Submitting form to:', scriptURL);
    console.log('Form data:', Object.fromEntries(formData));

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        return response.text(); // Changed from .json() to .text() for better debugging
    })
    .then(responseText => {
        console.log('Raw response:', responseText);
        try {
            const result = JSON.parse(responseText);
            console.log('Parsed result:', result);
            if (result.result === 'success') {
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                form.reset();

                // Clear any existing errors
                const errorMessages = form.querySelectorAll('.error-message');
                errorMessages.forEach(error => error.remove());
                
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => clearFieldError(input));
            } else {
                throw new Error('Form submission failed: ' + JSON.stringify(result));
            }
        } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            console.log('Response was:', responseText);
            throw new Error('Invalid response from server');
        }
    })
    .catch(error => {
        console.error('Detailed error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}
// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Styling
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--gradient-primary)' : '#dc3545',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });

    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    });

    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        marginLeft: 'auto',
        opacity: '0.8',
        transition: 'opacity 0.2s ease'
    });

    closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.8');

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===== UTILITY FUNCTIONS =====
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
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function setupAccessibility() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll(
        'button, input, textarea, select, [tabindex]:not([tabindex="-1"]), a:not(.nav-links a)'
    );

    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-pink)';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// ===== ANIMATION ENHANCEMENTS =====
function setupAdvancedAnimations() {
    // Parallax effect for hero section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = aboutSection.querySelector('.profile-photo');
            if (parallax && scrolled < window.innerHeight) {
                const speed = scrolled * -0.2;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        }, 16));
    }

    // Stagger animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Project cards hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img');
        
        card.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// ===== INITIALIZATION ON LOAD =====
window.addEventListener('load', function() {
    setupLazyLoading();
    setupAccessibility();
    setupAdvancedAnimations();
    
    // Remove loading class from body if it exists
    document.body.classList.remove('loading');
    
    // Add loaded class for any CSS animations that should start after load
    document.body.classList.add('loaded');
});

// ===== CSS ANIMATIONS (Additional styles) =====
const additionalStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(300px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(300px);
        opacity: 0;
    }
}

.skip-link:focus {
    top: 6px !important;
}

.notification {
    animation: slideInRight 0.3s ease;
}

.loading * {
    animation-play-state: paused !important;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
