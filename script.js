/* ============================================
   SCRIPT.JS — Enhanced Portfolio Script
   ============================================ */

// ─── Custom Cursor ───────────────────────────
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
document.querySelectorAll('a, button, .btn, .services-box, .projects-box, .timeline-content, input, textarea, #menu-icon')
    .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.6';
});


// ─── Particles Canvas ────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
});

const PARTICLE_COUNT = 80;
const particles = [];

class Particle {
    constructor() { this.reset(); }

    reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.size = Math.random() * 1.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 21, 5, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
}

// Connect nearby particles with lines
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(224, 21, 5, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth   = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();


// ─── Navbar Active + Scroll ───────────────────
const menuIcon = document.querySelector('#menu-icon');
const navbar   = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');
const header   = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const top = window.scrollY;

    // Header shadow on scroll
    header.style.boxShadow = top > 10
        ? '0 4px 40px rgba(0,0,0,0.6)'
        : 'none';

    // Active nav link
    sections.forEach(sec => {
        const offset = sec.offsetTop - 200;
        const height = sec.offsetHeight;
        const id     = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`header nav a[href*="${id}"]`);
            if (active) active.classList.add('active');
        }
    });

    // Trigger scroll reveals
    revealOnScroll();

    // Trigger stat counters once
    triggerCounters();
});

// Menu toggle
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('fa-x');
    navbar.classList.toggle('active');
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('fa-x');
        navbar.classList.remove('active');
    });
});


// ─── Scroll Reveal ────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

function revealOnScroll() {
    revealEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            setTimeout(() => el.classList.add('visible'), i * 60);
        }
    });
}

// Run on load too
revealOnScroll();


// ─── Counter Animation ────────────────────────
const statNums    = document.querySelectorAll('.stat-num');
let countersRan   = false;

function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1600;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

function triggerCounters() {
    if (countersRan) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
        countersRan = true;
        statNums.forEach(num => animateCounter(num));
    }
}

triggerCounters(); // in case already visible on load


// ─── Contact Form Feedback ────────────────────
const form = document.getElementById("contactForm");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const btn = form.querySelector(".submit-btn");
        btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            popup.classList.add("show");

            if (response.ok) {
                popupText.innerText = "✅ Pesan berhasil dikirim!";
                popup.classList.add("success");

                btn.innerHTML = 'Sent! <i class="fa-solid fa-check"></i>';
                form.reset();
            } else {
                popupText.innerText = "❌ Gagal mengirim pesan!";
                popup.classList.add("error");

                btn.innerHTML = 'Try Again';
            }

        } catch (error) {
            popup.classList.add("show");
            popupText.innerText = "⚠️ Error koneksi!";
            popup.classList.add("error");

            btn.innerHTML = 'Error';
        }

        setTimeout(() => {
            popup.classList.remove("show", "success", "error");
            btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            btn.disabled = false;
        }, 3000);
    });
}


// ─── Mobile tap toggle for project cards ─────
const projectBoxes = document.querySelectorAll('.projects-box');
projectBoxes.forEach(box => {
    box.addEventListener('click', e => {
        // Only on touch / small screens
        if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 995) {
            // If clicking the btn inside, let it go
            if (e.target.closest('.btn')) return;
            // Toggle this box, close others
            const isActive = box.classList.contains('active');
            projectBoxes.forEach(b => b.classList.remove('active'));
            if (!isActive) box.classList.add('active');
        }
    });
});

// Close project cards when tapping outside
document.addEventListener('click', e => {
    if (!e.target.closest('.projects-box')) {
        projectBoxes.forEach(b => b.classList.remove('active'));
    }
});
document.querySelectorAll('.services-box').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const cx     = rect.width  / 2;
        const cy     = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) *  6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


// ─── Smooth anchor scroll ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});


