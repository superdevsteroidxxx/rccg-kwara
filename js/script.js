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

// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // We keep monitoring if we want it to re-reveal, but usually once is enough
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all revealable elements
document.querySelectorAll('.reveal, .fade-in-up, .fade-in, .activity-card').forEach(el => {
    observer.observe(el);
});

// Button Interaction Feedback (Micro-animations)
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        // Any specific JS-only hover logic here if needed
    });
});

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

        // Basic Validation
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444'; // Error color
                setTimeout(() => input.style.borderColor = '', 3000);
            }
        });

        if (!isValid) {
            alert('Please fill out all required fields.');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            // Check if it's the main contact form to use EmailJS
            if (form.id === 'main-contact-form') {
                const serviceID = 'service_nr5yl6q';
                const templateID = 'template_b2nozhr';

                emailjs.sendForm(serviceID, templateID, form)
                    .then(() => {
                        alert('Thank you! Your message has been received.');
                        btn.textContent = originalText;
                        btn.disabled = false;
                        form.reset();
                    }, (err) => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        alert('Failed to send message: ' + JSON.stringify(err));
                    });
            } else {
                // Fallback / Other forms
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
    apiKey: 'AIzaSyDm2jXg-L2ZVVxLx2fcRrp8JB60TDNaYu4', // User provided Google API Key
    calendarId: '48c138c152ca3d30e8ded5c0c28c05ebddab2c67ba2f8bc68f7cf889cc45e36c@group.calendar.google.com',
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
            description: "Join us for a powerful time of worship and the word. Experience divine transformation in His presence.",
            start: { dateTime: getNextDayOfWeek(new Date(), 0, "08:00") },
            htmlLink: "#"
        },
        {
            summary: "Digging Deep (Bible Study)",
            description: "An intensive study of God's word every Tuesday. Grow deeper in your knowledge of Christ.",
            start: { dateTime: getNextDayOfWeek(new Date(), 2, "17:00") },
            htmlLink: "#"
        },
        {
            summary: "Faith Clinic (Prayer Meeting)",
            description: "A mid-week encounter for miracles and breakthroughs every Thursday. Come and pray your way to victory.",
            start: { dateTime: getNextDayOfWeek(new Date(), 4, "17:00") },
            htmlLink: "#"
        }
    ];

    if (message) {
        console.warn('Calendar Fallback:', message);
        // Optionally show a subtle notice that these are recurring events
        const notice = document.createElement('p');
        notice.className = 'center-text';
        notice.style.fontSize = '0.8rem';
        notice.style.opacity = '0.7';
        notice.style.marginBottom = '2rem';
        notice.textContent = '(Showing our regular weekly programs)';
        eventsContainer.before(notice);
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
    fetchBloggerPosts();
    fetchLatestSermons();
});

// YouTube Integration
const YOUTUBE_CONFIG = {
    apiKey: 'AIzaSyDm2jXg-L2ZVVxLx2fcRrp8JB60TDNaYu4', // Reusing existing Google API Key
    channelId: 'UCHp4qCAPmz7-5BJ601FDFnA', // Extracted from "View All" link
    maxResults: 3
};

async function fetchLatestSermons() {
    const sermonsContainer = document.getElementById('sermons-container');
    if (!sermonsContainer) return;

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_CONFIG.apiKey}&channelId=${YOUTUBE_CONFIG.channelId}&part=snippet,id&order=date&maxResults=${YOUTUBE_CONFIG.maxResults}&type=video`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('YouTube API Error:', data.error);
            renderFallbackSermons();
            return;
        }

        const videos = data.items || [];
        if (videos.length === 0) {
            renderFallbackSermons();
            return;
        }

        renderSermons(videos);
    } catch (error) {
        console.error('Fetch Error:', error);
        renderFallbackSermons();
    }
}

function renderSermons(videos) {
    const sermonsContainer = document.getElementById('sermons-container');
    sermonsContainer.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const snippet = video.snippet;
        const publishedAt = new Date(snippet.publishedAt);
        const formattedDate = publishedAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const sermonCard = document.createElement('div');
        sermonCard.className = 'sermon-card fade-in visible';
        sermonCard.dataset.videoId = videoId;
        sermonCard.innerHTML = `
            <div class="sermon-thumbnail" style="background-image: url('${snippet.thumbnails.high.url}');">
                <div class="play-overlay">
                    <span class="play-icon">▶</span>
                </div>
            </div>
            <div class="sermon-content">
                <span class="sermon-date">${formattedDate}</span>
                <h3>${snippet.title}</h3>
                <p class="pastor">RCCG Kwara</p>
                <div class="sermon-actions">
                    <button class="btn-text" data-action="watch">Watch</button>
                    <button class="btn-text" data-action="listen">Listen</button>
                </div>
            </div>
        `;
        sermonsContainer.appendChild(sermonCard);

        // Connect play button and watch button to modal
        sermonCard.querySelectorAll('.play-overlay, button[data-action="watch"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openVideoModal(videoId);
            });
        });

        sermonCard.querySelector('button[data-action="listen"]').addEventListener('click', () => {
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        });
    });
}

function renderFallbackSermons() {
    const sermonsContainer = document.getElementById('sermons-container');
    // Fallback static data if API fails
    const fallbacks = [
        { id: "bH7KTcePBBw", title: "Year 2025 Prophecy", date: "Jan 01, 2025" },
        { id: "yT53yVmCLzU", title: "Year 2024 Prophecy", date: "Jan 01, 2024" },
        { id: "ltNSISmUBkE", title: "Let's Go A Fishing - Imeko", date: "Dec 24, 2023" }
    ];

    sermonsContainer.innerHTML = '';
    fallbacks.forEach(v => {
        const card = document.createElement('div');
        card.className = 'sermon-card fade-in visible';
        card.dataset.videoId = v.id;
        card.innerHTML = `
            <div class="sermon-thumbnail" style="background-image: url('https://img.youtube.com/vi/${v.id}/maxresdefault.jpg');">
                <div class="play-overlay">
                    <span class="play-icon">▶</span>
                </div>
            </div>
            <div class="sermon-content">
                <span class="sermon-date">${v.date}</span>
                <h3>${v.title}</h3>
                <p class="pastor">Pastor E.A. Adeboye</p>
                <div class="sermon-actions">
                    <button class="btn-text" data-action="watch">Watch</button>
                    <button class="btn-text" data-action="listen">Listen</button>
                </div>
            </div>
        `;
        sermonsContainer.appendChild(card);
    });

    // Setup modal listeners for fallbacks too
    setupVideoListeners();
}

// Helper to open video modal
function openVideoModal(videoId) {
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');
    if (videoModal && videoFrame) {
        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoModal.classList.add('active');
    }
}

// Factor out common listener setup if needed, but the current modal logic in script.js covers existing ones.
// I'll make sure the dynamic ones are connected.

function setupVideoListeners() {
    document.querySelectorAll('.sermon-card[data-video-id]').forEach(card => {
        const videoId = card.dataset.videoId;
        card.querySelectorAll('.play-overlay, button[data-action="watch"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openVideoModal(videoId);
            });
        });
    });
}

// Blogger Integration
const BLOGGER_CONFIG = {
    apiKey: 'AIzaSyDm2jXg-L2ZVVxLx2fcRrp8JB60TDNaYu4', // User provided Google API Key
    blogId: '7422691926526728557', // Verified Blog ID for rccgkwaraprovince3.blogspot.com
    postsLimit: 3
};

async function fetchBloggerPosts() {
    const activitiesContainer = document.getElementById('activities-container');
    if (!activitiesContainer) return;

    try {
        // Build API URL using official v3 endpoint
        let url = `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_CONFIG.blogId}/posts?maxResults=${BLOGGER_CONFIG.postsLimit}`;

        // Append API Key if available
        if (BLOGGER_CONFIG.apiKey) {
            url += `&key=${BLOGGER_CONFIG.apiKey}`;
        }

        // If authenticated, use the access token (OAuth2)
        const token = sessionStorage.getItem('blogger_access_token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let response = await fetch(url, { headers });

        // If API v3 fails (common without key), fallback to public Atom/JSON feed
        if (!response.ok) {
            console.log('Blogger API v3 failed, attempting public feed fallback...');
            const feedUrl = `https://rccgkwaraprovince3.blogspot.com/feeds/posts/default?alt=json&max-results=${BLOGGER_CONFIG.postsLimit}`;
            response = await fetch(feedUrl);

            if (!response.ok) throw new Error('All Blogger fetch attempts failed');

            const feedData = await response.json();
            renderBloggerFeed(feedData.feed.entry || []);
            return;
        }

        const data = await response.json();
        const posts = data.items || [];

        if (posts.length === 0) {
            activitiesContainer.innerHTML = '<div class="center-text"><p>Stay tuned for our latest activities!</p></div>';
            return;
        }

        renderBloggerPosts(posts);
    } catch (error) {
        console.error('Blogger API Error:', error);
        renderFallbackActivities();
    }
}

function renderBloggerPosts(posts) {
    const activitiesContainer = document.getElementById('activities-container');
    activitiesContainer.innerHTML = '';
    const isLoggedIn = sessionStorage.getItem('blogger_access_token') !== null;

    posts.forEach(post => {
        const title = post.title;
        const link = post.url;
        const publishedDate = new Date(post.published);
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Extract thumbnail
        let thumbnailUrl = 'images/about-community.png'; // Fallback
        if (post.images && post.images.length > 0) {
            thumbnailUrl = post.images[0].url;
        } else if (post.content) {
            const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) thumbnailUrl = imgMatch[1];
        }

        // Create summary (remove HTML tags and truncate)
        let summary = 'Read more about our latest activity...';
        if (post.content) {
            summary = post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
        }

        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card fade-in';

        // Add Edit controls if logged in
        const adminControls = isLoggedIn ? `
            <div class="admin-post-controls">
                <a href="https://www.blogger.com/blog/post/edit/${BLOGGER_CONFIG.blogId}/${post.id}" target="_blank" class="btn-edit"><i class="fas fa-edit"></i> Edit</a>
            </div>
        ` : '';

        activityCard.innerHTML = `
            <div class="activity-thumbnail" style="background-image: url('${thumbnailUrl}');">
                ${adminControls}
            </div>
            <div class="activity-content">
                <span class="activity-date">${formattedDate}</span>
                <h3>${title}</h3>
                <p>${summary}</p>
                <div class="activity-actions">
                    <a href="${link}" target="_blank" class="activity-link">Read More &rarr;</a>
                </div>
            </div>
        `;
        activitiesContainer.appendChild(activityCard);

        // Connect to observer
        if (typeof observer !== 'undefined') {
            observer.observe(activityCard);
        }
    });
}

function renderFallbackActivities() {
    const activitiesContainer = document.getElementById('activities-container');

    // Fallback data if API fails or for demonstration
    const featuredActivities = [
        {
            title: "Community Outreach 2026",
            date: "Feb 15, 2026",
            summary: "Our annual community outreach was a huge success. We were able to reach over 500 families with food and medical supplies.",
            thumbnail: "images/ministry-outreach.png",
            link: "https://rccgkwaraprovince3.blogspot.com"
        },
        {
            title: "Youth Summit Recap",
            date: "Jan 10, 2026",
            summary: "The NextGen Youth Summit brought together hundreds of young leaders for a weekend of inspiration and growth.",
            thumbnail: "images/youth.png",
            link: "https://rccgkwaraprovince3.blogspot.com"
        },
        {
            title: "New Sunday Service Times",
            date: "Jan 01, 2026",
            summary: "To better serve our growing community, we are introducing a second service starting this Sunday.",
            thumbnail: "images/about-community.png",
            link: "https://rccgkwaraprovince3.blogspot.com"
        }
    ];
    activitiesContainer.innerHTML = '';
    featuredActivities.forEach(item => {
        const card = document.createElement('div');
        card.className = 'activity-card fade-in visible';
        card.innerHTML = `
            <div class="activity-thumbnail" style="background-image: url('${item.thumbnail}');"></div>
            <div class="activity-content">
                <span class="activity-date">${item.date}</span>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <a href="${item.link}" target="_blank" class="activity-link">Read More &rarr;</a>
            </div>
        `;
        activitiesContainer.appendChild(card);
    });
}

function renderBloggerFeed(entries) {
    const activitiesContainer = document.getElementById('activities-container');
    if (!activitiesContainer) return;
    activitiesContainer.innerHTML = '';

    entries.forEach(entry => {
        const title = entry.title.$t;
        const alternateLink = entry.link.find(l => l.rel === 'alternate');
        const link = alternateLink ? alternateLink.href : '#';
        const publishedDate = new Date(entry.published.$t);
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Extract thumbnail
        let thumbnailUrl = 'images/about-community.png'; // Fallback
        if (entry['media$thumbnail']) {
            thumbnailUrl = entry['media$thumbnail'].url.replace('/s72-c/', '/s1600/'); // Get higher res
        } else if (entry.content && entry.content.$t) {
            const imgMatch = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) thumbnailUrl = imgMatch[1];
        }

        // Create summary
        let summary = 'Read more about our latest activity...';
        if (entry.content && entry.content.$t) {
            summary = entry.content.$t.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
        } else if (entry.summary && entry.summary.$t) {
            summary = entry.summary.$t.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
        }

        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card fade-in';

        // Add Edit controls if logged in
        const isLoggedIn = sessionStorage.getItem('blogger_access_token') !== null;
        const entryId = entry.id.$t.split('post-')[1];
        const adminControls = isLoggedIn ? `
            <div class="admin-post-controls">
                <a href="https://www.blogger.com/blog/post/edit/${BLOGGER_CONFIG.blogId}/${entryId}" target="_blank" class="btn-edit"><i class="fas fa-edit"></i> Edit</a>
            </div>
        ` : '';

        activityCard.innerHTML = `
            <div class="activity-thumbnail" style="background-image: url('${thumbnailUrl}');">
                ${adminControls}
            </div>
            <div class="activity-content">
                <span class="activity-date">${formattedDate}</span>
                <h3>${title}</h3>
                <p>${summary}</p>
                <div class="activity-actions">
                    <a href="${link}" target="_blank" class="activity-link">Read More &rarr;</a>
                </div>
            </div>
        `;
        activitiesContainer.appendChild(activityCard);

        if (typeof observer !== 'undefined') {
            observer.observe(activityCard);
        }
    });
}
