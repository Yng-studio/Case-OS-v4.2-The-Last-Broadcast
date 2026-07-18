/**
 * Digital Forensics - Phone unlock, audio analysis, CCTV viewer
 */

import { Toast } from './animations.js';

export class Forensics {
    constructor(container) {
        this.container = container;
        this.currentTab = 'phone';
        this.phoneUnlocked = false;
        this.audioPlaying = false;
        this.cctvFrame = 3;
        
        this.render();
    }

    render() {
        const grid = document.createElement('div');
        grid.className = 'forensics-grid';
        
        // Sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'forensics-sidebar';
        
        const tabs = [
            { id: 'phone', icon: '📱', label: 'Evidence Phone' },
            { id: 'terminal', icon: '💻', label: 'Personal Terminal' },
            { id: 'audio', icon: '🎙️', label: 'Master Recording' },
            { id: 'cctv', icon: '📹', label: 'CAM-07 Tower Lot' }
        ];
        
        tabs.forEach(tab => {
            const btn = document.createElement('div');
            btn.className = `forensics-item ${tab.id === this.currentTab ? 'active' : ''}`;
            btn.dataset.tab = tab.id;
            btn.innerHTML = `<span>${tab.icon}</span><span>${tab.label}</span>`;
            btn.addEventListener('click', () => this.switchTab(tab.id));
            sidebar.appendChild(btn);
        });
        
        grid.appendChild(sidebar);
        
        // Content area
        this.contentArea = document.createElement('div');
        this.contentArea.className = 'forensics-content';
        grid.appendChild(this.contentArea);
        
        this.container.appendChild(grid);
        
        this.renderTab(this.currentTab);
    }

    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Update sidebar
        this.container.querySelectorAll('.forensics-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabId);
        });
        
        this.renderTab(tabId);
    }

    renderTab(tabId) {
        this.contentArea.innerHTML = '';
        
        switch(tabId) {
            case 'phone':
                this.renderPhone();
                break;
            case 'terminal':
                this.renderTerminal();
                break;
            case 'audio':
                this.renderAudio();
                break;
            case 'cctv':
                this.renderCCTV();
                break;
        }
    }

    renderPhone() {
        const passcode = '1997'; // Year of the fire
        let entered = '';
        
        const phone = document.createElement('div');
        phone.className = 'phone-unlock';
        
        phone.innerHTML = `
            <div class="phone-screen">
                <div class="phone-display" id="phone-display">_ _ _ _</div>
                <div class="phone-hint">HINT: Year of the fire</div>
                <div class="phone-keypad" id="phone-keypad"></div>
            </div>
        `;
        
        this.contentArea.appendChild(phone);
        
        const display = phone.querySelector('#phone-display');
        const keypad = phone.querySelector('#phone-keypad');
        
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'ENT'];
        
        keys.forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'phone-key';
            btn.textContent = key;
            btn.addEventListener('click', () => {
                if (key === 'CLR') {
                    entered = '';
                } else if (key === 'ENT') {
                    if (entered === passcode) {
                        this.phoneUnlocked = true;
                        display.textContent = 'UNLOCKED';
                        display.style.color = 'var(--success)';
                        Toast.show('Phone unlocked. 3 files recovered.', 'success');
                    } else {
                        display.textContent = 'ERROR';
                        display.style.color = 'var(--danger)';
                        setTimeout(() => {
                            entered = '';
                            display.textContent = '_ _ _ _';
                            display.style.color = 'var(--accent-primary)';
                        }, 1000);
                    }
                    return;
                } else if (entered.length < 4) {
                    entered += key;
                }
                
                display.textContent = entered.padEnd(4, '_').split('').join(' ');
                display.style.color = 'var(--accent-primary)';
            });
            keypad.appendChild(btn);
        });
    }

    renderTerminal() {
        this.contentArea.innerHTML = `
            <div class="section-header">
                <div class="section-tag">C:\\EVIDENCE\\VANCE_E</div>
                <div class="section-title">Personal Terminal</div>
                <div class="section-desc">5 items · SECURE</div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; line-height: 2;">
                <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm); border-radius: var(--space-xs); cursor: none;" class="hover-lift">
                    <span>✉</span> <span>Emails</span> <span style="margin-left: auto; color: var(--text-muted);">12 unread</span>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm); border-radius: var(--space-xs); cursor: none;" class="hover-lift">
                    <span>◐</span> <span>Browser</span> <span style="margin-left: auto; color: var(--text-muted);">History</span>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm); border-radius: var(--space-xs); cursor: none;" class="hover-lift">
                    <span>▼</span> <span>Downloads</span> <span style="margin-left: auto; color: var(--text-muted);">3 files</span>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm); border-radius: var(--space-xs); cursor: none;" class="hover-lift">
                    <span>↺</span> <span>Recovered</span> <span style="margin-left: auto; color: var(--text-muted);">Deleted</span>
                </div>
                <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm); border-radius: var(--space-xs); cursor: none;" class="hover-lift">
                    <span>◈</span> <span>.system</span> <span style="margin-left: auto; color: var(--danger);">RESTRICTED</span>
                </div>
            </div>
        `;
    }

    renderAudio() {
        const player = document.createElement('div');
        player.className = 'audio-player';
        
        player.innerHTML = `
            <div class="section-header" style="margin-bottom: var(--space-lg);">
                <div class="section-tag">Master Recording</div>
                <div class="section-title">03:47:22 · Final Broadcast</div>
            </div>
            <div class="audio-visualizer" id="visualizer"></div>
            <div class="audio-controls">
                <button class="audio-btn" id="play-btn">▶</button>
                <div class="audio-progress">
                    <div class="audio-progress-fill" id="progress-fill"></div>
                </div>
            </div>
            <div class="audio-meta">
                <span>00:00</span>
                <span>00:46</span>
            </div>
            <div style="display: flex; gap: var(--space-md); margin-top: var(--space-lg);">
                <button class="scene-btn" id="noise-btn">Remove Noise</button>
                <button class="scene-btn" id="subtitles-btn">Generate Subtitles</button>
            </div>
        `;
        
        this.contentArea.appendChild(player);
        
        // Visualizer bars
        const visualizer = player.querySelector('#visualizer');
        for (let i = 0; i < 40; i++) {
            const bar = document.createElement('div');
            bar.className = 'audio-bar';
            bar.style.height = '20%';
            visualizer.appendChild(bar);
        }
        
        // Play button
        const playBtn = player.querySelector('#play-btn');
        const progressFill = player.querySelector('#progress-fill');
        let progress = 0;
        let interval = null;
        
        playBtn.addEventListener('click', () => {
            this.audioPlaying = !this.audioPlaying;
            playBtn.textContent = this.audioPlaying ? '⏸' : '▶';
            
            if (this.audioPlaying) {
                interval = setInterval(() => {
                    progress += 0.5;
                    if (progress >= 100) {
                        progress = 0;
                        this.audioPlaying = false;
                        playBtn.textContent = '▶';
                        clearInterval(interval);
                    }
                    progressFill.style.width = `${progress}%`;
                    
                    // Animate visualizer
                    visualizer.querySelectorAll('.audio-bar').forEach(bar => {
                        bar.style.height = `${Math.random() * 80 + 10}%`;
                    });
                }, 100);
            } else {
                clearInterval(interval);
                visualizer.querySelectorAll('.audio-bar').forEach(bar => {
                    bar.style.height = '20%';
                });
            }
        });
        
        // Noise removal
        player.querySelector('#noise-btn').addEventListener('click', () => {
            Toast.show('Noise profile analyzed. Rain and train isolated.', 'success');
        });
        
        // Subtitles
        player.querySelector('#subtitles-btn').addEventListener('click', () => {
            Toast.show('Transcription: "If anyone hears this — go to Tower 7."', 'info');
        });
    }

    renderCCTV() {
        const viewer = document.createElement('div');
        viewer.className = 'cctv-viewer';
        
        viewer.innerHTML = `
            <div class="cctv-header">
                <span>CAM-07 · Tower Lot</span>
                <span style="color: var(--danger); animation: pulse 1.5s infinite;">● LIVE</span>
            </div>
            <div class="cctv-feed">
                <div class="cctv-overlay"></div>
                <div style="font-family: var(--font-mono); color: var(--text-muted); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: var(--space-md);">📹</div>
                    <div>TOWER LOT · WEST FEED</div>
                    <div style="font-size: 0.75rem; margin-top: var(--space-sm);">Frame ${this.cctvFrame} of 12 · 03:48</div>
                </div>
            </div>
            <div class="cctv-controls">
                <button class="scene-btn" id="frame-prev">◀</button>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                    Frame ${this.cctvFrame} / 12
                </span>
                <button class="scene-btn" id="frame-next">▶</button>
                <div style="flex: 1;"></div>
                <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                    Brightness
                    <input type="range" class="cctv-slider" min="0" max="100" value="50">
                </label>
                <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                    Contrast
                    <input type="range" class="cctv-slider" min="0" max="100" value="50">
                </label>
            </div>
        `;
        
        this.contentArea.appendChild(viewer);
        
        // Frame navigation
        viewer.querySelector('#frame-prev').addEventListener('click', () => {
            this.cctvFrame = Math.max(1, this.cctvFrame - 1);
            this.updateCCTVFrame(viewer);
        });
        
        viewer.querySelector('#frame-next').addEventListener('click', () => {
            this.cctvFrame = Math.min(12, this.cctvFrame + 1);
            this.updateCCTVFrame(viewer);
        });
    }

    updateCCTVFrame(viewer) {
        const frameText = viewer.querySelector('.cctv-feed div div:last-child');
        if (frameText) {
            frameText.textContent = `Frame ${this.cctvFrame} of 12 · 03:48`;
        }
        const controlText = viewer.querySelector('.cctv-controls span');
        if (controlText) {
            controlText.textContent = `Frame ${this.cctvFrame} / 12`;
        }
    }

    destroy() {}
}