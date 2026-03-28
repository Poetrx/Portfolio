/* ============================================
   SCRIPT.JS — Fixed & Enhanced Portfolio Script
   ============================================ */

// ─── ULTRA CURSOR: Dot + Ring + Sparks + Click Burst ─────────
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const sparkCanvas = document.getElementById('cursor-canvas');
const sparkCtx    = sparkCanvas.getContext('2d');

sparkCanvas.width  = window.innerWidth;
sparkCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    sparkCanvas.width  = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
});

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let prevX  = mouseX, prevY = mouseY;
let ringX  = mouseX, ringY = mouseY;
let isHover = false;

// ── Spark particle pool ──
const sparks = [];

class Spark {
    constructor(x, y, burst = false) {
        const angle  = Math.random() * Math.PI * 2;
        const speed  = burst
            ? Math.random() * 7 + 3
            : Math.random() * 2.5 + 0.5;
        this.x    = x;
        this.y    = y;
        this.vx   = Math.cos(angle) * speed;
        this.vy   = Math.sin(angle) * speed - (burst ? 1 : 0);
        this.life = burst ? 1.0 : Math.random() * 0.6 + 0.3;
        this.decay= burst
            ? Math.random() * 0.025 + 0.018
            : Math.random() * 0.04  + 0.03;
        this.size = burst
            ? Math.random() * 4 + 2
            : Math.random() * 2 + 1;
        this.burst = burst;
        // colour: white → red gradient based on life
        this.hue  = Math.random() * 20; // 0-20 = red-orange range
    }
    update() {
        this.x   += this.vx;
        this.y   += this.vy;
        this.vy  += 0.12;           // gravity
        this.vx  *= 0.96;           // drag
        this.life -= this.decay;
        this.size *= 0.97;
    }
    draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        // inner bright core
        const grad = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 2
        );
        grad.addColorStop(0,   `hsla(${this.hue}, 100%, 95%, 1)`);
        grad.addColorStop(0.4, `hsla(${this.hue}, 100%, 60%, 0.8)`);
        grad.addColorStop(1,   `hsla(${this.hue}, 100%, 40%, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }
    isDead() { return this.life <= 0 || this.size < 0.3; }
}

// ── Spawn trail sparks on mouse move ──
let sparkTimer = 0;
window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';

    // Only spawn if moved enough
    const dx   = mouseX - prevX;
    const dy   = mouseY - prevY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    sparkTimer += dist;

    if (sparkTimer > 6) {
        sparkTimer = 0;
        const count = isHover ? 3 : 1;
        for (let i = 0; i < count; i++) {
            sparks.push(new Spark(
                mouseX + (Math.random() - 0.5) * 6,
                mouseY + (Math.random() - 0.5) * 6,
                false
            ));
        }
    }
    prevX = mouseX;
    prevY = mouseY;
});

// ── Click burst ──
document.addEventListener('mousedown', () => {
    cursorRing.classList.add('click');
    cursorDot.style.transform = 'translate(-50%,-50%) scale(0.4)';
    // Burst: 18 sparks
    for (let i = 0; i < 18; i++) {
        sparks.push(new Spark(mouseX, mouseY, true));
    }
});
document.addEventListener('mouseup', () => {
    cursorRing.classList.remove('click');
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
});

// ── Ring smooth follow ──
function animateRing() {
    ringX += (mouseX - ringX) * 0.10;
    ringY += (mouseY - ringY) * 0.10;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// ── Spark render loop ──
function renderSparks() {
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw(sparkCtx);
        if (sparks[i].isDead()) sparks.splice(i, 1);
    }
    requestAnimationFrame(renderSparks);
}
renderSparks();

// ── Hover interactions ──
document.querySelectorAll('a, button, .btn, .services-box, .projects-box, .timeline-content, input, textarea, select, #menu-icon')
    .forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHover = true;
            cursorRing.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            isHover = false;
            cursorRing.classList.remove('hover');
        });
    });

document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '0.7';
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

        // Validate subject select
        const subjectSelect = document.getElementById('subjectSelect');
        if (subjectSelect && !subjectSelect.value) {
            showPopup('⚠️ Pilih subject terlebih dahulu!', 'error');
            subjectSelect.focus();
            return;
        }

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
                // Reset select placeholder appearance
                if (subjectSelect) subjectSelect.selectedIndex = 0;
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