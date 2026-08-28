/**
 * @param {string} markdown
 * @returns {string}
 */
export function parseMarkdown(markdown) {
    let html = markdown;

    // Code blocks (must be done before other replacements)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/^\- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    html = '<p>' + html + '</p>';
    
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><br>/g, '<p>');
    html = html.replace(/<br><\/p>/g, '</p>');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<br>(<\/li>)/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<br>(<\/code><\/pre>)/g, '$1');
    
    return html;
}

/**
 * @param {string} markdownPath
 * @returns {Promise<string>}
 */
export async function loadMarkdownFile(markdownPath) {
    try {
        const response = await fetch(markdownPath);
        if (!response.ok) throw new Error('Markdown file not found');
        
        const markdownText = await response.text();
        return parseMarkdown(markdownText);
    } catch (error) {
        console.error('Could not load markdown:', error);
        throw error;
    }
}
