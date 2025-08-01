/**
 * Lightweight Code Copy Functionality
 * Optimized version without MutationObserver to prevent page freeze
 * Based on book-formatter lightweight approach
 */

(function() {
    'use strict';
    
    // Simple one-time initialization without observers
    function initCodeCopy() {
        const codeBlocks = document.querySelectorAll('pre > code');
        
        codeBlocks.forEach((block, index) => {
            // Skip if already processed
            if (block.parentElement.dataset.copyProcessed) {
                return;
            }
            
            const pre = block.parentElement;
            pre.dataset.copyProcessed = 'true';
            
            // Create simple copy button
            const button = document.createElement('button');
            button.className = 'copy-btn';
            button.innerHTML = 'Copy';
            button.setAttribute('aria-label', 'Copy code');
            
            // Simple click handler
            button.onclick = function() {
                copyToClipboard(block.textContent, button);
            };
            
            // Insert button
            pre.style.position = 'relative';
            pre.insertBefore(button, pre.firstChild);
        });
    }
    
    // Lightweight copy function
    function copyToClipboard(text, button) {
        // Modern browsers
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showSuccess(button);
            }).catch(() => {
                fallbackCopy(text, button);
            });
        } else {
            fallbackCopy(text, button);
        }
    }
    
    // Fallback for older browsers
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showSuccess(button);
        } catch (err) {
            console.log('Copy failed');
        }
        
        document.body.removeChild(textArea);
    }
    
    // Success feedback
    function showSuccess(button) {
        const original = button.innerHTML;
        button.innerHTML = 'Copied!';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = original;
            button.style.background = '';
        }, 1500);
    }
    
    // One-time initialization only
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeCopy);
    } else {
        initCodeCopy();
    }
})();