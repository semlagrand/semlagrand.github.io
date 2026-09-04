class MainNavigation extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav class="navigation">
                <a class="navigationLogo" href="/">
                    <img src="/.assets/svg/logo.svg" alt="Sem Lagrand Logo">
                </a>

                <div class="navigationLinks">
                    <a href="/showreel/">Showreel</a>
                    <a href="/portfolio/">Portfolio</a>
                    <a href="/contact/">Contact</a>
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

            <nav class="sideNavigation" id="navigation-side">
                <a href="/showreel/">Showreel</a>
                <a href="/portfolio/">Portfolio</a>
                <a href="/contact/">Contact</a>
            </nav>
        `;
    }
}
customElements.define('main-navigation', MainNavigation);

class MainFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="footer">
                <div class="footerContent">
                    <div class="footerLinks">
                        <a class="footerLink" href="mailto:semlagrand@gmail.com">
                            <p>semlagrand@gmail.com</p>
                        </a>
                        
                        <div class="verticalDivider"></div>
                        
                        <a class="footerLink" href="https://www.instagram.com/semlagrand">
                            <img src="/.assets/icons/socials/instagram.png" alt="Instagram external link">
                            <p>Instagram</p>
                        </a>
                        
                        <a class="footerLink" href="https://www.youtube.com/@semlagrand">
                            <img src="/.assets/icons/socials/youtube.png" alt="YouTube external link">
                            <p>YouTube</p>
                        </a>
                        
                        <a class="footerLink" href="https://www.linkedin.com/in/semlagrand">
                            <img src="/.assets/icons/socials/linkedin.png" alt="LinkedIn external link">
                            <p>LinkedIn</p>
                        </a>
                    </div>
                    
                    <div class="footerClock" id="clock" title="Local time (CEST)"></div>
                </div>
                <div class="footerDetail">
                    <img src="/.assets/svg/footer-detail.svg" alt="">
                </div>
                <div class="footerDetailMobile">
                    <img src="/.assets/svg/footer-detail-mobile.svg" alt="">
                </div>
            </footer>
        `
    }
}
customElements.define('main-footer', MainFooter)