/**
 * Crime Scene Viewer - 3D room reconstruction with interactive markers and photos
 */

export class CrimeScene {
    constructor(container) {
        this.container = container;
        this.flashlightOn = false;
        this.rotation = 0;
        this.markers = [];
        this.foundEvidence = new Set();
        
        this.render();
    }

    render() {
        const viewer = document.createElement('div');
        viewer.className = 'scene-viewer';
        
        viewer.innerHTML = `
            <div class="section-header">
                <div class="section-tag">Exhibit 03</div>
                <div class="section-title">Crime Scene · Studio B</div>
                <div class="section-desc">Rotate the room. Cut the lights. Click the pulsing markers to collect evidence.</div>
            </div>
            <div class="scene-stage" id="scene-stage">
                <div class="scene-image-container" id="scene-image-container">
                    <img src="assets/images/scene-studio-b.jpg" alt="Studio B Crime Scene" class="scene-image">
                </div>
                <div class="scene-markers" id="scene-markers"></div>
                <div class="scene-overlay-info">
                    <div class="scene-rec-indicator">● REC</div>
                    <div class="scene-location">STUDIO B · 03:47</div>
                </div>
            </div>
            <div class="scene-controls">
                <button class="scene-btn" id="rotate-left">◀ Rotate</button>
                <button class="scene-btn" id="rotate-right">Rotate ▶</button>
                <button class="scene-btn" id="toggle-flashlight">Flashlight OFF</button>
                <button class="scene-btn" id="reset-view">Reset View</button>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: var(--space-md);">
                Drag to look around · Click markers to investigate
            </div>
        `;
        
        this.container.appendChild(viewer);
        
        this.stage = viewer.querySelector('#scene-stage');
        this.imageContainer = viewer.querySelector('#scene-image-container');
        this.markersContainer = viewer.querySelector('#scene-markers');
        
        this.setupControls();
        this.setupMarkers();
    }

    setupControls() {
        const leftBtn = this.container.querySelector('#rotate-left');
        const rightBtn = this.container.querySelector('#rotate-right');
        const flashBtn = this.container.querySelector('#toggle-flashlight');
        const resetBtn = this.container.querySelector('#reset-view');
        
        leftBtn.addEventListener('click', () => this.rotate(-45));
        rightBtn.addEventListener('click', () => this.rotate(45));
        
        flashBtn.addEventListener('click', () => {
            this.flashlightOn = !this.flashlightOn;
            flashBtn.textContent = this.flashlightOn ? 'Flashlight ON' : 'Flashlight OFF';
            flashBtn.classList.toggle('active', this.flashlightOn);
            this.stage.classList.toggle('flashlight-active', this.flashlightOn);
        });
        
        resetBtn.addEventListener('click', () => {
            this.rotation = 0;
            this.imageContainer.style.transform = `rotateY(0deg)`;
            this.flashlightOn = false;
            flashBtn.textContent = 'Flashlight OFF';
            flashBtn.classList.remove('active');
            this.stage.classList.remove('flashlight-active');
        });
        
        // Drag to rotate
        let isDragging = false;
        let startX = 0;
        
        this.stage.addEventListener('mousedown', (e) => {
            if (e.target.closest('.scene-marker')) return;
            isDragging = true;
            startX = e.clientX;
            this.stage.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = e.clientX - startX;
            this.rotation += delta * 0.3;
            this.imageContainer.style.transform = `rotateY(${this.rotation}deg)`;
            startX = e.clientX;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.stage.style.cursor = '';
        });
    }

    setupMarkers() {
        const markerData = [
            { id: 'm1', x: 85, y: 60, label: 'Blood Spatter', image: 'assets/images/scene-blood.jpg' },
            { id: 'm2', x: 30, y: 55, label: 'Console', image: 'assets/images/scene-console.jpg' },
            { id: 'm3', x: 55, y: 40, label: 'Exit Door', image: 'assets/images/scene-exit.jpg' },
            { id: 'm4', x: 15, y: 45, label: 'Window', image: 'assets/images/scene-window.jpg' }
        ];
        
        markerData.forEach(m => {
            const marker = document.createElement('div');
            marker.className = 'scene-marker';
            marker.style.cssText = `
                position: absolute;
                left: ${m.x}%;
                top: ${m.y}%;
                width: 24px;
                height: 24px;
                background: var(--danger);
                border-radius: 50%;
                cursor: none;
                animation: pulse 1.5s infinite;
                box-shadow: 0 0 15px var(--danger-glow);
                z-index: 10;
                border: 2px solid var(--bg-primary);
            `;
            marker.dataset.id = m.id;
            marker.title = m.label;
            
            // Add label
            const label = document.createElement('div');
            label.className = 'scene-marker-label';
            label.textContent = m.label;
            label.style.cssText = `
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                font-family: var(--font-mono);
                font-size: 0.65rem;
                color: var(--text-primary);
                background: var(--bg-overlay);
                padding: 2px 8px;
                border-radius: 4px;
                white-space: nowrap;
                opacity: 0;
                transition: opacity var(--transition-fast);
                pointer-events: none;
            `;
            marker.appendChild(label);
            
            marker.addEventListener('mouseenter', () => {
                label.style.opacity = '1';
            });
            marker.addEventListener('mouseleave', () => {
                label.style.opacity = '0';
            });
            
            marker.addEventListener('click', () => this.collectEvidence(m));
            
            this.markersContainer.appendChild(marker);
            this.markers.push(marker);
        });
    }

    collectEvidence(marker) {
        if (this.foundEvidence.has(marker.id)) {
            // Already found, show photo again
            this.showEvidencePhoto(marker);
            return;
        }
        
        this.foundEvidence.add(marker.id);
        
        // Visual feedback
        const el = this.markersContainer.querySelector(`[data-id="${marker.id}"]`);
        if (el) {
            el.style.background = 'var(--success)';
            el.style.boxShadow = '0 0 15px var(--success-glow)';
            el.style.animation = 'none';
        }
        
        // Show photo evidence
        this.showEvidencePhoto(marker);
        
        // Show toast
        const event = new CustomEvent('toast-show', {
            detail: { message: `Evidence collected: ${marker.label}`, type: 'success' }
        });
        document.dispatchEvent(event);
    }

    showEvidencePhoto(marker) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: var(--space-lg);
            animation: fadeIn 0.3s ease;
        `;
        
        overlay.innerHTML = `
            <div style="position: relative; max-width: 80vw; max-height: 70vh;">
                <img src="${marker.image}" alt="${marker.label}" style="max-width: 100%; max-height: 70vh; border-radius: var(--space-sm); border: 1px solid var(--border-medium);">
                <div style="position: absolute; top: var(--space-sm); right: var(--space-sm); font-family: var(--font-mono); font-size: 0.75rem; color: var(--danger); animation: pulse 1.5s infinite;">● REC</div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-primary);">
                ${marker.label} · EVIDENCE PHOTO
            </div>
            <button class="scene-btn" id="close-photo" style="position: absolute; top: var(--space-lg); right: var(--space-lg);">✕ Close</button>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('#close-photo').addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => overlay.remove(), 300);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => overlay.remove(), 300);
            }
        });
    }

    rotate(deg) {
        this.rotation += deg;
        this.imageContainer.style.transition = 'transform 0.5s ease';
        this.imageContainer.style.transform = `rotateY(${this.rotation}deg)`;
    }

    destroy() {}
}