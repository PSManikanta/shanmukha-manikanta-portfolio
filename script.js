// =========================================
// EMAIL HANDLER — mailto with Gmail fallback
// =========================================
// Tries native mailto: first (opens mail app on mobile).
// If no mail client handles it within 1.5s, falls back to Gmail web compose.
function handleEmail(e) {
    e.preventDefault();
    const email = 'manipolamuri6@gmail.com';
    const mailtoUrl = 'mailto:' + email;
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + email;

    // Track if the page loses focus (means mail app opened)
    let mailOpened = false;

    function onBlur() {
        mailOpened = true;
        window.removeEventListener('blur', onBlur);
    }
    window.addEventListener('blur', onBlur);

    // Try opening mailto:
    window.location.href = mailtoUrl;

    // If nothing happened after 1.5s, fall back to Gmail web
    setTimeout(() => {
        window.removeEventListener('blur', onBlur);
        if (!mailOpened) {
            window.open(gmailUrl, '_blank');
        }
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. PARTICLE BACKGROUND
    // =========================================
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 80;
        const CONNECT_DISTANCE = 120;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DISTANCE) {
                        const opacity = (1 - dist / CONNECT_DISTANCE) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // =========================================
    // 2. CURSOR GLOW (desktop only)
    // =========================================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(updateGlow);
        }
        updateGlow();
    }

    // =========================================
    // 3. TYPED TEXT EFFECT (hero subtitle)
    // =========================================
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = [
            'I build things for the web.',
            'Full-Stack Developer.',
            'Java & React Enthusiast.',
            'Problem Solver.',
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 100;

        function type() {
            const current = phrases[phraseIndex];

            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                delay = 40;
            } else {
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                delay = 90;
            }

            if (!isDeleting && charIndex === current.length) {
                delay = 2200; // pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 500;
            }

            setTimeout(type, delay);
        }
        type();
    }

    // =========================================
    // 4. MOBILE MENU
    // =========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.replace('fa-xmark', 'fa-bars');
            } else {
                icon.classList.replace('fa-bars', 'fa-xmark');
            }
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // =========================================
    // 5. NAVBAR SCROLL EFFECT
    // =========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // =========================================
    // 6. SCROLL REVEAL ANIMATIONS (staggered)
    // =========================================
    function setupReveal() {
        // Standard reveal-up
        document.querySelectorAll(
            'section:not(#home) .glass-panel,' +
            'section:not(#home) h2,' +
            'section > div > div.grid > div,' +
            'section > div > div.space-y-12 > div,' +
            'section > div > div.mt-20,' +
            '.contact-card'
        ).forEach((el, i) => {
            if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
                el.classList.add('reveal');
                el.style.transitionDelay = `${(i % 5) * 0.08}s`;
            }
        });
    }
    setupReveal();

    function triggerReveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        const windowHeight = window.innerHeight;

        reveals.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - 80) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', triggerReveal, { passive: true });
    triggerReveal(); // initial check

    // =========================================
    // 7. COUNTER ANIMATION (stats)
    // =========================================
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                let count = 0;
                const step = Math.ceil(target / 50);
                const interval = setInterval(() => {
                    count += step;
                    if (count >= target) {
                        el.textContent = target + '+';
                        clearInterval(interval);
                    } else {
                        el.textContent = count + '+';
                    }
                }, 30);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // =========================================
    // 8. ACTIVE NAV LINK HIGHLIGHT
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('text-white');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-white');
            }
        });
    }, { passive: true });

    // =========================================
    // 9. TILT EFFECT ON PROJECT CARDS
    // =========================================
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });

    // =========================================
    // 10. SKILL CARDS — Staggered Reveal & Glow
    // =========================================
    const skillCards = document.querySelectorAll('.skill-card');

    // Set per-card glow RGB variable from data-color attribute
    skillCards.forEach(card => {
        const rgb = card.getAttribute('data-color');
        if (rgb) {
            card.querySelector('.skill-card-inner').style.setProperty('--glow-rgb', rgb);
        }
    });

    // Staggered entrance using IntersectionObserver
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.skill-card');
                cards.forEach((card, i) => {
                    card.style.animationDelay = `${i * 0.08}s`;
                    card.classList.add('skill-card-visible');
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        // Pause animations until visible
        skillCards.forEach(card => {
            card.style.animationPlayState = 'paused';
        });
        skillObserver.observe(skillsSection);
    }
});
