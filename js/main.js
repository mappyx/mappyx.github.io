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
            container.innerHTML = '<p style="color: var(--bp-white-muted); text-align: center;">No projects available.</p>';
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

function initBlueprintThreeScene() {
    const container = document.getElementById('blueprint-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const wireframeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
        linewidth: 1
    });

    const boldWireframeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        linewidth: 1
    });

    const boxGeo = new THREE.BoxGeometry(32, 32, 32);
    const boxWire = new THREE.LineSegments(new THREE.EdgesGeometry(boxGeo), boldWireframeMat);
    group.add(boxWire);

    const icosaGeo = new THREE.IcosahedronGeometry(22, 1);
    const icosaWire = new THREE.LineSegments(new THREE.WireframeGeometry(icosaGeo), wireframeMat);
    group.add(icosaWire);

    const torusGeo = new THREE.TorusGeometry(38, 0.4, 8, 48);
    const torusWire = new THREE.LineSegments(new THREE.WireframeGeometry(torusGeo), wireframeMat);
    torusWire.rotation.x = Math.PI / 3;
    group.add(torusWire);

    const planeGridGeo = new THREE.PlaneGeometry(120, 120, 12, 12);
    const planeGridWire = new THREE.LineSegments(new THREE.WireframeGeometry(planeGridGeo), new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08
    }));
    planeGridWire.rotation.x = -Math.PI / 2.5;
    planeGridWire.position.y = -35;
    group.add(planeGridWire);

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

        boxWire.rotation.x += 0.002;
        boxWire.rotation.y += 0.003;

        icosaWire.rotation.x -= 0.0015;
        icosaWire.rotation.y -= 0.002;

        torusWire.rotation.z += 0.001;

        group.rotation.y = targetX * 0.4;
        group.rotation.x = -targetY * 0.3;

        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    initBlueprintThreeScene();
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
