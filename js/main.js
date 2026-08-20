document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.bp-mobile-toggle');
    const navLinks = document.querySelector('.bp-nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

function typewriterEffect(elementId, text, speed = 35) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let i = 0;
    const iconHTML = '<span class="material-symbols-outlined">precision_manufacturing</span> ';
    element.innerHTML = iconHTML;

    function type() {
        if (i < text.length) {
            element.innerHTML = iconHTML + text.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

class GitHubProjects {
    constructor(username) {
        this.username = username;
        this.apiUrl = `https://api.github.com/users/${username}/repos`;
    }

    async fetchRepos(limit = 6) {
        try {
            const response = await fetch(`${this.apiUrl}?sort=updated&per_page=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch repositories');
            const repos = await response.json();

            return repos
                .filter(repo => !repo.fork)
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, limit);
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            return [];
        }
    }

    async renderProjects(containerId, limit = 6) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="bp-loader">
                <span class="material-symbols-outlined bp-spin">sync</span>
                Loading repository index...
            </div>
        `;

        const repos = await this.fetchRepos(limit);

        if (repos.length === 0) {
            container.innerHTML = '<p style="color: var(--bp-text-muted); text-align: center;">No projects available.</p>';
            return;
        }

        let html = '<div class="bp-grid-3">';
        repos.forEach(repo => {
            html += `
                <div class="bp-project-card" onclick="window.open('${repo.html_url}', '_blank')">
                    <div>
                        <h3>
                            <span class="material-symbols-outlined">folder_zip</span>
                            ${repo.name}
                        </h3>
                        <p>${repo.description || 'No blueprint description provided.'}</p>
                    </div>
                    <div class="bp-meta-tags">
                        ${repo.language ? `<span class="bp-tag highlight"><span class="material-symbols-outlined" style="font-size: 14px;">code</span>${repo.language}</span>` : ''}
                        <span class="bp-tag"><span class="material-symbols-outlined" style="font-size: 14px;">star</span>${repo.stargazers_count}</span>
                        <span class="bp-tag"><span class="material-symbols-outlined" style="font-size: 14px;">fork_right</span>${repo.forks_count}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.bp-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(section);
    });
}

function initBunkerVectorScene() {
    const container = document.getElementById('blueprint-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 95);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const bunkerGroup = new THREE.Group();
    scene.add(bunkerGroup);

    const structuralLineMat = new THREE.LineBasicMaterial({
        color: 0x222222,
        transparent: true,
        opacity: 0.38,
        linewidth: 1
    });

    const mediumGrayLineMat = new THREE.LineBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0.22,
        linewidth: 1
    });

    const lightGrayLineMat = new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.12,
        linewidth: 1
    });

    const bunkerOuterGeo = new THREE.CylinderGeometry(38, 48, 22, 6, 3, false);
    const bunkerOuterWire = new THREE.LineSegments(new THREE.WireframeGeometry(bunkerOuterGeo), structuralLineMat);
    bunkerGroup.add(bunkerOuterWire);

    const bunkerInnerGeo = new THREE.CylinderGeometry(24, 32, 28, 6, 2, false);
    const bunkerInnerWire = new THREE.LineSegments(new THREE.WireframeGeometry(bunkerInnerGeo), mediumGrayLineMat);
    bunkerGroup.add(bunkerInnerWire);

    const domeGeo = new THREE.SphereGeometry(26, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeWire = new THREE.LineSegments(new THREE.WireframeGeometry(domeGeo), structuralLineMat);
    domeWire.position.y = 11;
    bunkerGroup.add(domeWire);

    const ringGeo = new THREE.RingGeometry(48, 68, 6, 4);
    const ringWire = new THREE.LineSegments(new THREE.WireframeGeometry(ringGeo), lightGrayLineMat);
    ringWire.rotation.x = Math.PI / 2;
    ringWire.position.y = -11;
    bunkerGroup.add(ringWire);

    const bunkerFloorGeo = new THREE.PlaneGeometry(220, 220, 22, 22);
    const bunkerFloorWire = new THREE.LineSegments(new THREE.WireframeGeometry(bunkerFloorGeo), lightGrayLineMat);
    bunkerFloorWire.rotation.x = -Math.PI / 2;
    bunkerFloorWire.position.y = -22;
    bunkerGroup.add(bunkerFloorWire);

    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const shaftGeo = new THREE.BoxGeometry(6, 12, 24);
        const shaftWire = new THREE.LineSegments(new THREE.EdgesGeometry(shaftGeo), mediumGrayLineMat);
        shaftWire.position.x = Math.cos(angle) * 44;
        shaftWire.position.z = Math.sin(angle) * 44;
        shaftWire.position.y = -5;
        shaftWire.rotation.y = -angle;
        bunkerGroup.add(shaftWire);
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.03;
        targetY += (mouseY - targetY) * 0.03;

        bunkerGroup.rotation.y += 0.0012;
        bunkerGroup.rotation.y = (bunkerGroup.rotation.y + targetX * 0.005);
        bunkerGroup.rotation.x = 0.25 - targetY * 0.15;

        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    initBunkerVectorScene();
    initScrollAnimations();

    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        const github = new GitHubProjects('mappyx');
        github.renderProjects('projects-container', 6);
    }

    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) {
        const text = "FULLSTACK DEVELOPER & SOFTWARE ARCHITECT";
        typewriterEffect('hero-subtitle', text, 40);
    }
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.bp-section, #home');
    const navLinks = document.querySelectorAll('.bp-nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

if (typeof window !== 'undefined') {
    window.GitHubProjects = GitHubProjects;
    window.typewriterEffect = typewriterEffect;
}
