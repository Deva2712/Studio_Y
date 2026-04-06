// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery slider with fade effect for project images
const projectSliders = document.querySelectorAll('.project-images-slider');
if (projectSliders) {
    projectSliders.forEach(slider => {
        const projectImages = slider.querySelectorAll('.project-image');
        
        slider.addEventListener('scroll', () => {
            const sliderRect = slider.getBoundingClientRect();
            const sliderCenter = sliderRect.left + sliderRect.width / 2;
            
            projectImages.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2;
                const distance = Math.abs(sliderCenter - itemCenter);
                const maxDistance = sliderRect.width;
                const opacity = 1 - (distance / maxDistance) * 0.7;
                
                item.style.opacity = Math.max(opacity, 0.3);
            });
        });
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add touch swipe functionality for each project images slider
document.querySelectorAll('.project-images-slider').forEach(slider => {
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            const scrollAmount = slider.offsetWidth * 0.9;
            slider.scrollBy({ left: diff > 0 ? scrollAmount : -scrollAmount, behavior: 'smooth' });
        }
    });
});

// Parallax effect for hero section and smooth background reveal
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-image-placeholder');
    const extendedBg = document.querySelector('.extended-white-background');
    const aboutOverlay = document.querySelector('.about-overlay');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Smooth reveal animation for extended background
    if (extendedBg && aboutOverlay) {
        const aboutRect = aboutOverlay.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - aboutRect.bottom) / 300));
        
        extendedBg.style.opacity = scrollProgress;
        extendedBg.style.transform = `translateY(${-20 * (1 - scrollProgress)}px)`;
    }
});

// Add hover effect for process steps
const processSteps = document.querySelectorAll('.process-step');
processSteps.forEach(step => {
    step.addEventListener('mouseenter', () => {
        step.style.transform = 'scale(1.02)';
        step.style.transition = 'transform 0.3s ease';
    });
    
    step.addEventListener('mouseleave', () => {
        step.style.transform = 'scale(1)';
    });
});

// Lazy loading for image placeholders (ready for when you add real images)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // When you add real images, replace placeholder with actual image
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-image, .slider-image, .process-image').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('Studio Y - Mobile Landing Page Loaded ✨');
