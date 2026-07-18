/**
 * Custom Cursor - Red and Black Magnifying Glass
 */

export class Cursor {
    constructor() {
        this.cursor = null;
        this.flashlight = document.getElementById('cursor-flashlight');
        this.isTouch = window.matchMedia('(pointer: coarse)').matches;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        // Don't run on touch devices or reduced motion preference
        if (this.isTouch || this.isReducedMotion) {
            document.body.style.cursor = 'auto';
            if (this.flashlight) this.flashlight.style.display = 'none';
            return;
        }

        this.createCursorElement();
        this.bindEvents();
    }

    createCursorElement() {
        // Remove any existing custom cursor
        const existing = document.querySelector('.custom-cursor');
        if (existing) existing.remove();

        // Create cursor container
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        
        // Create magnifying glass using pure CSS shapes
        const glass = document.createElement('div');
        glass.className = 'cursor-glass';
        
        const handle = document.createElement('div');
        handle.className = 'cursor-handle';
        
        const rim = document.createElement('div');
        rim.className = 'cursor-rim';
        
        const inner = document.createElement('div');
        inner.className = 'cursor-inner';
        
        const shine = document.createElement('div');
        shine.className = 'cursor-shine';
        
        glass.appendChild(rim);
        glass.appendChild(inner);
        glass.appendChild(shine);
        
        this.cursor.appendChild(glass);
        this.cursor.appendChild(handle);
        
        document.body.appendChild(this.cursor);
    }

    bindEvents() {
        // Mouse move - update position
        document.addEventListener('mousemove', (e) => {
            this.updatePosition(e.clientX, e.clientY);
        });

        // Mouse down - clicking state
        document.addEventListener('mousedown', () => {
            if (this.cursor) this.cursor.classList.add('clicking');
        });

        // Mouse up - release
        document.addEventListener('mouseup', () => {
            if (this.cursor) this.cursor.classList.remove('clicking');
        });

        // Hover detection for interactive elements
        const interactiveSelectors = [
            'button', 'a', '.desktop-icon', '.evidence-item', 
            '.suspect-card', '.timeline-item', '.forensics-item', 
            '.scene-btn', '.phone-key', '.win-btn', '.start-item', 
            '.taskbar-window-btn', '.scene-marker', '.notebook-btn',
            '.modal-btn', '.verdict-submit', '.audio-btn'
        ].join(', ');

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                if (this.cursor) this.cursor.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelectors)) {
                const related = e.relatedTarget?.closest(interactiveSelectors);
                if (!related) {
                    if (this.cursor) this.cursor.classList.remove('hovering');
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.checkVisibility();
        });

        // Handle mouse leaving window
        document.addEventListener('mouseleave', () => {
            if (this.cursor) this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            if (this.cursor) this.cursor.style.opacity = '1';
        });
    }

    updatePosition(x, y) {
        if (!this.cursor) return;
        
        // Use transform for smooth performance (GPU accelerated)
        this.cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        
        // Update flashlight position
        if (this.flashlight) {
            this.flashlight.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }
    }

    checkVisibility() {
        if (!this.cursor) return;
        // Ensure cursor is visible when needed
        this.cursor.style.opacity = '1';
    }

    destroy() {
        if (this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }
    }
}
