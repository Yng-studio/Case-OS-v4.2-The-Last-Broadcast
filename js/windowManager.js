/**
 * Window Manager - Handles creation, positioning, z-index, and lifecycle of OS windows
 */

import { EvidenceBoard } from './evidence.js';
import { SuspectProfiles } from './suspects.js';
import { CrimeScene } from './crimeScene.js';
import { Timeline } from './timeline.js';
import { Forensics } from './forensics.js';
import { Notebook } from './notebook.js';
import { Verdict } from './verdict.js';

export class WindowManager {
    constructor() {
        this.windows = new Map();
        this.windowLayer = document.getElementById('window-layer');
        this.taskbarWindows = document.getElementById('taskbar-windows');
        this.template = document.getElementById('window-template');
        this.zIndex = 100;
        this.windowCount = 0;
        
        // Window configurations
        this.configs = {
            'evidence-board': {
                title: 'Evidence Board',
                icon: '📌',
                width: 800,
                height: 600,
                component: EvidenceBoard
            },
            'suspect-profiles': {
                title: 'Suspect Database',
                icon: '👤',
                width: 900,
                height: 650,
                component: SuspectProfiles
            },
            'crime-scene': {
                title: 'Crime Scene Reconstruction',
                icon: '🔍',
                width: 800,
                height: 600,
                component: CrimeScene
            },
            'timeline': {
                title: 'Timeline of Events',
                icon: '📊',
                width: 700,
                height: 600,
                component: Timeline
            },
            'forensics': {
                title: 'Digital Forensics',
                icon: '💾',
                width: 850,
                height: 600,
                component: Forensics
            },
            'notebook': {
                title: 'Field Notebook',
                icon: '📓',
                width: 600,
                height: 500,
                component: Notebook
            },
            'verdict': {
                title: 'Submit Verdict',
                icon: '⚖️',
                width: 700,
                height: 700,
                component: Verdict
            }
        };
    }

    open(type) {
        // If already open, focus it
        if (this.windows.has(type)) {
            this.focus(type);
            return;
        }

        const config = this.configs[type];
        if (!config) return;

        const win = this.createWindow(type, config);
        this.windows.set(type, win);
        this.windowLayer.appendChild(win.element);
        
        // Animate in
        win.element.style.animation = 'windowOpen 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Add to taskbar
        this.addTaskbarButton(type, config);
        
        // Initialize component
        if (config.component) {
            win.instance = new config.component(win.content);
        }
        
        this.focus(type);
    }

    createWindow(type, config) {
        const clone = this.template.content.cloneNode(true);
        const element = clone.querySelector('.os-window');
        const header = element.querySelector('.window-header');
        const titleText = element.querySelector('.window-text');
        const titleIcon = element.querySelector('.window-icon');
        const content = element.querySelector('.window-content');
        const controls = element.querySelectorAll('.win-btn');

        // Set content
        titleText.textContent = config.title;
        titleIcon.textContent = config.icon;
        
        // Position with cascade offset
        const offset = (this.windowCount % 5) * 30;
        element.style.width = `${config.width}px`;
        element.style.height = `${config.height}px`;
        element.style.left = `${100 + offset}px`;
        element.style.top = `${50 + offset}px`;
        
        // Store references
        const win = { element, content, type, minimized: false, maximized: false };
        
        // Event listeners
        header.addEventListener('mousedown', (e) => this.startDrag(e, win));
        header.addEventListener('touchstart', (e) => this.startDrag(e, win), { passive: false });
        
        controls[0].addEventListener('click', () => this.minimize(type)); // minimize
        controls[1].addEventListener('click', () => this.toggleMaximize(type)); // maximize
        controls[2].addEventListener('click', () => this.close(type)); // close
        
        // Focus on click
        element.addEventListener('mousedown', () => this.focus(type));
        
        // Resize handle
        const resizeHandle = element.querySelector('.window-resize-handle');
        resizeHandle.addEventListener('mousedown', (e) => this.startResize(e, win));
        
        this.windowCount++;
        return win;
    }

    close(type) {
        const win = this.windows.get(type);
        if (!win) return;
        
        win.element.style.animation = 'windowClose 0.2s ease forwards';
        setTimeout(() => {
            win.element.remove();
            this.windows.delete(type);
            this.removeTaskbarButton(type);
            
            if (win.instance?.destroy) {
                win.instance.destroy();
            }
        }, 200);
    }

    focus(type) {
        const win = this.windows.get(type);
        if (!win) return;
        
        // Bring to front
        this.zIndex++;
        win.element.style.zIndex = this.zIndex;
        
        // Mark active
        this.windows.forEach((w, key) => {
            w.element.classList.toggle('active', key === type);
        });
        
        // Update taskbar
        this.updateTaskbarActive(type);
        
        // Restore if minimized
        if (win.minimized) {
            this.restore(type);
        }
    }

    minimize(type) {
        const win = this.windows.get(type);
        if (!win) return;
        
        win.minimized = true;
        win.element.classList.add('minimized');
        this.updateTaskbarActive(null);
    }

    restore(type) {
        const win = this.windows.get(type);
        if (!win) return;
        
        win.minimized = false;
        win.element.classList.remove('minimized');
        this.focus(type);
    }

    toggleMaximize(type) {
        const win = this.windows.get(type);
        if (!win) return;
        
        win.maximized = !win.maximized;
        win.element.classList.toggle('maximized', win.maximized);
        
        const btn = win.element.querySelector('.maximize');
        btn.textContent = win.maximized ? '❐' : '□';
    }

    // Drag functionality
    startDrag(e, win) {
        if (win.maximized) return;
        if (e.target.closest('.window-controls')) return;
        
        const isTouch = e.type === 'touchstart';
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;
        
        const rect = win.element.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;
        
        const onMove = (ev) => {
            const cx = isTouch ? ev.touches[0].clientX : ev.clientX;
            const cy = isTouch ? ev.touches[0].clientY : ev.clientY;
            
            win.element.style.left = `${cx - offsetX}px`;
            win.element.style.top = `${cy - offsetY}px`;
        };
        
        const onEnd = () => {
            document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onMove);
            document.removeEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
        };
        
        document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onMove, { passive: false });
        document.addEventListener(isTouch ? 'touchend' : 'mouseup', onEnd);
        
        this.focus(win.type);
    }

    // Resize functionality
    startResize(e, win) {
        if (win.maximized) return;
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = win.element.offsetWidth;
        const startHeight = win.element.offsetHeight;
        
        const onMove = (ev) => {
            const newWidth = Math.max(300, startWidth + (ev.clientX - startX));
            const newHeight = Math.max(200, startHeight + (ev.clientY - startY));
            win.element.style.width = `${newWidth}px`;
            win.element.style.height = `${newHeight}px`;
        };
        
        const onEnd = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
        };
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
    }

    // Taskbar management
    addTaskbarButton(type, config) {
        const btn = document.createElement('button');
        btn.className = 'taskbar-window-btn';
        btn.dataset.window = type;
        btn.innerHTML = `<span>${config.icon}</span><span>${config.title}</span>`;
        
        btn.addEventListener('click', () => {
            const win = this.windows.get(type);
            if (win?.minimized) {
                this.restore(type);
            } else if (win?.element.classList.contains('active')) {
                this.minimize(type);
            } else {
                this.focus(type);
            }
        });
        
        this.taskbarWindows.appendChild(btn);
    }

    removeTaskbarButton(type) {
        const btn = this.taskbarWindows.querySelector(`[data-window="${type}"]`);
        if (btn) btn.remove();
    }

    updateTaskbarActive(activeType) {
        this.taskbarWindows.querySelectorAll('.taskbar-window-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.window === activeType);
        });
    }
}