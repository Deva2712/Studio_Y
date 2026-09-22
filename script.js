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

// ===== Campaign tracking =====
// Captured the moment someone lands and kept for 30 days, so a visitor who
// arrives from an ad today and enquires next week is still credited to it.
const TRACKED_PARAMS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'gclid', 'fbclid'
];
const TRACKING_TTL_DAYS = 30;

function setTrackingCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) +
        ';expires=' + expires + ';path=/;SameSite=Lax';
}

function getTrackingCookie(name) {
    const match = document.cookie.match('(^|; )' + name + '=([^;]*)');
    return match ? decodeURIComponent(match[2]) : '';
}

// Last touch wins: the most recent campaign that brought them back gets credit
const landingParams = new URLSearchParams(window.location.search);
TRACKED_PARAMS.forEach((key) => {
    if (landingParams.has(key)) {
        setTrackingCookie(key, landingParams.get(key), TRACKING_TTL_DAYS);
    }
});

function campaignSource() {
    const parts = ['utm_source', 'utm_medium', 'utm_campaign']
        .map(getTrackingCookie)
        .filter(Boolean);
    return parts.length ? parts.join(' / ') : 'direct';
}

// ===== Enquiry forms (popup + the one inside About Us) =====
const ENQUIRE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdhc8doducXndRq6B5xxfHtA39i5Q-1T1pWz4JVCanug5_Whw/formResponse';

// Add "Source" and "GCLID" questions to the Google Form, then paste their
// entry.NNNNN ids here. Left blank, the fields simply are not sent.
const ENQUIRE_SOURCE_ENTRY = '';
const ENQUIRE_GCLID_ENTRY = '';

const ENQUIRE_SEEN_KEY = 'studioy_enquire_seen';
const ENQUIRE_DELAY_MS = 7000;

// localStorage throws in some private-browsing modes - never let it break the popup
function enquireSeen() {
    try { return localStorage.getItem(ENQUIRE_SEEN_KEY) === '1'; } catch (e) { return false; }
}
function markEnquireSeen() {
    try { localStorage.setItem(ENQUIRE_SEEN_KEY, '1'); } catch (e) { /* ignore */ }
}

function enquirePanel(form) {
    return form.closest('.enquire-inner, .about-enquire');
}

function resetEnquiry(form) {
    const button = form.querySelector('.enquire-submit');
    form.reset();
    form.hidden = false;
    enquirePanel(form).querySelector('.enquire-thanks').hidden = true;
    button.disabled = false;
    button.textContent = form.dataset.submitLabel;
}

document.querySelectorAll('.enquire-form').forEach((form) => {
    const button = form.querySelector('.enquire-submit');
    form.dataset.submitLabel = button.textContent;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        button.disabled = true;
        button.textContent = 'Sending...';

        const data = new FormData(form);
        if (ENQUIRE_SOURCE_ENTRY) data.append(ENQUIRE_SOURCE_ENTRY, campaignSource());
        if (ENQUIRE_GCLID_ENTRY) data.append(ENQUIRE_GCLID_ENTRY, getTrackingCookie('gclid'));

        try {
            // no-cors: the POST lands in the sheet but the response is opaque by design
            await fetch(ENQUIRE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: data });
        } catch (err) {
            console.log('Enquiry submit failed', err);
        }

        if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', { form: form.dataset.formName || 'enquire' });
        }

        form.hidden = true;
        enquirePanel(form).querySelector('.enquire-thanks').hidden = false;
        form.dispatchEvent(new CustomEvent('enquiry:sent'));
    });
});

// ===== Popup behaviour =====
const enquirePopup = document.getElementById('enquire-popup');

if (enquirePopup) {
    const popupForm = enquirePopup.querySelector('.enquire-form');
    const popupTitle = enquirePopup.querySelector('#enquire-popup-title');
    let popupSent = false;

    // Reopening must show a fresh form, not the thank-you note from last time
    function openEnquire(title) {
        resetEnquiry(popupForm);
        popupTitle.textContent = title || 'ENQUIRE NOW';
        popupSent = false;
        enquirePopup.showModal();
    }

    // The 7s auto-open happens once; the floating buttons always work
    if (!enquireSeen()) {
        setTimeout(() => openEnquire(), ENQUIRE_DELAY_MS);
    }

    document.querySelectorAll('.enquire-fab, .callback-fab').forEach((fab) => {
        fab.addEventListener('click', () => openEnquire(fab.dataset.popupTitle));
    });

    enquirePopup.querySelector('.enquire-close')
        .addEventListener('click', () => enquirePopup.close());

    // Clicking the dark backdrop (never the card) closes it
    enquirePopup.addEventListener('click', (e) => {
        if (e.target === enquirePopup) enquirePopup.close();
    });

    // Fires for the X, the backdrop and Esc alike
    enquirePopup.addEventListener('close', () => {
        markEnquireSeen();
        if (!popupSent && typeof gtag === 'function') {
            gtag('event', 'enquiry_popup_dismissed');
        }
    });

    popupForm.addEventListener('enquiry:sent', () => {
        popupSent = true;
        markEnquireSeen();
        setTimeout(() => enquirePopup.close(), 2500);
    });
}
