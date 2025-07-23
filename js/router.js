/* 
 * SIMPLE CLIENT-SIDE ROUTER
 * Handles navigation between pages without full page reloads
 */

class SimpleRouter {
    constructor() {
        // Define which pages exist and where their HTML files are located
        this.routes = {
            'discography': 'pages/discography.html',
            'studios': 'pages/studios.html',
            'sound-system': 'pages/sound-system.html',
            'book-press': 'pages/book-press.html',
            'tours': 'pages/tours.html',
            'film': 'pages/film.html',
            'cv': 'pages/cv.html'
        };
        
        // Get reference to the content container that will change
        this.pageContent = document.getElementById('page-content');
        
        // Store the original home page content
        this.homeContent = this.pageContent.innerHTML;
        
        // Start the router
        this.init();
    }

    init() {
        // Handle navigation link clicks
        document.addEventListener('click', (e) => {
            // Check if clicked element is a navigation link
            if (e.target.matches('.nav-link')) {
                e.preventDefault(); // Stop normal link behavior
                const page = e.target.getAttribute('data-page');
                this.navigate(page);
            }
            
            // Handle back to home links
            if (e.target.matches('.back-link')) {
                e.preventDefault(); // Stop normal link behavior
                this.navigateHome();
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                // User went back/forward to a specific page
                this.loadPage(e.state.page, false);
            } else {
                // User went back/forward to home page
                this.loadHome(false);
            }
        });

        // Handle initial page load (when someone visits a direct URL)
        const path = window.location.pathname.replace('/', '');
        if (path && this.routes[path]) {
            this.loadPage(path, false);
        }
    }

    navigate(page) {
        // Update browser URL and history
        history.pushState({ page }, '', `/${page}`);
        // Load the new page content
        this.loadPage(page, true);
    }

    navigateHome() {
        // Update browser URL to home
        history.pushState({}, '', '/');
        // Load home page content
        this.loadHome(true);
    }

    async loadPage(page, animate = true) {
        // Check if the page exists in our routes
        if (!this.routes[page]) return;

        // Add loading animation if requested
        if (animate) {
            this.pageContent.classList.add('loading');
        }

        try {
            // Fetch the HTML file from the server
            const response = await fetch(this.routes[page]);
            
            if (response.ok) {
                // Get the HTML content
                const html = await response.text();
                
                if (animate) {
                    // Wait for fade-out animation, then update content
                    setTimeout(() => {
                        this.pageContent.innerHTML = html;
                        this.pageContent.classList.remove('loading');
                    }, 150); // 150ms matches our CSS transition
                } else {
                    // No animation, update immediately
                    this.pageContent.innerHTML = html;
                }
                
                // Update page title
                document.title = `jeremy harris - ${page.replace('-', ' ')}`;
            }
        } catch (error) {
            console.error('Failed to load page:', error);
            // Remove loading state if there was an error
            if (animate) {
                this.pageContent.classList.remove('loading');
            }
        }
    }

    loadHome(animate = true) {
        if (animate) {
            // Fade out current content
            this.pageContent.classList.add('loading');
            setTimeout(() => {
                // Restore original home content
                this.pageContent.innerHTML = this.homeContent;
                this.pageContent.classList.remove('loading');
            }, 150);
        } else {
            // No animation, restore immediately
            this.pageContent.innerHTML = this.homeContent;
        }
        
        // Reset page title
        document.title = 'jeremy harris';
    }
}

/* 
 * Initialize the router when the page is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    new SimpleRouter();
});