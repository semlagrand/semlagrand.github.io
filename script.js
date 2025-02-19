function scrollToTop() {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    const updateIcon = () => {
        if (bodyElement.classList.contains('dark-mode')) {
            themeToggleButton.querySelector('.material-icons').textContent = 'dark_mode';
        } else {
            themeToggleButton.querySelector('.material-icons').textContent = 'light_mode';
        }
    };

    updateIcon();

    themeToggleButton.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-mode')) {
            bodyElement.classList.remove('dark-mode');
            bodyElement.classList.add('light-mode');
            themeToggleButton.innerHTML = '<span class="material-icons">dark_mode</span>';
        } else {
            bodyElement.classList.remove('light-mode');
            bodyElement.classList.add('dark-mode');
            themeToggleButton.innerHTML = '<span class="material-icons">light_mode</span>';
        }
        updateIcon();
    });
});