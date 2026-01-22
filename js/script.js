// Mobile Navigation Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileBtn.classList.remove('active');
        });
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
    el.style.opacity = '0'; // Initial state for JS-enabled browsers
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add 'visible' class styles dynamically or rely on Inline styles above
// Note: Ideally, this would be in CSS, but for quick JS control:
const styleParams = document.createElement('style');
styleParams.innerHTML = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(styleParams);

// Modal Logic
const modal = document.getElementById('visit-modal');
const modalClose = document.getElementById('modal-close');
const planVisitBtns = document.querySelectorAll('.btn-primary-nav');

if (modal) {
    // Open Modal
    planVisitBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    // Close Modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Button Interaction Feedback
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});

// Form Handling
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you! Your message has been received.');
                btn.textContent = originalText;
                btn.disabled = false;
                form.reset();
                if (modal && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            }, 1000);
        }
    });
});


// Sermon Video Modal Logic
const videoModal = document.getElementById('video-modal');
const videoModalClose = document.getElementById('video-modal-close');
const videoFrame = document.getElementById('video-frame');
// Placeholder video links (replace with actual sermon links)
const defaultVideoUrl = "https://www.youtube.com/embed/bH7KTcePBBw?autoplay=1"; // RCCG Prophecy placeholder

if (videoModal) {
    // Open Video Modal
    document.querySelectorAll('.sermon-actions button, .play-overlay').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.sermon-card');
            const videoId = card.dataset.videoId || "bH7KTcePBBw";
            videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            videoModal.classList.add('active');
        });
    });

    // Close Video Modal
    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        // Stop video playback by resetting src
        videoFrame.src = "";
    };

    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }

    // Close on click outside
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}
// Google Calendar Integration
const CALENDAR_CONFIG = {
    apiKey: 'YOUR_GOOGLE_CLOUD_API_KEY', // USER: Replace with your API Key
    calendarId: 'YOUR_CALENDAR_ID@group.calendar.google.com', // USER: Replace with your Calendar ID
    eventsLimit: 5
};

async function fetchUpcomingEvents() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;

    // Use a placeholder message if keys are not set
    if (CALENDAR_CONFIG.apiKey === 'YOUR_GOOGLE_CLOUD_API_KEY' || CALENDAR_CONFIG.calendarId.includes('YOUR_CALENDAR_ID')) {
        renderFallbackEvents();
        return;
    }

    try {
        const now = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_CONFIG.calendarId)}/events?key=${CALENDAR_CONFIG.apiKey}&timeMin=${now}&maxResults=${CALENDAR_CONFIG.eventsLimit}&singleEvents=true&orderBy=startTime`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('Calendar API Error:', data.error);
            renderFallbackEvents('Error loading events. Please check configuration.');
            return;
        }

        const events = data.items || [];
        if (events.length === 0) {
            renderFallbackEvents('No upcoming events found.');
            return;
        }

        renderEvents(events);
    } catch (error) {
        console.error('Fetch Error:', error);
        renderFallbackEvents('Unable to connect to Google Calendar.');
    }
}

function renderEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';

    events.forEach(event => {
        const start = new Date(event.start.dateTime || event.start.date);
        const day = start.getDate();
        const month = start.toLocaleString('default', { month: 'short' }).toUpperCase();

        const eventItem = document.createElement('div');
        eventItem.className = 'event-item fade-in-up visible'; // Make visible immediately since it's injected
        eventItem.innerHTML = `
            <div class="event-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="event-details">
                <h3>${event.summary}</h3>
                <p>${event.description || 'Join us for this special event!'}</p>
            </div>
            <a href="${event.htmlLink}" target="_blank" class="btn-sm">Details</a>
        `;
        eventsContainer.appendChild(eventItem);
    });
}

function renderFallbackEvents(message) {
    const eventsContainer = document.getElementById('events-container');

    // Curated fallback events to show when API is not configured
    const featuredEvents = [
        {
            summary: "Sunday Celebration Service",
            description: "Join us for a powerful time of worship and the word.",
            start: { dateTime: getNextDayOfWeek(new Date(), 0, "08:00") },
            htmlLink: "#"
        },
        {
            summary: "Digging Deep (Bible Study)",
            description: "An intensive study of God's word every Tuesday.",
            start: { dateTime: getNextDayOfWeek(new Date(), 2, "17:00") },
            htmlLink: "#"
        },
        {
            summary: "Faith Clinic (Prayer Meeting)",
            description: "A mid-week encounter for miracles and breakthroughs every Thursday.",
            start: { dateTime: getNextDayOfWeek(new Date(), 4, "17:00") },
            htmlLink: "#"
        }
    ];

    if (message) {
        console.warn('Calendar Fallback:', message);
    }

    renderEvents(featuredEvents);
}

// Helper to get next occurrence of a day (0=Sunday, 2=Tuesday, etc)
function getNextDayOfWeek(date, dayOfWeek, timeStr) {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    const [hours, minutes] = timeStr.split(':');
    resultDate.setHours(hours, minutes, 0, 0);
    return resultDate;
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    fetchUpcomingEvents();
});
