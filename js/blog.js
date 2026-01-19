/**
 * Blog System
 * Handles loading and displaying blog posts
 */

class BlogSystem {
    constructor() {
        this.posts = [];
        this.parser = new MarkdownParser();
    }

    /**
     * Load posts index
     * @returns {Promise<Array>} - Array of post metadata
     */
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

    /**
     * Load a single post
     * @param {string} slug - Post slug/filename
     * @returns {Promise<object>} - Parsed post data
     */
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

    /**
     * Render post list for blog page
     * @param {string} containerId - Container element ID
     */
    async renderPostList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="pip-loader block">Connecting to Terminal...</div>';

        const posts = await this.loadPostsIndex();

        if (posts.length === 0) {
            container.innerHTML = '<p class="pip-text">No posts found.</p>';
            return;
        }

        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        let html = '<div class="blog-preview">';
        posts.forEach(post => {
            html += `
                <article class="blog-post-card">
                    <h3><a href="post.html?slug=${post.slug}" style="color: inherit; text-decoration: none;">${post.title}</a></h3>
                    <div class="post-meta">
                        <span class="pip-badge">${this.formatDate(post.date)}</span>
                    </div>
                    <p>${post.description}</p>
                    <a href="post.html?slug=${post.slug}" class="pip-btn primary">Read More</a>
                </article>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    /**
     * Render recent posts for home page
     * @param {string} containerId - Container element ID
     * @param {number} limit - Number of posts to show
     */
    async renderRecentPosts(containerId, limit = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="pip-loader block">Fetching Logs</div>';

        const posts = await this.loadPostsIndex();

        if (posts.length === 0) {
            container.innerHTML = '<p class="pip-text">No posts yet. Check back soon!</p>';
            return;
        }

        // Sort by date and limit
        const recentPosts = posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);

        let html = '<div class="blog-preview">';
        recentPosts.forEach(post => {
            html += `
                <article class="blog-post-card">
                    <h3><a href="post.html?slug=${post.slug}" style="color: inherit; text-decoration: none;">${post.title}</a></h3>
                    <div class="post-meta">
                        <span class="pip-badge">${this.formatDate(post.date)}</span>
                    </div>
                    <p>${post.description}</p>
                    <a href="post.html?slug=${post.slug}" class="pip-btn primary">Read More</a>
                </article>
            `;
        });
        html += '</div>';
        html += '<div style="text-align: center; margin-top: 30px;"><a href="blog.html" class="pip-btn">View All Posts</a></div>';

        container.innerHTML = html;
    }

    /**
     * Render single post
     * @param {string} containerId - Container element ID
     * @param {string} slug - Post slug
     */
    async renderPost(containerId, slug) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="pip-loader block">Decrypting File</div>';

        const postData = await this.loadPost(slug);

        if (!postData) {
            container.innerHTML = '<p class="pip-text error">Post not found.</p>';
            return;
        }

        const { frontmatter, html } = postData;

        let postHTML = '<article class="pip-panel">';
        postHTML += `<div class="pip-panel-header">${frontmatter.title || 'Untitled'}</div>`;

        if (frontmatter.date) {
            postHTML += `<div class="post-meta pip-text subtle" style="margin-bottom: 20px;">
                <span class="pip-badge">${this.formatDate(frontmatter.date)}</span>
            </div>`;
        }

        postHTML += `<div class="markdown-content">${html}</div>`;
        postHTML += '</article>';

        postHTML += '<div style="margin-top: 30px; text-align: center;">';
        postHTML += '<a href="blog.html" class="pip-btn">← Back to Blog</a>';
        postHTML += '</div>';

        container.innerHTML = postHTML;

        // Update page title
        if (frontmatter.title) {
            document.title = `${frontmatter.title} - Rafael Paez`;
        }
    }

    /**
     * Format date string
     * @param {string} dateStr - Date string
     * @returns {string} - Formatted date
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Get URL parameter
     * @param {string} name - Parameter name
     * @returns {string|null} - Parameter value
     */
    static getURLParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }
}

// Initialize blog system when DOM is ready
if (typeof window !== 'undefined') {
    window.BlogSystem = BlogSystem;
}
