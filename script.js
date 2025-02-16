function openNav() {
    document.getElementById("navSidebar").style.width = "240px";
    document.getElementById("main").style.marginLeft = "240px";
    document.body.classList.add("sidenav-open");
}

function closeNav() {
    document.getElementById("navSidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.classList.remove("sidenav-open");
}

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