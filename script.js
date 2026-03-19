/* ============================================
   SCRIPT.JS — Fixed & Enhanced Portfolio Script
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

function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .btn, .services-box, .projects-box, .timeline-content, input, textarea, #menu-icon')
    .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

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
        this.x       = Math.random() * canvas.width;
        this.y       = Math.random() * canvas.height;
        this.size    = Math.random() * 1.8 + 0.3;
        this.speedX  = (Math.random() - 0.5) * 0.4;
        this.speedY  = (Math.random() - 0.5) * 0.4;
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

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

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
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const top = window.scrollY;

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

    revealOnScroll();
    triggerCounters();
    animateSkillBars();

    // Back to top button
    if (top > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to top click
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Menu toggle
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('fa-x');
    navbar.classList.toggle('active');
});

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
revealOnScroll();


// ─── Counter Animation ────────────────────────
const statNums  = document.querySelectorAll('.stat-num');
let countersRan = false;

function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1600;
    const step     = target / (duration / 16);
    let current    = 0;
    const timer    = setInterval(() => {
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
triggerCounters();


// ─── Skill Bar Animation (NEW) ────────────────
const skillFills = document.querySelectorAll('.skill-fill');
let skillsAnimated = false;

function animateSkillBars() {
    if (skillsAnimated) return;
    const section = document.querySelector('.skills-section');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
        skillsAnimated = true;
        skillFills.forEach((fill, i) => {
            const target = fill.getAttribute('data-width');
            setTimeout(() => {
                fill.style.width = target + '%';
            }, i * 120);
        });
    }
}
animateSkillBars();


// ─── Toast Popup Helper (FIX) ─────────────────
const popup     = document.getElementById('popup');
const popupText = document.getElementById('popup-text');

function showPopup(message, type = 'success') {
    popupText.textContent = message;
    popup.className = '';              // reset classes
    popup.classList.add('show', type);

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3500);
}


// ─── Contact Form — FIXED (single handler) ────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Loading state
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled  = true;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showPopup('✅ Pesan berhasil dikirim!', 'success');
                contactForm.reset();
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            } else {
                const data = await response.json();
                const errMsg = data?.errors?.map(e => e.message).join(', ') || 'Gagal mengirim pesan.';
                showPopup('❌ ' + errMsg, 'error');
                submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            }
        } catch (err) {
            showPopup('⚠️ Error koneksi. Coba lagi!', 'error');
            submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        } finally {
            submitBtn.disabled = false;
        }
    });
}


// ─── Services Card 3D Tilt ────────────────────
document.querySelectorAll('.services-box').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect    = card.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const cx      = rect.width  / 2;
        const cy      = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -6;
        const rotateY = ((x - cx) / cx) *  6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});


// ─── Mobile tap toggle for project cards ─────
const projectBoxes = document.querySelectorAll('.projects-box');
projectBoxes.forEach(box => {
    box.addEventListener('click', e => {
        if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 995) {
            if (e.target.closest('.btn')) return;
            const isActive = box.classList.contains('active');
            projectBoxes.forEach(b => b.classList.remove('active'));
            if (!isActive) box.classList.add('active');
        }
    });
});

document.addEventListener('click', e => {
    if (!e.target.closest('.projects-box')) {
        projectBoxes.forEach(b => b.classList.remove('active'));
    }
});


// ─── Smooth anchor scroll ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});