// Simple Navigation Button Logic for Project Image Sliders (Mobile Only)
if (window.innerWidth <= 768) {
    document.querySelectorAll('.project-images-slider').forEach(slider => {
        const leftArrow = slider.querySelector('.slider-arrow-left');
        const rightArrow = slider.querySelector('.slider-arrow-right');
        const track = slider.querySelector('.project-images-track');
        const slides = track.querySelectorAll('.project-image, .project-video');
        
        let currentIndex = 0;
        
        function updateSlidePosition() {
            slides.forEach((slide, index) => {
                slide.style.display = index === currentIndex ? 'block' : 'none';
            });
            
            // Update button visibility
            if (leftArrow) {
                leftArrow.style.display = currentIndex === 0 ? 'none' : 'flex';
            }
            if (rightArrow) {
                rightArrow.style.display = currentIndex === slides.length - 1 ? 'none' : 'flex';
            }
        }
        
        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlidePosition();
                }
            });
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                    updateSlidePosition();
                }
            });
        }
        
        // Initialize
        updateSlidePosition();
    });
}

// Desktop Swipe/Drag Functionality for Project Images
if (window.innerWidth > 768) {
    document.querySelectorAll('.project-images-slider').forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });
}

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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-image-placeholder');
    const heroText = document.querySelector('.hero-text');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Hide hero text when scrolling (desktop only)
    if (heroText && window.innerWidth >= 768) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollProgress = Math.min(1, scrolled / (heroBottom * 0.5));
            heroText.style.opacity = 1 - scrollProgress;
        }
    }
});

// Video mute/unmute functionality
const allVideos = ['nivara-video', 'team-pixel-video', 'katni-video'];

document.querySelectorAll('.video-mute-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoId = btn.getAttribute('data-video');
        const video = document.getElementById(videoId);
        const muteIcon = btn.querySelector('.mute-icon');
        const unmuteIcon = btn.querySelector('.unmute-icon');
        
        if (video) {
            if (video.muted) {
                video.muted = false;
                muteIcon.style.display = 'none';
                unmuteIcon.style.display = 'block';
                
                // Mute all other videos
                allVideos.forEach(otherId => {
                    if (otherId !== videoId) {
                        const otherVideo = document.getElementById(otherId);
                        const otherBtn = document.querySelector(`[data-video="${otherId}"]`);
                        if (otherVideo && otherBtn) {
                            otherVideo.muted = true;
                            otherBtn.querySelector('.mute-icon').style.display = 'block';
                            otherBtn.querySelector('.unmute-icon').style.display = 'none';
                        }
                    }
                });
            } else {
                video.muted = true;
                muteIcon.style.display = 'block';
                unmuteIcon.style.display = 'none';
            }
        }
    });
});

// Initialize Lucide icons
lucide.createIcons();

// Native fullscreen video player (Mobile Only)
if (window.innerWidth < 768) {
    document.querySelectorAll('.video-play-btn').forEach(playBtn => {
        playBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const videoContainer = playBtn.closest('.project-video');
            const video = videoContainer.querySelector('video');
            
            try {
                if (video.requestFullscreen) {
                    await video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    await video.webkitRequestFullscreen();
                } else if (video.webkitEnterFullscreen) {
                    video.webkitEnterFullscreen();
                }
                video.play();
            } catch (error) {
                console.log('Fullscreen not supported, playing inline');
                video.play();
            }
        });
    });
}

console.log('Studio Y - Simple Navigation Loaded ✨');

// Stamp each enquiry with the campaign that sent the visitor.
// SOURCE_ENTRY_ID = the "Source" short-answer field in the Google Form.
// Get it from the form's ⋮ menu > "Get pre-filled link" > fill anything > Copy link,
// then read the entry.XXXXXXXXX out of the copied URL.
const SOURCE_ENTRY_ID = 'entry.XXXXXXXXX';

const utmParams = new URLSearchParams(window.location.search);
const utmSource = ['utm_source', 'utm_medium', 'utm_campaign']
    .map(key => utmParams.get(key))
    .filter(Boolean)
    .join(' / ');

const contactForm = document.querySelector('.contact-form-section iframe');
if (contactForm && utmSource) {
    const separator = contactForm.src.includes('?') ? '&' : '?';
    contactForm.src += separator + SOURCE_ENTRY_ID + '=' + encodeURIComponent(utmSource);
}

// ===== Enquire Now popup =====
const ENQUIRE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdhc8doducXndRq6B5xxfHtA39i5Q-1T1pWz4JVCanug5_Whw/formResponse';
const ENQUIRE_SEEN_KEY = 'studioy_enquire_seen';
const ENQUIRE_DELAY_MS = 7000;

const enquirePopup = document.getElementById('enquire-popup');

// localStorage throws in some private-browsing modes - never let it break the popup
function enquireSeen() {
    try { return localStorage.getItem(ENQUIRE_SEEN_KEY) === '1'; } catch (e) { return false; }
}
function markEnquireSeen() {
    try { localStorage.setItem(ENQUIRE_SEEN_KEY, '1'); } catch (e) { /* ignore */ }
}

if (enquirePopup) {
    const enquireForm = enquirePopup.querySelector('.enquire-form');
    const enquireThanks = enquirePopup.querySelector('.enquire-thanks');
    const enquireSubmit = enquirePopup.querySelector('.enquire-submit');
    let enquireSent = false;

    if (!enquireSeen()) {
        setTimeout(() => enquirePopup.showModal(), ENQUIRE_DELAY_MS);
    }

    enquirePopup.querySelector('.enquire-close')
        .addEventListener('click', () => enquirePopup.close());

    // Clicking the dark backdrop (never the card) closes it
    enquirePopup.addEventListener('click', (e) => {
        if (e.target === enquirePopup) enquirePopup.close();
    });

    // Fires for the X, the backdrop and Esc alike
    enquirePopup.addEventListener('close', () => {
        markEnquireSeen();
        if (!enquireSent && typeof gtag === 'function') {
            gtag('event', 'enquiry_popup_dismissed');
        }
    });

    enquireForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        enquireSubmit.disabled = true;
        enquireSubmit.textContent = 'Sending...';

        try {
            // no-cors: the POST lands in the sheet but the response is opaque by design
            await fetch(ENQUIRE_FORM_ACTION, {
                method: 'POST',
                mode: 'no-cors',
                body: new FormData(enquireForm)
            });
        } catch (err) {
            console.log('Enquiry submit failed', err);
        }

        enquireSent = true;
        markEnquireSeen();
        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', { form: 'enquire_popup' });
        }

        enquireForm.hidden = true;
        enquireThanks.hidden = false;
        setTimeout(() => enquirePopup.close(), 2500);
    });
}
