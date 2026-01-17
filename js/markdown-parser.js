/**
 * Lightweight Markdown Parser
 * Parses YAML frontmatter and converts markdown to HTML
 */

class MarkdownParser {
    constructor() {
        this.frontmatter = {};
        this.content = '';
    }

    /**
     * Parse markdown file content
     * @param {string} markdown - Raw markdown content
     * @returns {object} - { frontmatter, html }
     */
    parse(markdown) {
        // Extract frontmatter
        const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

        if (frontmatterMatch) {
            this.parseFrontmatter(frontmatterMatch[1]);
            this.content = frontmatterMatch[2];
        } else {
            this.content = markdown;
        }

        // Convert markdown to HTML
        const html = this.toHTML(this.content);

        return {
            frontmatter: this.frontmatter,
            html: html
        };
    }

    /**
     * Parse YAML frontmatter
     * @param {string} yaml - YAML content
     */
    parseFrontmatter(yaml) {
        const lines = yaml.split('\n');
        lines.forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                this.frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '');
            }
        });
    }

    /**
     * Convert markdown to HTML
     * @param {string} markdown - Markdown content
     * @returns {string} - HTML content
     */
    toHTML(markdown) {
        let html = markdown;

        // Code blocks (must be before inline code)
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'text'}">${this.escapeHTML(code.trim())}</code></pre>`;
        });

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Unordered lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Ordered lists
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');
        html = html.replace(/^\*\*\*$/gim, '<hr>');

        // Paragraphs (wrap text that's not already in tags)
        const lines = html.split('\n');
        const processed = [];
        let inList = false;
        let inCodeBlock = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('<pre>')) inCodeBlock = true;
            if (line.endsWith('</pre>')) inCodeBlock = false;

            if (line.startsWith('<ul>') || line.startsWith('<ol>')) inList = true;
            if (line.startsWith('</ul>') || line.startsWith('</ol>')) inList = false;

            if (line && !line.startsWith('<') && !inList && !inCodeBlock) {
                processed.push(`<p>${line}</p>`);
            } else {
                processed.push(line);
            }
        }

        html = processed.join('\n');

        // Clean up multiple consecutive list items
        html = html.replace(/<\/li>\s*<li>/g, '</li><li>');
        html = html.replace(/<li>(.*?)<\/li>/g, (match, content) => {
            if (!content.trim().startsWith('<')) {
                return `<li>${content}</li>`;
            }
            return match;
        });

        return html;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownParser;
}
