// MP Travels - Interactive App Script

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scrolled Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Toggle animation on hamburger bars
            const bars = mobileToggle.querySelectorAll('.bar');
            if (mobileToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                const bars = mobileToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // 3. Update Active Navigation Link on Scroll (Intersection Observer)
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies mid-screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 4. Set Default Date in Booking Form (Today)
    const dateInput = document.getElementById('travel-date');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        
        dateInput.value = `${year}-${month}-${day}`;
        dateInput.min = `${year}-${month}-${day}`;
    }

    // 5. Booking Inquiry Form Submission -> Redirect to WhatsApp
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const pickup = document.getElementById('pickup-loc').value.trim();
            const drop = document.getElementById('drop-loc').value.trim();
            const date = document.getElementById('travel-date').value;
            const time = document.getElementById('travel-time').value;
            const vehicle = document.getElementById('vehicle-type').value;

            // Base WhatsApp travel link details
            const whatsappNumber = '919688595843'; // MP Travels Official Number
            
            // Format dates for display
            const formattedDate = new Date(date).toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            // Format message
            const message = `Hi MP Travels, I would like to inquire about booking a cab/car:\n\n` +
                            `📍 *Pickup:* ${pickup}\n` +
                            `🏁 *Drop:* ${drop}\n` +
                            `📅 *Date:* ${formattedDate}\n` +
                            `⏰ *Time:* ${time}\n` +
                            `🚗 *Vehicle Class:* ${vehicle}\n\n` +
                            `Please let me know the estimated fare and availability. Thank you!`;

            // URL Encode the message
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Open WhatsApp in a new tab
            window.open(whatsappURL, '_blank');
        });
    }

    // 6. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = question.nextElementSibling;
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            
            // Close other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                    otherQuestion.parentElement.classList.remove('active');
                }
            });

            // Toggle current FAQ
            if (isOpen) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
                faqItem.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                faqItem.classList.add('active');
            }
        });
    });

    // 7. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check localStorage or system preference
        const currentTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    // 8. Tour Packages Tab Switcher
    const tourTabs = document.querySelectorAll('.tour-tab-btn');
    const tourGrids = document.querySelectorAll('.tour-grid');

    tourTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');

            // Deactivate all tabs
            tourTabs.forEach(t => t.classList.remove('active'));
            // Activate current tab
            tab.classList.add('active');

            // Hide all grids
            tourGrids.forEach(grid => {
                grid.classList.remove('active');
                grid.style.display = 'none';
            });

            // Show active grid
            const activeGrid = document.getElementById(targetId);
            if (activeGrid) {
                activeGrid.style.display = 'grid';
                setTimeout(() => {
                    activeGrid.classList.add('active');
                }, 10);
            }
        });
    });
});
