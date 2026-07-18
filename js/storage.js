/**
 * Storage Manager - localStorage wrapper with serialization
 */

export class Storage {
    constructor(namespace = 'caseOS') {
        this.namespace = namespace;
        this.prefix = `${namespace}_`;
    }

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON serialized)
     */
    save(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(`${this.prefix}${key}`, serialized);
            return true;
        } catch (e) {
            console.error('Storage save failed:', e);
            return false;
        }
    }

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @returns {*} Parsed value or null
     */
    load(key) {
        try {
            const serialized = localStorage.getItem(`${this.prefix}${key}`);
            return serialized ? JSON.parse(serialized) : null;
        } catch (e) {
            console.error('Storage load failed:', e);
            return null;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        localStorage.removeItem(`${this.prefix}${key}`);
    }

    /**
     * Clear all data for this namespace
     */
    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    /**
     * Get all stored keys in this namespace
     * @returns {string[]} Array of keys (without prefix)
     */
    keys() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.slice(this.prefix.length));
    }

    /**
     * Check if a key exists
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(`${this.prefix}${key}`) !== null;
    }
}