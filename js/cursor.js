/**
 * Custom Cursor - Red and Black Magnifying Glass
 */

export class Cursor {
    constructor() {
        this.cursor = null;
        this.flashlight = document.getElementById('cursor-flashlight');
        
        this.init();
    }

    init() {
        if (window.matchMedia('(pointer: coarse)').matches || 
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.style.cursor = 'auto';
            return;
        }

        this.createCursor();
        this.bindEvents();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        
        this.cursor.innerHTML = `
            <svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="10" height="3" rx="1.5" transform="rotate(45 25 21.5)" fill="#000000"/>
                <circle cx="13" cy="13" r="10" stroke="#000000" stroke-width="2.5" fill="none"/>
                <circle cx="13" cy="13" r="8" stroke="#c94a4a" stroke-width="1.5" fill="rgba(201, 74, 74, 0.08)"/>
                <path d="M8 8 Q10 6 12 7" stroke="#c94a4a" stroke-width="1" fill="none" opacity="0.6"/>
            </svg>
        `;
        
        document.body.appendChild(this.cursor);
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mousedown', () => this.onMouseDown());
        document.addEventListener('mouseup', () => this.onMouseUp());
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
        const hoverable = e.target.closest('button, a, .desktop-icon, .evidence-item, .suspect-card, .timeline-item, .forensics-item, .scene-btn, .phone-key, .win-btn, .start-item, .taskbar-window-btn, .scene-marker');
        
        if (hoverable && this.cursor) {
            this.cursor.classList.add('hovering');
        }
    }

    onMouseOut(e) {
        const hoverable = e.target.closest('button, a, .desktop-icon, .evidence-item, .suspect-card, .timeline-item, .forensics-item, .scene-btn, .phone-key, .win-btn, .start-item, .taskbar-window-btn, .scene-marker');
        
        if (hoverable && this.cursor) {
            const relatedHoverable = e.relatedTarget?.closest('button, a, .desktop-icon, .evidence-item, .suspect-card, .timeline-item, .forensics-item, .scene-btn, .phone-key, .win-btn, .start-item, .taskbar-window-btn, .scene-marker');
            
            if (!relatedHoverable) {
                this.cursor.classList.remove('hovering');
            }
        }
    }
}
