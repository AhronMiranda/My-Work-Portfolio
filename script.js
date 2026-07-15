const navToggle = document.getElementById('navToggle');
const sidebarNav = document.getElementById('sidebarNav');

if (navToggle && sidebarNav) {
    navToggle.addEventListener('click', () => {
        const isOpen = sidebarNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    sidebarNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            sidebarNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initSplitText() {
    document.querySelectorAll('[data-split-text]').forEach((el) => {
        const text = el.textContent;
        el.textContent = '';
        el.setAttribute('aria-label', text);
        text.split('').forEach((char, i) => {
            if (char === ' ') {
                const space = document.createElement('span');
                space.className = 'space';
                space.textContent = ' ';
                el.appendChild(space);
            } else {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char;
                span.style.transitionDelay = `${i * 0.025}s`;
                el.appendChild(span);
            }
        });
    });
}

function initSectionObservers() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('nav.sidebar-navigation a');

    if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
        const setActive = (id) => {
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );
        sections.forEach((section) => observer.observe(section));
    }

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { rootMargin: '0px 0px -15% 0px', threshold: 0.05 }
        );
        sections.forEach((s) => revealObserver.observe(s));
    }
}

function renderSkills(skills) {
    const container = document.querySelector('[data-render="skills"]');
    if (!container) return;
    container.innerHTML = '';
    skills.forEach((col) => {
        const colEl = document.createElement('div');
        colEl.className = 'skill-column';
        const h3 = document.createElement('h3');
        h3.textContent = col.title;
        const ul = document.createElement('ul');
        col.items.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        colEl.appendChild(h3);
        colEl.appendChild(ul);
        container.appendChild(colEl);
    });
}

function renderProjects(projects) {
    const container = document.querySelector('[data-render="projects"]');
    if (!container) return;
    container.innerHTML = '';
    projects.forEach((p) => {
        const a = document.createElement('a');
        a.href = p.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.textDecoration = 'none';
        a.style.color = 'inherit';

        const card = document.createElement('article');
        card.className = 'project-card';
        card.dataset.tilt = '';

        const index = document.createElement('span');
        index.className = 'index';
        index.textContent = p.index;

        const h3 = document.createElement('h3');
        h3.textContent = p.title;

        const desc = document.createElement('p');
        desc.textContent = p.description;

        const stack = document.createElement('div');
        stack.className = 'stack';
        p.stack.forEach((s) => {
            const span = document.createElement('span');
            span.textContent = s;
            stack.appendChild(span);
        });

        card.appendChild(index);
        card.appendChild(h3);
        card.appendChild(desc);
        card.appendChild(stack);
        a.appendChild(card);
        container.appendChild(a);
    });
}

function renderAchievements(achievements) {
    const container = document.querySelector('[data-render="achievements"]');
    if (!container) return;
    container.innerHTML = '';
    achievements.forEach((a) => {
        const el = document.createElement('div');
        el.className = 'achievement';
        const year = document.createElement('span');
        year.className = 'year';
        year.textContent = a.year;
        const body = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = a.title;
        const p = document.createElement('p');
        p.textContent = a.description;
        body.appendChild(h3);
        body.appendChild(p);
        el.appendChild(year);
        el.appendChild(body);
        container.appendChild(el);
    });
}

function initProjectGallery() {
    const section = document.getElementById('project-gallery');
    const wrapper = section && section.querySelector('.gallery-wrapper');
    const mouseIndicator = section && section.querySelector('.gallery-mouse');
    const endCaption = section && section.querySelector('.gallery-end-caption');
    const pinned = section && section.querySelector('.gallery-pinned');
    if (!section || !wrapper) return;

    const cards = Array.from(wrapper.children);
    const cardCount = cards.length;
    if (cardCount === 0) return;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    function getCardWidth() {
        const vw = window.innerWidth;
        if (vw <= 768) return Math.max(150, vw * 0.52);
        if (vw <= 992) return Math.max(180, vw * 0.30);
        return Math.min(Math.max(200, vw * 0.19), 300);
    }

    function getRadiusMultiplier() {
        const vw = window.innerWidth;
        if (vw <= 768) return 1.2;
        if (vw <= 992) return 1.3;
        return 1.4;
    }

    let cardWidth = getCardWidth();
    let radius = cardWidth * getRadiusMultiplier();

    function layoutCards() {
        cardWidth = getCardWidth();
        radius = cardWidth * getRadiusMultiplier();
        cards.forEach((card, i) => {
            const angleDeg = (i / cardCount) * 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = radius * Math.sin(angleRad);
            const y = -radius * Math.cos(angleRad);
            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
        });
    }
    layoutCards();

    wrapper.classList.add('is-initialized');
    section.classList.add('is-initialized');

    function applyVisibility(rot) {
        const rotDeg = rot * 360;
        for (let i = 0; i < cardCount; i++) {
            const baseDeg = (i / cardCount) * 360;
            let eff = (baseDeg + rotDeg) % 360;
            if (eff < 0) eff += 360;
            const dist = Math.min(eff, 360 - eff) / 360;

            const opacity = Math.max(0, 1 - dist / 0.12);
            const grayscale = Math.min(1, dist * cardCount);
            const focusRange = 0.08;
            const maxBlur = 6;
            const normDist = Math.min(dist, focusRange);
            const blur = (normDist / focusRange) * maxBlur;
            const captionActive = Math.max(0, 1 - dist / 0.02);
            const captionY = 20 * (1 - captionActive);

            const card = cards[i];
            card.style.opacity = opacity.toFixed(3);
            card.style.filter =
                `blur(${blur.toFixed(2)}px) grayscale(${grayscale.toFixed(2)})`;
            card.style.setProperty('--caption-opacity', captionActive.toFixed(3));
            card.style.setProperty('--caption-y', `${captionY}px`);
        }
    }

    function getProgress() {
        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const travel = sectionHeight - viewportHeight;
        if (travel <= 0) return 0;
        const scrolled = -rect.top;
        return Math.max(0, Math.min(1, scrolled / travel));
    }

    let ticking = false;
    let wasInView = false;

    function update() {
        const rot = getProgress();
        const rotDeg = rot * 360;

        const sectionRect = section.getBoundingClientRect();
        const inView =
            sectionRect.bottom > 0 && sectionRect.top < window.innerHeight;

        wasInView = inView;

        if (inView) {
            wrapper.style.transform = `rotate(${rotDeg}deg)`;
            applyVisibility(rot);

            const counterRot = `rotate(${-rotDeg}deg)`;
            for (let i = 0; i < cardCount; i++) {
                cards[i].style.transform = counterRot;
            }

            if (mouseIndicator) {
                if (rot > 0.75) mouseIndicator.classList.add('is-hidden');
                else mouseIndicator.classList.remove('is-hidden');
            }

            if (endCaption) {
                if (rot > 0.82) endCaption.classList.add('is-visible');
                else endCaption.classList.remove('is-visible');
            }
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        layoutCards();
        update();
    });

    update();
}

function initTiltCards() {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach((card) => {
        const parent = card.parentElement;
        parent.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateY = ((x - cx) / cx) * 8;
            const rotateX = -((y - cy) / cy) * 8;
            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
        });
        parent.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function initMagneticButtons() {
    const magnets = document.querySelectorAll('[data-magnetic]');
    magnets.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

function initSkillCursorGlow() {
    const cols = document.querySelectorAll('.skill-column');
    cols.forEach((col) => {
        col.addEventListener('mousemove', (e) => {
            const rect = col.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            col.style.setProperty('--mouse-x', `${x}px`);
            col.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

function initParallaxGlows() {
    const glows = document.querySelectorAll('[data-parallax-speed]');
    if (!glows.length) return;
    let ticking = false;
    function update() {
        const scrollY = window.pageYOffset;
        glows.forEach((glow) => {
            const speed = parseFloat(glow.dataset.parallaxSpeed) || 0.1;
            const currentTransform = glow.style.transform;
            const driftMatch = currentTransform.match(/translate\([^)]+\)/g);
            const drift = driftMatch ? driftMatch[0] : '';
            glow.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
}

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (err) {
        console.warn('Could not fetch data.json:', err.message);
        return null;
    }
}

async function init() {
    initSplitText();
    initSectionObservers();
    initParallaxGlows();
    initProjectGallery();

    const data = await loadData();
    if (data) {
        if (data.skills) renderSkills(data.skills);
        if (data.projects) renderProjects(data.projects);
        if (data.achievements) renderAchievements(data.achievements);
        initTiltCards();
        initMagneticButtons();
        initSkillCursorGlow();

        const sections = document.querySelectorAll('main section[id]');
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                        }
                    });
                },
                { rootMargin: '0px 0px -15% 0px', threshold: 0.05 }
            );
            sections.forEach((s) => revealObserver.observe(s));
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
