class BlogSystem {
    constructor() {
        this.posts = [];
        this.parser = new MarkdownParser();
    }

    async loadPostsIndex() {
        try {
            const response = await fetch('posts/index.json');
            if (!response.ok) throw new Error('Failed to load posts index');
            this.posts = await response.json();
            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            return [];
        }
    }

    async loadPost(slug) {
        try {
            const response = await fetch(`posts/${slug}.md`);
            if (!response.ok) throw new Error(`Failed to load post: ${slug}`);
            const markdown = await response.text();
            return this.parser.parse(markdown);
        } catch (error) {
            console.error('Error loading post:', error);
            return null;
        }
    }

    async renderPostList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="bp-loader">
                <span class="material-symbols-outlined bp-spin">sync</span>
                Retrieving article index...
            </div>
        `;

        const posts = await this.loadPostsIndex();

        if (posts.length === 0) {
            container.innerHTML = '<p style="color: var(--bp-white-muted); text-align: center;">No documents indexed.</p>';
            return;
        }

        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        let html = '<div class="bp-grid-2">';
        posts.forEach(post => {
            html += `
                <article class="bp-card">
                    <div class="bp-card-header">
                        <span class="material-symbols-outlined">description</span>
                        <a href="post.html?slug=${post.slug}" style="color: inherit; text-decoration: none;">${post.title}</a>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span class="bp-tag">
                            <span class="material-symbols-outlined" style="font-size: 14px;">calendar_today</span>
                            ${this.formatDate(post.date)}
                        </span>
                    </div>
                    <p style="color: var(--bp-white-muted); font-size: 0.85rem; line-height: 1.6; margin-bottom: 20px;">${post.description}</p>
                    <a href="post.html?slug=${post.slug}" class="bp-btn primary" style="padding: 8px 16px;">
                        <span class="material-symbols-outlined">read_more</span>
                        Read Specification
                    </a>
                </article>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    async renderPost(containerId, slug) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="bp-loader">
                <span class="material-symbols-outlined bp-spin">sync</span>
                Parsing document specifications...
            </div>
        `;

        const postData = await this.loadPost(slug);

        if (!postData) {
            container.innerHTML = `
                <div class="bp-card">
                    <div class="bp-card-header">
                        <span class="material-symbols-outlined">error</span>
                        Document Not Found
                    </div>
                    <p style="color: var(--bp-white-muted);">The requested document could not be retrieved.</p>
                </div>
            `;
            return;
        }

        const { frontmatter, html } = postData;

        let postHTML = '<article class="bp-card" style="padding: 32px;">';
        postHTML += `
            <div class="bp-card-header" style="font-size: 1.3rem; margin-bottom: 16px;">
                <span class="material-symbols-outlined" style="font-size: 22px;">article</span>
                ${frontmatter.title || 'Untitled Document'}
            </div>
        `;

        if (frontmatter.date) {
            postHTML += `
                <div style="margin-bottom: 24px;">
                    <span class="bp-tag highlight">
                        <span class="material-symbols-outlined" style="font-size: 14px;">calendar_today</span>
                        ${this.formatDate(frontmatter.date)}
                    </span>
                </div>
            `;
        }

        postHTML += `<div class="markdown-content">${html}</div>`;
        postHTML += '</article>';

        postHTML += `
            <div style="margin-top: 36px; text-align: center;">
                <a href="blog.html" class="bp-btn">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Return to Index
                </a>
            </div>
        `;

        container.innerHTML = postHTML;

        if (frontmatter.title) {
            document.title = `${frontmatter.title} - Rafael Paez`;
        }
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    static getURLParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }
}

if (typeof window !== 'undefined') {
    window.BlogSystem = BlogSystem;
}
