document.addEventListener('DOMContentLoaded', loadMarkdown)

async function loadMarkdown() {
    const div = document.getElementById('project-credits')
    if (!div) throw new Error('Project credits section not found')

    const path = div.dataset.md

    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Markdown file not found');

        const text = await response.text();
        div.innerHTML = marked.parse(text);
    } catch (error) {
        console.error('Could not load markdown:', error);
        throw error;
    }
}