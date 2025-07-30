/**
 * Main JavaScript file - Additional utilities and enhancements
 */

(function() {
    'use strict';
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.book-header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, '', link.getAttribute('href'));
            }
        });
    }
    
    // Add IDs to headings for anchor links (optimized)
    function addHeadingIds() {
        const headings = document.querySelectorAll('.page-content h1, .page-content h2, .page-content h3');
        
        // Process only first 20 headings to prevent browser hanging
        const limitedHeadings = Array.from(headings).slice(0, 20);
        
        limitedHeadings.forEach((heading, index) => {
            if (!heading.id) {
                // Simplified ID generation
                const text = heading.textContent.trim();
                const id = `heading-${index}-${text.substring(0, 10).replace(/[^\w]+/g, '')}`;
                heading.id = id;
            }
            
            // Skip anchor links for better performance
        });
    }
    
    // Table of Contents generator (simplified for performance)
    function generateTOC() {
        const tocContainer = document.querySelector('.page-toc');
        if (!tocContainer) return;
        
        const headings = document.querySelectorAll('.page-content h2');
        if (headings.length === 0 || headings.length > 15) return; // Skip TOC for very long pages
        
        const toc = document.createElement('ul');
        toc.className = 'page-toc-list';
        
        // Simple flat TOC structure for better performance
        Array.from(headings).slice(0, 10).forEach((heading, index) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `#heading-${index}`;
            link.textContent = heading.textContent.substring(0, 30);
            link.className = 'page-toc-link';
            
            item.appendChild(link);
            toc.appendChild(item);
        });
        
        tocContainer.appendChild(toc);
        
        // Skip scroll highlighting for better performance
    }
    
    // Skip TOC highlighting for performance
    
    // External link handler (simplified)
    function handleExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        
        // Process only first 50 external links for performance
        Array.from(links).slice(0, 50).forEach(link => {
            if (link.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                // Skip icon for better performance
            }
        });
    }
    
    // Image loading enhancement (minimal)
    function enhanceImages() {
        const images = document.querySelectorAll('.page-content img');
        
        // Only add lazy loading for performance
        Array.from(images).slice(0, 20).forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    // Skip image modal for performance
    
    // Add additional styles
    function addStyles() {
        const styles = `
            <style>
            /* Heading anchors */
            .heading-anchor {
                margin-left: 0.5rem;
                color: var(--text-muted);
                opacity: 0;
                transition: opacity 0.2s;
                text-decoration: none;
            }
            
            h1:hover .heading-anchor,
            h2:hover .heading-anchor,
            h3:hover .heading-anchor,
            h4:hover .heading-anchor,
            h5:hover .heading-anchor,
            h6:hover .heading-anchor {
                opacity: 1;
            }
            
            /* External link icon */
            .external-icon {
                display: inline-block;
                margin-left: 0.25rem;
                vertical-align: baseline;
            }
            
            /* Image modal */
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 2rem;
            }
            
            .image-modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
            }
            
            .image-modal-content img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            }
            
            .image-modal-close {
                position: absolute;
                top: -2rem;
                right: 0;
                background: transparent;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0.5rem;
            }
            
            /* Page TOC */
            .page-toc {
                position: sticky;
                top: calc(var(--header-height) + 2rem);
                float: right;
                width: 200px;
                margin-left: 2rem;
                padding: 1rem;
                background: var(--bg-secondary);
                border-radius: 6px;
                font-size: 0.875rem;
            }
            
            .page-toc-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .page-toc-sublist {
                list-style: none;
                padding-left: 1rem;
                margin: 0;
            }
            
            .page-toc-link {
                display: block;
                padding: 0.25rem 0;
                color: var(--text-secondary);
                text-decoration: none;
                transition: color 0.2s;
            }
            
            .page-toc-link:hover,
            .page-toc-link.active {
                color: var(--primary-color);
            }
            
            @media (max-width: 1280px) {
                .page-toc {
                    display: none;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Initialize all features
    function init() {
        addStyles();
        initSmoothScrolling();
        
        // Delay heavy processing to prevent browser hanging
        setTimeout(() => {
            addHeadingIds();
            enhanceImages();
        }, 500);
        
        // Further delay less critical features
        setTimeout(() => {
            handleExternalLinks();
        }, 2000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();