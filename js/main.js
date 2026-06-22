document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth Scrolling for anchor links (if browser doesn't support scroll-behavior: smooth natively)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Registration Form Submission
    const regForm = document.getElementById('registration-form');
    const regSuccess = document.getElementById('registration-success');
    const regResetBtn = document.getElementById('reg-reset-btn');

    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = regForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Submitting...";

            const name = document.getElementById('reg-name').value;
            const phone = document.getElementById('reg-phone').value;
            const interest = document.getElementById('reg-interest').value;
            const address = document.getElementById('reg-address').value;

            try {
                // Call dbSubmitRegistration from database.js
                const result = await dbSubmitRegistration(name, phone, address, interest);
                
                if (result.success) {
                    regForm.style.display = 'none';
                    regSuccess.style.display = 'block';
                    regForm.reset();
                } else {
                    alert("Submission failed. Please try again.");
                }
            } catch (err) {
                console.error("Registration error:", err);
                alert("An error occurred during registration. Please try again.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    if (regResetBtn) {
        regResetBtn.addEventListener('click', () => {
            regSuccess.style.display = 'none';
            regForm.style.display = 'block';
        });
    }
});
