/**
 * Safe Main JavaScript - Error-resistant implementation for github-guide-for-beginners-book
 * Based on book-formatter's safe implementation
 */

(function() {
    'use strict';
    
    // エラーハンドリングラッパー
    function safeExecute(fn, context = '', fallback = null) {
        try {
            return fn();
        } catch (error) {
            console.warn(`[Safe JS] Error in ${context}:`, error.message);
            if (fallback && typeof fallback === 'function') {
                try {
                    return fallback(error);
                } catch (fallbackError) {
                    console.error(`[Safe JS] Fallback also failed in ${context}:`, fallbackError.message);
                }
            }
            return null;
        }
    }

    // パフォーマンス制限付きの処理実行
    function safeExecuteWithTimeout(fn, timeout = 1000, context = '') {
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                console.warn(`[Safe JS] Timeout in ${context} after ${timeout}ms`);
                resolve(null);
            }, timeout);

            try {
                const result = fn();
                clearTimeout(timer);
                resolve(result);
            } catch (error) {
                clearTimeout(timer);
                console.warn(`[Safe JS] Error in ${context}:`, error.message);
                resolve(null);
            }
        });
    }

    // Smooth scrolling for anchor links (safe version)
    function initSmoothScrolling() {
        document.addEventListener('click', (e) => {
            safeExecute(() => {
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
            }, 'smoothScrolling');
        });
    }
    
    // Add IDs to headings for anchor links (safe optimized version)
    function addHeadingIds() {
        const headings = document.querySelectorAll('.page-content h1, .page-content h2, .page-content h3, .page-content h4, .page-content h5, .page-content h6');
        let idCounter = 0;
        
        // 処理件数制限（パフォーマンス保護）
        const maxHeadings = Math.min(headings.length, 50);
        
        for (let i = 0; i < maxHeadings; i++) {
            const heading = headings[i];
            if (!heading.id) {
                // 複雑な正規表現を避けて、シンプルなID生成
                heading.id = `heading-${++idCounter}`;
            }
        }
        
        if (headings.length > maxHeadings) {
            console.warn(`[Safe JS] Processed only ${maxHeadings} headings out of ${headings.length} for performance reasons`);
        }
    }
    
    // TOC生成の安全な実装
    function generateTOC() {
        const tocContainer = document.querySelector('.page-toc');
        if (!tocContainer) return;

        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) return;

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        // 処理件数制限
        const maxTocItems = Math.min(headings.length, 30);
        
        for (let i = 0; i < maxTocItems; i++) {
            const heading = headings[i];
            if (!heading.id) continue;

            const listItem = document.createElement('li');
            listItem.className = 'toc-item';
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent.substring(0, 50); // 長さ制限
            link.className = 'toc-link';
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        }

        tocContainer.innerHTML = '';
        tocContainer.appendChild(tocList);
    }
    
    // 外部リンクの安全な処理
    function handleExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        
        // 処理件数制限
        const maxLinks = Math.min(links.length, 100);
        
        for (let i = 0; i < maxLinks; i++) {
            const link = links[i];
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    }

    // 画像の安全な強化
    function enhanceImages() {
        const images = document.querySelectorAll('img');
        
        // 処理件数制限
        const maxImages = Math.min(images.length, 50);
        
        for (let i = 0; i < maxImages; i++) {
            const img = images[i];
            
            // 遅延読み込み
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // エラーハンドリング
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('[Safe JS] Image failed to load:', this.src);
            });
        }
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
    
    // 基本機能の初期化
    function initBasicFeatures() {
        safeExecute(addStyles, 'addStyles');
        safeExecute(initSmoothScrolling, 'initSmoothScrolling');
    }

    // 重い処理の遅延初期化
    function initHeavyFeatures() {
        // 重い処理は100ms後に実行し、各処理に制限時間を設ける
        setTimeout(() => {
            safeExecuteWithTimeout(() => addHeadingIds(), 500, 'addHeadingIds');
            safeExecuteWithTimeout(() => generateTOC(), 500, 'generateTOC');
            safeExecuteWithTimeout(() => handleExternalLinks(), 300, 'handleExternalLinks');
            safeExecuteWithTimeout(() => enhanceImages(), 300, 'enhanceImages');
        }, 100);
    }

    // DOMContentLoaded時の初期化
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[Safe JS] Initializing safe JavaScript features...');
        
        // 基本機能をすぐに実行
        initBasicFeatures();
        
        // 重い処理は遅延実行
        initHeavyFeatures();
        
        console.log('[Safe JS] Safe JavaScript initialization completed');
    });

    // 未処理エラーのキャッチ
    window.addEventListener('error', function(event) {
        console.warn('[Safe JS] Uncaught error:', event.error);
        // エラーがあってもページの動作は継続
        return true;
    });

    // Promise rejection のキャッチ
    window.addEventListener('unhandledrejection', function(event) {
        console.warn('[Safe JS] Unhandled promise rejection:', event.reason);
        // エラーがあってもページの動作は継続
        event.preventDefault();
    });
})();