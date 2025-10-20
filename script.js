document.addEventListener('DOMContentLoaded', function () {
    // INITIALIZE AOS
    AOS.init({
        duration: 800,
        once: true,
    });

    // THEME TOGGLE SCRIPT
    const themeToggleBtn = document.getElementById('theme-toggle');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const htmlElement = document.documentElement;

    const applyTheme = (isDark) => {
        htmlElement.classList.toggle('dark', isDark);
        lightIcon.classList.toggle('hidden', isDark);
        darkIcon.classList.toggle('hidden', !isDark);
        try {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        } catch (e) {
            console.error("LocalStorage is not available.");
        }
    };

    let userTheme = null;
    try {
        userTheme = localStorage.getItem('theme');
    } catch (e) { /* ignore */ }

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme((userTheme === 'dark') || (!userTheme && systemTheme));

    themeToggleBtn.addEventListener('click', () => applyTheme(!htmlElement.classList.contains('dark')));


    // MOBILE MENU SCRIPT
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // ACTIVE NAV LINK HIGHLIGHTER
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#desktop-nav a.nav-link');
    const observer = new IntersectionObserver((entries) => {
        let currentActive = '';
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                currentActive = entry.target.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            // Check if link exists before trying to access getAttribute
            if (link && link.getAttribute('href') === `#${currentActive}`) {
                link.classList.add('active-link');
            }
        });

    }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));


    // DYNAMIC LIVE SECTION SCRIPT
    const liveTitle = document.getElementById('live-title');
    const liveSubtitle = document.getElementById('live-subtitle');
    const videoPlayer = document.getElementById('video-player');

    const YOUTUBE_LIVE_CHANNEL_ID = "UCnqZH6hREmMSrVFED-aNwew";
    const YOUTUBE_LIVE_STREAM_URL = `https://www.youtube.com/embed/live_stream?channel=${YOUTUBE_LIVE_CHANNEL_ID}`;
    const YOUTUBE_MOST_RECENT_VIDEO_ID = "G8OBrgILBS0";
    const YOUTUBE_MOST_RECENT_URL = `https://www.youtube.com/embed/${YOUTUBE_MOST_RECENT_VIDEO_ID}`;


    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" }));
    const day = now.getDay();
    const hour = now.getHours();

    const isLive = (day === 0 && hour >= 9 && hour < 12); // Sunday between 9 AM and 12 PM in Lagos

    // Check if elements exist before modifying
    if (liveTitle && liveSubtitle && videoPlayer) {
        if (isLive) {
            liveTitle.textContent = "We Are Live Now!";
            liveSubtitle.textContent = "Welcome! We're so glad you're here!!. Feel free to say hello in the chat.";
            videoPlayer.src = YOUTUBE_LIVE_STREAM_URL;
        } else {
            liveTitle.textContent = "Watch Our Latest Service";
            liveSubtitle.textContent = "We're not live right now, but you can watch our most recent message below. We invite you to join us online this Sunday!";
            videoPlayer.src = YOUTUBE_MOST_RECENT_URL;
        }
    }

    // SERMON SEARCH FILTER
    const searchInput = document.getElementById('sermon-search');
    const sermonCards = document.querySelectorAll('.sermon-card');
    const noResultsMessage = document.getElementById('no-sermons-found');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let visibleCount = 0;
            sermonCards.forEach(card => {
                const title = card.dataset.title ? card.dataset.title.toLowerCase() : '';
                const speaker = card.dataset.speaker ? card.dataset.speaker.toLowerCase() : '';
                const isVisible = title.includes(searchTerm) || speaker.includes(searchTerm);
                card.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleCount++;
            });

            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    }

    // EMAILJS INTEGRATION
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        // IMPORTANT: Go to emailjs.com, create an account, and get your keys.
        // Replace the placeholder values below with your actual keys.
        emailjs.init('YOUR_PUBLIC_KEY');

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'text-center mt-4';

            const serviceID = 'YOUR_SERVICE_ID';
            const templateID = 'YOUR_TEMPLATE_ID';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.classList.add('text-green-500');
                    contactForm.reset();
                }, (err) => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                    formStatus.textContent = 'Failed to send. Please try again.';
                    formStatus.classList.add('text-red-500');
                    console.error('EmailJS Error:', JSON.stringify(err));
                });
        });
    }

});