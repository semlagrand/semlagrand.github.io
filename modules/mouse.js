export function mouseLocation(event) {
    const root = document.documentElement;

    root.style.setProperty('--x', event.clientX + 'px');
    root.style.setProperty('--y', event.clientY + 'px');
}

export function scrollLocation(event) {
    const root = document.documentElement;

    root.style.setProperty('--verticalScroll', window.scrollY + 'px');
}