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
        if (this.isTouch || this.isReducedMotion) {
            return;
        }

        this.createCursorElement();
        this.bindEvents();
    }

    createCursorElement() {
        const existing = document.querySelector('.custom-cursor');
        if (existing) existing.remove();

        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        
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
        document.addEventListener('mousemove', (e) => {
            this.updatePosition(e.clientX, e.clientY);
        });

        document.addEventListener('mousedown', () => {
            if (this.cursor) this.cursor.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            if (this.cursor) this.cursor.classList.remove('clicking');
        });

        const interactiveSelectors = [
            'button', 'a', '.desktop-icon', '.evidence-item', 
            '.suspect-card', '.timeline-item', '.forensics-item', 
            '.scene-btn', '.phone-key', '.win-btn', '.start-item', 
            '.taskbar-window-btn', '.scene-marker', '.notebook-btn',
            '.modal-btn', '.verdict-submit', '.audio-btn', '.taskbar-start',
            '.forensics-item', '.evidence-item', '.phone-key'
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

        document.addEventListener('mouseleave', () => {
            if (this.cursor) this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            if (this.cursor) this.cursor.style.opacity = '1';
        });
    }

    updatePosition(x, y) {
        if (!this.cursor) return;
        this.cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        
        if (this.flashlight) {
            this.flashlight.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
    }

    destroy() {
        if (this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }
    }
}
