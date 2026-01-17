/**
 * Main Portfolio JavaScript
 * Handles navigation, animations, and GitHub integration
 */

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});

// Smooth Scrolling for Navigation Links
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

// Typewriter Effect
function typewriterEffect(elementId, text, speed = 50) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// GitHub Projects Loader
class GitHubProjects {
    constructor(username) {
        this.username = username;
        this.apiUrl = `https://api.github.com/users/${username}/repos`;
    }

    /**
     * Fetch repositories from GitHub
     * @param {number} limit - Maximum number of repos to fetch
     * @returns {Promise<Array>} - Array of repository objects
     */
    async fetchRepos(limit = 6) {
        try {
            const response = await fetch(`${this.apiUrl}?sort=updated&per_page=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch repositories');
            const repos = await response.json();

            // Filter out forks if desired and sort by stars
            return repos
                .filter(repo => !repo.fork)
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, limit);
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            return [];
        }
    }

    /**
     * Render projects to container
     * @param {string} containerId - Container element ID
     * @param {number} limit - Number of projects to show
     */
    async renderProjects(containerId, limit = 6) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="loading">Loading projects</div>';

        const repos = await this.fetchRepos(limit);

        if (repos.length === 0) {
            container.innerHTML = '<p class="pip-text">No projects found.</p>';
            return;
        }

        let html = '<div class="project-grid">';
        repos.forEach(repo => {
            html += `
                <div class="project-card" onclick="window.open('${repo.html_url}', '_blank')">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="project-meta">
                        ${repo.language ? `<span class="pip-badge">${repo.language}</span>` : ''}
                        <span class="pip-badge info">★ ${repo.stargazers_count}</span>
                        <span class="pip-badge">Forks: ${repo.forks_count}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }
}

// Initialize GitHub Projects
document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        const github = new GitHubProjects('mappyx');
        github.renderProjects('projects-container', 6);
    }
});

// Scroll Animation (fade in elements)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();

    // Typewriter effect for hero subtitle
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        typewriterEffect('hero-subtitle', text, 80);
    }
});

// Active Navigation Highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) {
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

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.GitHubProjects = GitHubProjects;
    window.typewriterEffect = typewriterEffect;
}
