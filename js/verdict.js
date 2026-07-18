/**
 * Verdict Form - Submit final case solution
 */

import { Storage } from './storage.js';
import { Modal } from './animations.js';

export class Verdict {
    constructor(container) {
        this.container = container;
        this.storage = new Storage();
        this.submitted = this.storage.load('verdictSubmitted') || false;
        
        this.render();
    }

    render() {
        const form = document.createElement('div');
        form.className = 'verdict-form';
        
        form.innerHTML = `
            <div class="section-header">
                <div class="section-tag">Exhibit 06</div>
                <div class="section-title">Solve the Case</div>
                <div class="section-desc">You have all the evidence you need. Name the killer. State the motive. Explain the escape.</div>
            </div>
            
            <div class="verdict-section">
                <label class="verdict-label">Killer</label>
                <select class="verdict-select" id="verdict-killer">
                    <option value="">Select suspect...</option>
                    <option value="corbin">Miles Corbin · Station Manager</option>
                    <option value="reyes">Dr. Alina Reyes · Psychiatrist</option>
                    <option value="ward">Jonah Ward · Sound Engineer</option>
                    <option value="vance">Iris Vance · Estranged Sister</option>
                    <option value="fry">Detective Ansel Fry · Homicide, Retired</option>
                    <option value="unknown">Unknown Caller · Anonymous</option>
                </select>
            </div>
            
            <div class="verdict-section">
                <label class="verdict-label">Motive</label>
                <select class="verdict-select" id="verdict-motive">
                    <option value="">Select motive...</option>
                    <option value="estate">Estate & 1997 cover-up</option>
                    <option value="jealousy">Personal jealousy</option>
                    <option value="revenge">Revenge for firing</option>
                    <option value="whistleblower">Silence a whistleblower</option>
                </select>
            </div>
            
            <div class="verdict-section">
                <label class="verdict-label">Method</label>
                <select class="verdict-select" id="verdict-method">
                    <option value="">Select method...</option>
                    <option value="blunt">Blunt force — console mic stand</option>
                    <option value="poison">Poisoning</option>
                    <option value="strangle">Strangulation</option>
                    <option value="firearm">Firearm</option>
                </select>
            </div>
            
            <div class="verdict-section">
                <label class="verdict-label">Escape Route</label>
                <select class="verdict-select" id="verdict-escape">
                    <option value="">Select route...</option>
                    <option value="stairwell">Back stairwell via Studio B</option>
                    <option value="roof">Roof access to tower</option>
                    <option value="parking">Underground parking</option>
                    <option value="window">Broken window, Studio A</option>
                </select>
            </div>
            
            <div class="verdict-section">
                <label class="verdict-label">Reason for the Broadcast</label>
                <select class="verdict-select" id="verdict-reason">
                    <option value="">Select reason...</option>
                    <option value="silenced">To be silenced before naming him</option>
                    <option value="confession">A public confession</option>
                    <option value="decoy">A decoy to draw the killer</option>
                    <option value="unplanned">It wasn't planned</option>
                </select>
            </div>
            
            <div class="verdict-section">
                <label class="verdict-label">Final Report</label>
                <textarea class="verdict-textarea" id="verdict-report" placeholder="State your case..."></textarea>
            </div>
            
            <button class="verdict-submit" id="submit-verdict">
                Submit Your Verdict
            </button>
            
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: var(--space-md);">
                You may only submit once. Choose carefully — the wrong verdict lets the killer disappear for good.
            </div>
        `;
        
        this.container.appendChild(form);
        
        // Load saved selections
        this.loadSelections();
        
        // Submit handler
        form.querySelector('#submit-verdict').addEventListener('click', () => this.submit());
        
        // Auto-save selections
        ['killer', 'motive', 'method', 'escape', 'reason'].forEach(field => {
            form.querySelector(`#verdict-${field}`).addEventListener('change', () => this.saveSelections());
        });
        form.querySelector('#verdict-report').addEventListener('input', () => this.saveSelections());
        
        // Disable if already submitted
        if (this.submitted) {
            this.disableForm();
        }
    }

    saveSelections() {
        const data = {
            killer: this.container.querySelector('#verdict-killer').value,
            motive: this.container.querySelector('#verdict-motive').value,
            method: this.container.querySelector('#verdict-method').value,
            escape: this.container.querySelector('#verdict-escape').value,
            reason: this.container.querySelector('#verdict-reason').value,
            report: this.container.querySelector('#verdict-report').value
        };
        this.storage.save('verdictDraft', data);
    }

    loadSelections() {
        const data = this.storage.load('verdictDraft');
        if (!data) return;
        
        if (data.killer) this.container.querySelector('#verdict-killer').value = data.killer;
        if (data.motive) this.container.querySelector('#verdict-motive').value = data.motive;
        if (data.method) this.container.querySelector('#verdict-method').value = data.method;
        if (data.escape) this.container.querySelector('#verdict-escape').value = data.escape;
        if (data.reason) this.container.querySelector('#verdict-reason').value = data.reason;
        if (data.report) this.container.querySelector('#verdict-report').value = data.report;
    }

    submit() {
        if (this.submitted) return;
        
        const killer = this.container.querySelector('#verdict-killer').value;
        const motive = this.container.querySelector('#verdict-motive').value;
        const method = this.container.querySelector('#verdict-method').value;
        const escape = this.container.querySelector('#verdict-escape').value;
        const reason = this.container.querySelector('#verdict-reason').value;
        const report = this.container.querySelector('#verdict-report').value.trim();
        
        if (!killer || !motive || !method || !escape || !reason) {
            Modal.show('Incomplete', '<p style="color: var(--text-secondary);">All fields are required before submission.</p>');
            return;
        }
        
        // Check correct answer (Iris Vance + estate + blunt force + stairwell + silenced)
        const isCorrect = killer === 'vance' && motive === 'estate' && method === 'blunt' && escape === 'stairwell' && reason === 'silenced';
        
        this.submitted = true;
        this.storage.save('verdictSubmitted', true);
        this.saveSelections();
        this.disableForm();
        
        if (isCorrect) {
            Modal.show(
                'CASE CLOSED',
                `<div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: var(--space-md);">✓</div>
                    <p style="color: var(--success); font-size: 1.1rem; margin-bottom: var(--space-md);">Correct. The killer is identified.</p>
                    <p style="color: var(--text-secondary);">Iris Vance killed her sister Elena to prevent the truth about the 1997 fire from surfacing. The estate was the final piece — Elena had discovered their mother's death was no accident.</p>
                </div>`
            );
        } else {
            Modal.show(
                'VERDICT REJECTED',
                `<div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: var(--space-md);">✗</div>
                    <p style="color: var(--danger); font-size: 1.1rem; margin-bottom: var(--space-md);">Incorrect. Review the evidence.</p>
                    <p style="color: var(--text-secondary);">The killer remains at large. Cross-reference the timeline with the 1997 obituary. The answer is in the connections.</p>
                </div>`
            );
        }
    }

    disableForm() {
        this.container.querySelectorAll('select, textarea, button').forEach(el => {
            el.disabled = true;
        });
        this.container.querySelector('.verdict-submit').textContent = 'VERDICT SUBMITTED';
        this.container.querySelector('.verdict-submit').style.opacity = '0.5';
    }

    destroy() {}
}