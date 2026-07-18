/**
 * Field Notebook - Auto-saving detective notes
 */

import { Storage } from './storage.js';
import { Toast } from './animations.js';

export class Notebook {
    constructor(container) {
        this.container = container;
        this.storage = new Storage();
        this.saveTimeout = null;
        this.content = this.storage.load('notebook') || this.getDefaultContent();
        
        this.render();
    }

    render() {
        const notebook = document.createElement('div');
        notebook.className = 'notebook';
        
        notebook.innerHTML = `
            <div class="notebook-header">
                <div class="notebook-title">Detective's Notebook · Auto-saved locally</div>
                <div class="notebook-actions">
                    <button class="notebook-btn" id="clear-notes">Clear</button>
                    <button class="notebook-btn" id="export-notes">Export</button>
                </div>
            </div>
            <textarea class="notebook-editor" id="notebook-editor" placeholder="Working Theory...">${this.content}</textarea>
        `;
        
        this.container.appendChild(notebook);
        
        this.editor = notebook.querySelector('#notebook-editor');
        
        // Auto-save on input
        this.editor.addEventListener('input', () => {
            this.scheduleSave();
        });
        
        // Clear button
        notebook.querySelector('#clear-notes').addEventListener('click', () => {
            if (confirm('Clear all notes?')) {
                this.editor.value = '';
                this.save();
            }
        });
        
        // Export button
        notebook.querySelector('#export-notes').addEventListener('click', () => {
            this.exportNotes();
        });
    }

    getDefaultContent() {
        return `Working Theory

Every artifact on this page connects. The 1997 fire. The estate. The unknown caller. The passcode. The offshore ledger. When the picture is clear, submit your verdict below.

◆ Cross-reference dates on the timeline
◆ Match the encrypted ledger to a suspect
◆ Listen closely to the cleaned audio
◆ The photo on the phone is not decorative`;
    }

    scheduleSave() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        
        this.saveTimeout = setTimeout(() => {
            this.save();
        }, 1000);
        
        // Show unsaved indicator
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.querySelector('.save-status').classList.add('unsaved');
        }
    }

    save() {
        this.storage.save('notebook', this.editor.value);
        
        // Show saved indicator
        const indicator = document.getElementById('save-indicator');
        if (indicator) {
            indicator.querySelector('.save-status').classList.remove('unsaved');
        }
        
        Toast.show('Notebook saved', 'success');
    }

    exportNotes() {
        const text = this.editor.value;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'case-4471k-notes.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        Toast.show('Notes exported', 'success');
    }

    destroy() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        this.save();
    }
}