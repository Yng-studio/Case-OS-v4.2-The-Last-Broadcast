/**
 * Custom Cursor & Flashlight Effect
 * Replaces default cursor with a noir detective aesthetic
 */

export class Cursor {
    constructor() {
        this.cursor = null;
        this.flashlight = document.getElementById('cursor-flashlight');
        this.isHovering = false;
        
        this.init();
    }

    init() {
        // Skip custom cursor on touch devices or reduced motion
        if (window.matchMedia('(pointer: coarse)').matches || 
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.createCursor();
        this.bindEvents();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', () => this.onMouseDown());
        document.addEventListener('mouseup', () => this.onMouseUp());
        
        // Detect hoverable elements
        document.addEventListener('mouseover', (e) => this.onMouseOver(e));
        document.addEventListener('mouseout', (e) => this.onMouseOut(e));
    }

    onMouseMove(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        if (this.cursor) {
            this.cursor.style.left = `${x}px`;
            this.cursor.style.top = `${y}px`;
        }
        
        if (this.flashlight) {
            this.flashlight.style.left = `${x}px`;
            this.flashlight.style.top = `${y}px`;
        }
    }

    onMouseDown() {
        if (this.cursor) {
            this.cursor.classList.add('clicking');
        }
    }

    onMouseUp() {
        if (this.cursor) {
            this.cursor.classList.remove('clicking');
        }
    }

    onMouseOver(e) {
        const hoverable = e.target.closest('button, a, .desktop-icon, .evidence-item, .suspect-card, .timeline-item, .forensics-item, .scene-btn, .phone-key, .win-btn, .start-item, .taskbar-window-btn');
        
        if (hoverable && !this.isHovering) {
            this.isHovering = true;
            if (this.cursor) {
                this.cursor.classList.add('hovering');
            }
        }
    }

    onMouseOut(e) {
        const hoverable = e.target.closest('button, a, .desktop-icon, .evidence-item, .suspect-card, .timeline-item, .forensics-item, .scene-btn, .phone-key, .win-btn, .start-item, .taskbar-window-btn');
        
        if (hoverable) {
            // Check if we're entering another hoverable
            const relatedHoverable = e.relatedTarget?.closest('button, a, .desktop-icon, .evidence-item, .suspect-card, .timeline-item, .forensics-item, .scene-btn, .phone-key, .win-btn, .start-item, .taskbar-window-btn');
            
            if (!relatedHoverable) {
                this.isHovering = false;
                if (this.cursor) {
                    this.cursor.classList.remove('hovering');
                }
            }
        }
    }
}