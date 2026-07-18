/**
 * Timeline - Chronological reconstruction of events
 */

import { Modal } from './animations.js';

export class Timeline {
    constructor(container) {
        this.container = container;
        this.events = [
            {
                time: '22:00',
                title: 'Broadcast begins',
                desc: 'Elena Vance opens the show. Nothing unusual noted. Guest list confirmed. Studio B active.'
            },
            {
                time: '00:14',
                title: 'Unknown caller',
                desc: 'Untraceable call routed through Studio B. Elena\'s tone shifts noticeably. Caller hung up after 47 seconds.'
            },
            {
                time: '02:38',
                title: 'Silent break',
                desc: 'Unusual 90-second dead air. Engineer notes "she seemed pale." No audio recovered from this gap.'
            },
            {
                time: '03:31',
                title: 'Second call',
                desc: 'Same number. Elena instructs engineer to leave the booth. Audio captures whispered conversation.'
            },
            {
                time: '03:47',
                title: 'Last words',
                desc: '"If anyone hears this — go to Tower 7." Signal ends abruptly. Final transmission logged.'
            },
            {
                time: '03:52',
                title: 'Estimated TOD',
                desc: 'Body recovered by tower base. No witnesses. Temperature suggests 3-5 minutes post-mortem at discovery.'
            }
        ];
        
        this.render();
    }

    render() {
        const container = document.createElement('div');
        container.className = 'timeline-container';
        
        // Header
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `
            <div class="section-tag">Exhibit 04</div>
            <div class="section-title">Timeline of Events</div>
            <div class="section-desc">From opening theme to last words — six hours reconstructed. Click any node to expand.</div>
        `;
        container.appendChild(header);
        
        // Timeline line
        const line = document.createElement('div');
        line.className = 'timeline-line';
        container.appendChild(line);
        
        // Events
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'stagger-children';
        
        this.events.forEach((evt, i) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.tabIndex = 0;
            
            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-time">${this.escapeHtml(evt.time)}</div>
                <div class="timeline-title">${this.escapeHtml(evt.title)}</div>
                <div class="timeline-desc">${this.escapeHtml(evt.desc)}</div>
            `;
            
            item.addEventListener('click', () => this.expandEvent(evt, i));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.expandEvent(evt, i);
            });
            
            eventsContainer.appendChild(item);
        });
        
        container.appendChild(eventsContainer);
        this.container.appendChild(container);
    }

    expandEvent(evt, index) {
        const content = `
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-bottom: var(--space-md);">
                EVENT #${String(index + 1).padStart(2, '0')} · ${evt.time}
            </div>
            <div style="font-size: 1rem; color: var(--text-primary); line-height: 1.6; margin-bottom: var(--space-lg);">
                ${this.escapeHtml(evt.desc)}
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                <div><strong>Source:</strong> Studio logs, witness testimony</div>
                <div><strong>Confidence:</strong> High</div>
                <div><strong>Corroborated:</strong> Yes</div>
            </div>
        `;
        
        Modal.show(evt.title, content);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {}
}