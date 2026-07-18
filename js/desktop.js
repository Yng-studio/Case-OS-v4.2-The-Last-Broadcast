/**
 * Desktop Environment - Manages icons, taskbar, and start menu
 */

export class Desktop {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.desktop = document.getElementById('desktop');
        this.icons = document.getElementById('desktop-icons');
        this.taskbar = document.getElementById('taskbar');
        this.startBtn = document.getElementById('start-btn');
        this.startMenu = document.getElementById('start-menu');
        this.clock = document.getElementById('clock');
        
        this.init();
    }

    init() {
        this.setupIcons();
        this.setupTaskbar();
        this.setupStartMenu();
        this.startClock();
        this.setupGlobalKeys();
    }

    show() {
        this.desktop.classList.remove('hidden');
        this.desktop.style.animation = 'fadeIn 0.5s ease';
    }

    setupIcons() {
        this.icons.addEventListener('dblclick', (e) => {
            const icon = e.target.closest('.desktop-icon');
            if (icon) {
                const windowType = icon.dataset.window;
                this.windowManager.open(windowType);
            }
        });

        // Also support Enter key
        this.icons.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const icon = document.activeElement.closest('.desktop-icon');
                if (icon) {
                    const windowType = icon.dataset.window;
                    this.windowManager.open(windowType);
                }
            }
        });
    }

    setupTaskbar() {
        this.startBtn.addEventListener('click', () => this.toggleStartMenu());
        
        // Close start menu when clicking desktop
        this.desktop.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.taskbar-start')) {
                this.closeStartMenu();
            }
        });
    }

    setupStartMenu() {
        const items = this.startMenu.querySelectorAll('.start-item[data-window]');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const windowType = item.dataset.window;
                this.windowManager.open(windowType);
                this.closeStartMenu();
            });
        });

        // System actions
        document.getElementById('save-case')?.addEventListener('click', () => {
            this.saveState();
            this.closeStartMenu();
        });

        document.getElementById('load-case')?.addEventListener('click', () => {
            this.loadState();
            this.closeStartMenu();
        });

        document.getElementById('reset-case')?.addEventListener('click', () => {
            if (confirm('Reset all investigation progress?')) {
                localStorage.removeItem('caseState');
                location.reload();
            }
        });
    }

    toggleStartMenu() {
        if (this.startMenu.classList.contains('hidden')) {
            this.openStartMenu();
        } else {
            this.closeStartMenu();
        }
    }

    openStartMenu() {
        this.startMenu.classList.remove('hidden');
        this.startMenu.classList.remove('closing');
    }

    closeStartMenu() {
        this.startMenu.classList.add('closing');
        setTimeout(() => {
            this.startMenu.classList.add('hidden');
            this.startMenu.classList.remove('closing');
        }, 200);
    }

    startClock() {
        const update = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            this.clock.textContent = `${hours}:${minutes}`;
        };
        update();
        setInterval(update, 1000);
    }

    setupGlobalKeys() {
        document.addEventListener('keydown', (e) => {
            // Escape closes start menu
            if (e.key === 'Escape') {
                this.closeStartMenu();
            }
            
            // Super key opens start menu
            if (e.key === 'Meta' || e.key === 'Alt') {
                if (e.key === 'Meta') {
                    this.toggleStartMenu();
                }
            }
        });
    }

    saveState() {
        const event = new CustomEvent('case-save');
        document.dispatchEvent(event);
    }

    loadState() {
        const event = new CustomEvent('case-load');
        document.dispatchEvent(event);
    }
}