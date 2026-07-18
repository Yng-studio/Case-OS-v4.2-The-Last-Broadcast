/**
 * Case OS v4.2 - Main Entry Point
 * Initializes all subsystems and manages the boot sequence
 */

import { BootSequence } from './boot.js';
import { Desktop } from './desktop.js';
import { WindowManager } from './windowManager.js';
import { Cursor } from './cursor.js';
import { Storage } from './storage.js';
import { Toast } from './animations.js';

class CaseOS {
    constructor() {
        this.subsystems = new Map();
        this.initialized = false;
    }

    async init() {
        // Initialize storage first
        const storage = new Storage();
        this.subsystems.set('storage', storage);

        // Initialize cursor
        const cursor = new Cursor();
        this.subsystems.set('cursor', cursor);

        // Initialize window manager
        const windowManager = new WindowManager();
        this.subsystems.set('windowManager', windowManager);

        // Initialize desktop
        const desktop = new Desktop(windowManager);
        this.subsystems.set('desktop', desktop);

        // Run boot sequence
        const boot = new BootSequence(() => this.onBootComplete());
        this.subsystems.set('boot', boot);
        
        await boot.start();
    }

    onBootComplete() {
        const desktop = this.subsystems.get('desktop');
        desktop.show();
        
        // Load saved state if exists
        const storage = this.subsystems.get('storage');
        const savedState = storage.load('caseState');
        if (savedState) {
            Toast.show('Previous session restored', 'success');
        }
        
        this.initialized = true;
    }

    getSubsystem(name) {
        return this.subsystems.get(name);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.caseOS = new CaseOS();
        window.caseOS.init();
    });
} else {
    window.caseOS = new CaseOS();
    window.caseOS.init();
}