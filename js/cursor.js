/**
 * Custom Cursor - Red and Black Magnifying Glass
 * Uses CSS cursor property with inline SVG data URI
 */

export class Cursor {
    constructor() {
        this.isTouch = window.matchMedia('(pointer: coarse)').matches;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.flashlight = document.getElementById('cursor-flashlight');
        
        this.init();
    }

    init() {
        // Skip on touch devices
        if (this.isTouch || this.isReducedMotion) {
            document.body.style.cursor = 'auto';
            if (this.flashlight) this.flashlight.style.display = 'none';
            return;
        }

        // Create flashlight effect
        this.setupFlashlight();
        
        // Set custom cursor using CSS
        this.setCustomCursor();
    }

    setupFlashlight() {
        if (!this.flashlight) return;
        
        // Flashlight follows mouse
        document.addEventListener('mousemove', (e) => {
            this.flashlight.style.left = e.clientX + 'px';
            this.flashlight.style.top = e.clientY + 'px';
        });
    }

    setCustomCursor() {
        // Inline SVG magnifying glass as data URI
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <g transform="translate(16,16)">
                <!-- Handle -->
                <rect x="8" y="8" width="10" height="3" rx="1.5" transform="rotate(45)" fill="%23000000"/>
                <!-- Outer rim -->
                <circle cx="-3" cy="-3" r="10" stroke="%23000000" stroke-width="2.5" fill="none"/>
                <!-- Inner red -->
                <circle cx="-3" cy="-3" r="7.5" stroke="%23c94a4a" stroke-width="1.5" fill="rgba(201,74,74,0.08)"/>
                <!-- Shine -->
                <path d="M-7,-7 Q-5,-9 -3,-8" stroke="%23c94a4a" stroke-width="1" fill="none" opacity="0.6"/>
            </g>
        </svg>`;
        
        const encoded = encodeURIComponent(svg.trim());
        const dataUri = `url("data:image/svg+xml,${encoded}") 16 16, auto`;
        
        // Apply to everything
        const style = document.createElement('style');
        style.textContent = `
            * {
                cursor: ${dataUri} !important;
            }
        `;
        document.head.appendChild(style);
        
        // Hover state - bigger cursor
        const hoverStyle = document.createElement('style');
        hoverStyle.textContent = `
            button:hover, a:hover, .desktop-icon:hover, .evidence-item:hover, 
            .suspect-card:hover, .timeline-item:hover, .forensics-item:hover, 
            .scene-btn:hover, .phone-key:hover, .win-btn:hover, .start-item:hover, 
            .taskbar-window-btn:hover, .scene-marker:hover, .notebook-btn:hover,
            .modal-btn:hover, .verdict-submit:hover, .audio-btn:hover,
            .taskbar-start:hover {
                cursor: url("data:image/svg+xml,${encodeURIComponent(this.getHoverSvg().trim())}") 20 20, auto !important;
            }
        `;
        document.head.appendChild(hoverStyle);
    }

    getHoverSvg() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <g transform="translate(20,20)">
                <rect x="10" y="10" width="13" height="4" rx="2" transform="rotate(45)" fill="%23000000"/>
                <circle cx="-4" cy="-4" r="13" stroke="%23000000" stroke-width="3" fill="none"/>
                <circle cx="-4" cy="-4" r="10" stroke="%23c94a4a" stroke-width="2" fill="rgba(201,74,74,0.12)"/>
                <path d="M-9,-9 Q-6,-11 -4,-10" stroke="%23c94a4a" stroke-width="1.5" fill="none" opacity="0.7"/>
                <circle cx="-4" cy="-4" r="15" stroke="%23c94a4a" stroke-width="0.5" fill="none" opacity="0.3"/>
            </g>
        </svg>`;
    }
}
