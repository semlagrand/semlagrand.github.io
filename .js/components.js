class MainNavigation extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="navigation">
                <a class="navigationLogo" href="/">
                    <img src="/.assets/svg/logo.svg" alt="Puffered Fish Logo">
                    <p>Puffered Fish</p>
                </a>

                <div class="navigationLinks">
                    <a href="/pricing">Pricing</a>
                    <a href="/features">Features</a>
                    <a href="/support">Support</a>
                    <a href="/documentation">Documentation</a>
                    <a href="/download">Download</a>
                </div>

                <div class="navigationControls">
                    <div class="themeToggle" id="theme-toggle">
                        <img src="/.assets/icons/sun.svg" alt="Toggle Theme">
                    </div>
                    <div class="navigationToggle" id="menu-toggle">
                        <img src="/.assets/icons/menu.svg" alt="Toggle Menu">
                    </div>
                </div>
            </nav>

            <nav class="sideNavigation" id="navigation_side">
                <a href="/pricing">Pricing</a>
                <a href="/features">Features</a>
                <a href="/support">Support</a>
                <a href="/documentation">Documentation</a>
                <a href="/download">Download</a>
            </nav>
        `;
    }
}
customElements.define('main-navigation', MainNavigation);