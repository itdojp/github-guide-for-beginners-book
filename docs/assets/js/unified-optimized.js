/**
 * Unified Optimized JavaScript - All functionality in one file
 * Error-resistant implementation for github-guide-for-beginners-book
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

    // テーマ管理
    function initTheme() {
        const THEME_KEY = 'book-theme';
        const THEME_LIGHT = 'light';
        const THEME_DARK = 'dark';
        
        function getSystemTheme() {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
        }
        
        function getSavedTheme() {
            return localStorage.getItem(THEME_KEY) || getSystemTheme();
        }
        
        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem(THEME_KEY, theme);
        }
        
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
            applyTheme(newTheme);
        }
        
        // Apply saved theme
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // Add event listener to theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    // サイドバー管理（簡素化）
    function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (!sidebar || !sidebarToggle) return;
        
        function toggleSidebar() {
            const isOpen = sidebar.classList.contains('open');
            if (isOpen) {
                sidebar.classList.remove('open');
                sidebarToggle.setAttribute('aria-expanded', 'false');
            } else {
                sidebar.classList.add('open');
                sidebarToggle.setAttribute('aria-expanded', 'true');
            }
        }
        
        function closeSidebar() {
            sidebar.classList.remove('open');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        }
        
        sidebarToggle.addEventListener('click', toggleSidebar);
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        });
    }

    // スムーススクロール
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
    
    // 見出しIDの安全な生成（簡素化バージョン）
    function addHeadingIds() {
        const headings = document.querySelectorAll('.page-content h1, .page-content h2, .page-content h3, .page-content h4, .page-content h5, .page-content h6');
        let idCounter = 0;
        
        // 処理件数制限（パフォーマンス保護）
        const maxHeadings = Math.min(headings.length, 30);
        
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

    // 外部リンクの安全な処理（最小限）
    function handleExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        
        // 処理件数制限
        const maxLinks = Math.min(links.length, 50);
        
        for (let i = 0; i < maxLinks; i++) {
            const link = links[i];
            if (!link.hasAttribute('target') && link.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    }

    // SVG修正とイメージ強化（特別対応）
    function enhanceImages() {
        const images = document.querySelectorAll('img');
        
        // 処理件数制限を大幅に削減（105個のSVGがあるため）
        const maxImages = Math.min(images.length, 20);
        
        for (let i = 0; i < maxImages; i++) {
            const img = images[i];
            
            // 遅延読み込み（特にSVGに重要）
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // SVGファイルの特別処理
            if (img.src && img.src.includes('.svg')) {
                // SVGのデコードを遅延
                img.setAttribute('decoding', 'async');
                
                // SVG読み込み後にスタイル修正を試行
                img.addEventListener('load', function() {
                    fixSVGStyles(this);
                });
            }
            
            // エラーハンドリング
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('[Safe JS] Image failed to load:', this.src);
            });
        }
        
        if (images.length > maxImages) {
            console.warn(`[Safe JS] Processed only ${maxImages} images out of ${images.length} due to ${document.querySelectorAll('img[src*=".svg"]').length} SVG diagrams`);
        }
    }
    
    // SVGスタイル修正関数
    function fixSVGStyles(imgElement) {
        try {
            // SVGを埋め込み形式に変換して直接スタイルを適用
            fetch(imgElement.src)
                .then(response => response.text())
                .then(svgText => {
                    // CSS変数を直接値に置換
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    const replacements = currentTheme === 'dark' ? {
                        'var(--svg-bg)': '#0f172a',
                        'var(--svg-bg-alt)': '#1e293b',
                        'var(--svg-text)': '#f1f5f9',
                        'var(--svg-border)': '#334155',
                        'var(--svg-primary)': '#3b82f6',
                        'var(--svg-success)': '#10b981',
                        'var(--svg-warning)': '#f59e0b',
                        'var(--svg-error)': '#ef4444',
                        'var(--svg-neutral)': '#94a3b8'
                    } : {
                        'var(--svg-bg)': '#ffffff',
                        'var(--svg-bg-alt)': '#f8fafc',
                        'var(--svg-text)': '#1e293b',
                        'var(--svg-border)': '#e2e8f0',
                        'var(--svg-primary)': '#2563eb',
                        'var(--svg-success)': '#10b981',
                        'var(--svg-warning)': '#f59e0b',
                        'var(--svg-error)': '#ef4444',
                        'var(--svg-neutral)': '#64748b'
                    };
                    
                    let fixedSvg = svgText;
                    Object.entries(replacements).forEach(([variable, value]) => {
                        fixedSvg = fixedSvg.replace(new RegExp(variable, 'g'), value);
                    });
                    
                    // SVGを埋め込み形式で置換
                    const blob = new Blob([fixedSvg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    imgElement.src = url;
                    
                    // メモリリークを防ぐために古いURLを解放
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                })
                .catch(error => {
                    console.warn('[Safe JS] Failed to fix SVG:', error);
                });
        } catch (error) {
            console.warn('[Safe JS] SVG fix error:', error);
        }
    }

    // コードコピー機能（簡素化）
    function initCodeCopy() {
        const codeBlocks = document.querySelectorAll('pre code');
        const maxCodeBlocks = Math.min(codeBlocks.length, 20);
        
        for (let i = 0; i < maxCodeBlocks; i++) {
            const codeBlock = codeBlocks[i];
            const pre = codeBlock.parentElement;
            
            if (!pre.querySelector('.copy-button')) {
                const button = document.createElement('button');
                button.className = 'copy-button';
                button.textContent = 'Copy';
                button.setAttribute('aria-label', 'Copy code');
                
                button.addEventListener('click', () => {
                    navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                        button.textContent = 'Copied!';
                        setTimeout(() => {
                            button.textContent = 'Copy';
                        }, 2000);
                    }).catch(() => {
                        console.warn('[Safe JS] Failed to copy code');
                    });
                });
                
                pre.style.position = 'relative';
                pre.appendChild(button);
            }
        }
    }

    // 基本スタイルの追加
    function addStyles() {
        const styles = `
            <style>
            /* Copy button styles */
            .copy-button {
                position: absolute;
                top: 8px;
                right: 8px;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .copy-button:hover {
                opacity: 1;
            }
            
            /* Basic responsive styles */
            @media (max-width: 768px) {
                .copy-button {
                    position: static;
                    display: block;
                    margin-top: 8px;
                    width: 100%;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // 基本機能の初期化
    function initBasicFeatures() {
        safeExecute(addStyles, 'addStyles');
        safeExecute(initTheme, 'initTheme');
        safeExecute(initSidebar, 'initSidebar');
        safeExecute(initSmoothScrolling, 'initSmoothScrolling');
    }

    // 重い処理の遅延初期化（105個のSVG対応）
    function initHeavyFeatures() {
        // 大量のSVGがあるため、より慎重な遅延実行
        setTimeout(() => {
            safeExecuteWithTimeout(() => addHeadingIds(), 200, 'addHeadingIds');
            safeExecuteWithTimeout(() => handleExternalLinks(), 150, 'handleExternalLinks');
        }, 300);
        
        // さらに遅延してSVG処理とコードコピー
        setTimeout(() => {
            safeExecuteWithTimeout(() => enhanceImages(), 300, 'enhanceImages');
            safeExecuteWithTimeout(() => initCodeCopy(), 200, 'initCodeCopy');
        }, 800);
    }

    // DOMContentLoaded時の初期化
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[Safe JS] Initializing unified JavaScript features...');
        
        // 基本機能をすぐに実行
        initBasicFeatures();
        
        // 重い処理は遅延実行
        initHeavyFeatures();
        
        console.log('[Safe JS] Unified JavaScript initialization completed');
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