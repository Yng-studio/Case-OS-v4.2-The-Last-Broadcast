/**
 * Animation Utilities - Toast notifications and Modal dialogs
 */

/**
 * Toast notification system
 */
export class Toast {
    static container = null;

    static getContainer() {
        if (!Toast.container) {
            Toast.container = document.createElement('div');
            Toast.container.className = 'toast-container';
            document.body.appendChild(Toast.container);
        }
        return Toast.container;
    }

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - 'success', 'error', 'info'
     * @param {number} duration - Duration in ms (default 3000)
     */
    static show(message, type = 'info', duration = 3000) {
        const container = Toast.getContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
                Toast.container = null;
            }
        }, duration);
    }
}

/**
 * Modal dialog system
 */
export class Modal {
    static current = null;

    /**
     * Show a modal dialog
     * @param {string} title - Modal title
     * @param {string} content - HTML content
     * @param {Object} options - Additional options
     */
    static show(title, content, options = {}) {
        // Close existing modal
        Modal.close();

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal-content';
        modal.innerHTML = `
            <div class="modal-title">${escapeHtml(title)}</div>
            <div class="modal-text">${content}</div>
            <div class="modal-actions">
                <button class="modal-btn primary" id="modal-ok">OK</button>
            </div>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        Modal.current = overlay;
        
        // Focus trap
        const okBtn = modal.querySelector('#modal-ok');
        okBtn.focus();
        
        // Event listeners
        okBtn.addEventListener('click', () => Modal.close());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) Modal.close();
        });
        
        document.addEventListener('keydown', Modal.onKeyDown);
        
        // Custom action if provided
        if (options.onConfirm) {
            okBtn.addEventListener('click', options.onConfirm);
        }
    }

    /**
     * Close the current modal
     */
    static close() {
        if (Modal.current) {
            Modal.current.remove();
            Modal.current = null;
            document.removeEventListener('keydown', Modal.onKeyDown);
        }
    }

    static onKeyDown(e) {
        if (e.key === 'Escape') {
            Modal.close();
        }
    }
}

/**
 * Escape HTML entities to prevent XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Listen for toast events from other modules
document.addEventListener('toast-show', (e) => {
    if (e.detail) {
        Toast.show(e.detail.message, e.detail.type);
    }
});