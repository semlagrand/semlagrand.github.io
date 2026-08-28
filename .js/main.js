document.addEventListener('click', (e) => {
  const accordion_button = e.target.closest('.accordionToggle');
  if (!accordion_button) return;

  const accordion = accordion_button.closest('.accordion');
  if (accordion) accordion.classList.toggle('open');

  const expanded = accordion_button.getAttribute('aria-expanded') === 'true';
  accordion_button.setAttribute('aria-expanded', String(!expanded));
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('menu_toggle').onclick = (e) => {
        const navigation = document.getElementById('navigation_side');
        navigation.classList.toggle('open');
    };

    const themeToggleButton = document.getElementById('theme_toggle');
    const bodyElement = document.body;

    const setDefaultTheme = () => {
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'themeLight');
            bodyElement.classList.add('themeLight');
        } else {
            bodyElement.classList.add(localStorage.getItem('theme'));
        }
    };

    setDefaultTheme();

    const getIconBasePath = () => {
        const parts = location.pathname.split('/').filter(Boolean);
        let depth = 0;
        if (parts.length === 0) depth = 0;
        else {
            const last = parts[parts.length - 1];
            depth = last.includes('.') ? parts.length - 1 : parts.length;
        }
        const prefix = depth === 0 ? '' : new Array(depth + 1).join('../');
        return prefix + '.assets/icons/';
    };

    const updateIcon = () => {
        if (!themeToggleButton) return;
        const iconBase = getIconBasePath();
        if (localStorage.getItem('theme') === 'themeDark') {
            themeToggleButton.innerHTML = `<img src="${iconBase}moon.svg" alt="">`;
        } else {
            themeToggleButton.innerHTML = `<img src="${iconBase}sun.svg" alt="">`;
        }
    };

    updateIcon();

    themeToggleButton.addEventListener('click', () => {
        if (localStorage.getItem('theme') === 'themeDark') {
            bodyElement.classList.remove('themeDark');
            bodyElement.classList.add('themeLight');
            localStorage.setItem('theme', 'themeLight');
        } else {
            bodyElement.classList.remove('themeLight');
            bodyElement.classList.add('themeDark');
            localStorage.setItem('theme', 'themeDark');
        }
        updateIcon();
    });

    // Initialize productSlides if present
    initializeproductSlides();
    
    // Initialize markdown content
    loadMarkdownContent();
    
    // Load product versions
    loadProductVersions();

    // Load product details
    loadProductDetails();
});

// productSlides functionality
function initializeproductSlides() {
    const productSlidess = document.querySelectorAll('.productSlides[data-folder]');
    productSlidess.forEach(productSlides => loadproductSlidesImages(productSlides));
}

async function loadproductSlidesImages(productSlides) {
    const folderPath = productSlides.getAttribute('data-folder');
    if (!folderPath) return;

    const productImagesContainer = productSlides.querySelector('.productImages');
    const indicatorsContainer = productSlides.querySelector('.productImageDots');
    
    if (!productImagesContainer || !indicatorsContainer) return;

    // Try to fetch directory listing
    let images = await getImagesFromFolder(folderPath);

    if (images.length === 0) return;

    // Generate image slides
    images.forEach((imagePath, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `productImage${index === 0 ? ' active' : ''}`;
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Product Image ${index + 1}`;
        
        slideDiv.appendChild(img);
        productImagesContainer.appendChild(slideDiv);
    });

    // Generate indicators
    images.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = `productSlidesIndicator${index === 0 ? ' active' : ''}`;
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicatorsContainer.appendChild(indicator);
    });

    // Initialize productSlides controls
    setupproductSlidesControls(productSlides);
}

async function getImagesFromFolder(folderPath) {
    try {
        // Try to fetch the directory
        const response = await fetch(folderPath + '/');
        if (!response.ok) throw new Error('Directory not accessible');
        
        const html = await response.text();
        
        // Parse HTML to find image files
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const images = [];
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && imageExtensions.some(ext => href.toLowerCase().endsWith(ext))) {
                // Check if href is just a filename or already a path
                let imagePath;
                if (href.startsWith('/') || href.startsWith('http')) {
                    // Already a full path
                    imagePath = href;
                } else {
                    // Just a filename, construct full path
                    imagePath = folderPath + '/' + href;
                }
                images.push(imagePath);
            }
        });
        
        return images.sort(); // Sort alphabetically
    } catch (error) {
        console.error('Could not load directory listing:', error);
        return [];
    }
}

// Markdown loading functionality
async function loadMarkdownContent() {
    const markdownElements = document.querySelectorAll('[data-markdown]');
    
    // Dynamically import the markdown parser module
    const { parseMarkdown } = await import('/.js/markdown.js');
    
    markdownElements.forEach(async (element) => {
        const markdownPath = element.getAttribute('data-markdown');
        if (!markdownPath) return;
        
        try {
            const response = await fetch(markdownPath);
            if (!response.ok) throw new Error('Markdown file not found');
            
            const markdownText = await response.text();
            const html = parseMarkdown(markdownText);
            element.innerHTML = html;
        } catch (error) {
            console.error('Could not load markdown:', error);
            element.innerHTML = '<p>Content could not be loaded.</p>';
        }
    });
}

// Convert date to relative time (e.g., "4 days ago", "2+ weeks ago")
function getRelativeTime(dateString) {
    const date = new Date(dateString.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
        return diffWeeks === 1 ? '1 week ago' : `${diffWeeks}+ weeks ago`;
    }
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
        return diffMonths === 1 ? '1 month ago' : `${diffMonths}+ months ago`;
    }
    
    const diffYears = Math.floor(diffDays / 365);
    return diffYears === 1 ? '1 year ago' : `${diffYears}+ years ago`;
}

// Product details loading functionality
async function loadProductVersions() {
    const versionContainers = document.querySelectorAll('.productVersions[data-versions]');

    versionContainers.forEach(async (container) => {
        const versionsPath = container.getAttribute('data-versions');
        if (!versionsPath) return;

        try {
            const response = await fetch(versionsPath);
            if (!response.ok) throw new Error('Versions file not found');

            const details = await response.json();

            const versions = details.versions ?? {};
            const baseLink = details.link ?? '';

            function buildCheckoutUrl(key, versionData) {
                const variant = key.charAt(0).toUpperCase() + key.slice(1);
                return `${baseLink}?variant=${variant}&price=${versionData.price}&wanted=true`;
            }

            function updateCheckoutButton(key, versionData) {
                const sidebar = container.closest('.productSidebar');
                const btn = sidebar?.querySelector('.productCheckout');
                if (btn) btn.href = buildCheckoutUrl(key, versionData);
            }

            container.innerHTML = '';

            Object.entries(versions).forEach(([key, versionData], index) => {
                const radioValue = key;
                const priceText = versionData.price === 0 ? 'Free' : `€${versionData.price}`;

                const label = document.createElement('label');
                label.className = 'productVersion';

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'version';
                radio.value = radioValue;
                if (index === 0) {
                    radio.checked = true;
                    updateCheckoutButton(key, versionData);
                }

                radio.addEventListener('change', () => updateCheckoutButton(key, versionData));

                const content = document.createElement('div');
                content.className = 'versionContent';

                const nameEl = document.createElement('h5');
                nameEl.textContent = versionData.name;

                const descEl = document.createElement('p');
                descEl.textContent = versionData.description;

                const priceEl = document.createElement('p');
                priceEl.className = 'versionPrice';
                priceEl.textContent = priceText;

                content.appendChild(nameEl);
                content.appendChild(descEl);
                content.appendChild(priceEl);
                label.appendChild(radio);
                label.appendChild(content);
                container.appendChild(label);
            });
        } catch (error) {
            console.error('Could not load product versions:', error);
        }
    });
}

async function loadProductDetails() {
    const detailsElements = document.querySelectorAll('[data-details]');
    
    detailsElements.forEach(async (element) => {
        const detailsPath = element.getAttribute('data-details');
        if (!detailsPath) return;
        
        try {
            const response = await fetch(detailsPath);
            if (!response.ok) throw new Error('Details file not found');
            
            const details = await response.json();
            
            const detailsMap = {
                'Published': details.published,
                'Last Updated': getRelativeTime(details.lastUpdated),
                'Version': details.version,
                'Software': details.software,
                'Compatibility':  details.compatibility,
                'Render Engine': details.renderEngine.join(', '),
                'License': details.license
            };
            
            element.innerHTML = '';
            
            // Populate details
            for (const [label, value] of Object.entries(detailsMap)) {
                const detailDiv = document.createElement('div');
                detailDiv.className = 'productDetail';
                
                const labelP = document.createElement('p');
                labelP.textContent = label;
                
                const valueP = document.createElement('p');
                valueP.textContent = value;
                
                detailDiv.appendChild(labelP);
                detailDiv.appendChild(valueP);
                element.appendChild(detailDiv);
            }
        } catch (error) {
            console.error('Could not load product details:', error);
            element.innerHTML = '<p>Details could not be loaded.</p>';
        }
    });
}

function setupproductSlidesControls(productSlides) {
    const slides = productSlides.querySelectorAll('.productImage');
    const indicators = productSlides.querySelectorAll('.productSlidesIndicator');
    const prevButton = productSlides.querySelector('.productImageBack');
    const nextButton = productSlides.querySelector('.productImageNext');
    const progressBar = productSlides.querySelector('.productImageProgress');
    
    let currentSlide = 0;
    let autoPlayInterval;
    let progressAnimationId;
    let progressStartTime;
    let pausedProgress = 0;
    let isHovering = false;
    const autoPlayDelay = 5000; // 5 seconds

    function goToSlide(index) {
        // Remove active class from current slide and indicator
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        // Update current slide index
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        
        // Add active class to new slide and indicator
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        
        // Reset progress bar
        resetProgress();
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function animateProgress() {
        if (!progressBar) return;
        
        const elapsed = Date.now() - progressStartTime + pausedProgress;
        const progress = Math.min((elapsed / autoPlayDelay) * 100, 100);
        
        progressBar.style.backgroundSize = progress + '% 100%, 100% 100%';
        
        if (progress < 100) {
            progressAnimationId = requestAnimationFrame(animateProgress);
        }
    }

    function resetProgress() {
        if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
        }
        if (progressBar) {
            progressBar.style.backgroundSize = '0% 100%, 100% 100%';
        }
        pausedProgress = 0;
        progressStartTime = Date.now();
        progressAnimationId = requestAnimationFrame(animateProgress);
    }

    function pauseProgress() {
        if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
            progressAnimationId = null;
        }
        // Calculate current progress in milliseconds
        if (progressStartTime) {
            pausedProgress = Date.now() - progressStartTime + pausedProgress;
        }
    }

    function resumeProgress() {
        progressStartTime = Date.now();
        progressAnimationId = requestAnimationFrame(animateProgress);
    }

    function startAutoPlay() {
        stopAutoPlay(true);
        resetProgress();
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay(reset = false) {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
            progressAnimationId = null;
        }
        if (reset && progressBar) {
            progressBar.style.backgroundSize = '0% 100%, 100% 100%';
            pausedProgress = 0;
        }
    }

    // Event listeners for buttons
    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay(true);
        if (!isHovering) startAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay(true);
        if (!isHovering) startAutoPlay();
    });

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay(true);
            if (!isHovering) startAutoPlay();
        });
    });

    // Keyboard navigation
    let keyboardHandled = false;
    document.addEventListener('keydown', (e) => {
        if (!productSlides || keyboardHandled) return;
        if (e.key === 'ArrowLeft') {
            keyboardHandled = true;
            prevSlide();
            stopAutoPlay(true);
            if (!isHovering) startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            keyboardHandled = true;
            nextSlide();
            stopAutoPlay(true);
            if (!isHovering) startAutoPlay();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            keyboardHandled = false;
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    productSlides.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    productSlides.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            stopAutoPlay(true);
            if (!isHovering) startAutoPlay();
        }
    }

    // Pause autoplay on hover
    productSlides.addEventListener('mouseenter', () => {
        isHovering = true;
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        pauseProgress();
    });
    
    productSlides.addEventListener('mouseleave', () => {
        isHovering = false;
        if (!autoPlayInterval) {
            // Calculate remaining time
            const remainingTime = autoPlayDelay - pausedProgress;
            if (remainingTime > 0) {
                resumeProgress();
                autoPlayInterval = setInterval(nextSlide, remainingTime);
                // After first interval, continue with normal delay
                setTimeout(() => {
                    if (autoPlayInterval) {
                        clearInterval(autoPlayInterval);
                        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
                    }
                }, remainingTime);
            } else {
                startAutoPlay();
            }
        }
    });

    // Start autoplay
    startAutoPlay();
}