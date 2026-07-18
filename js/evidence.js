/**
 * Evidence Board - Interactive grid of case evidence items with photos
 */

import { Modal } from './animations.js';

export class EvidenceBoard {
    constructor(container) {
        this.container = container;
        this.evidence = [
            {
                id: 'e1',
                tag: 'REC · 03:47:22',
                title: 'Radio Tower — 03:47',
                desc: 'Final broadcast signal traced to Tower 7. Signal strength indicates victim was within 50 meters of base.',
                meta: 'Audio · 00:46',
                type: 'audio',
                image: 'assets/images/evidence-tower.jpg'
            },
            {
                id: 'e2',
                tag: 'PHOTO · SCENE 01',
                title: 'Sticky Note',
                desc: '"she knew. she knew before anyone. — M." Found pinned to studio monitor. Handwriting matches no known sample.',
                meta: 'Document · 1 page',
                type: 'document',
                image: 'assets/images/evidence-note.jpg'
            },
            {
                id: 'e3',
                tag: 'POLICE REPORT #221-B',
                title: 'Incident Report',
                desc: 'Victim: E. Vance. Recovered near tower base. Time of death est. 03:52. Blunt force trauma. No signs of struggle.',
                meta: 'Report · 4 pages',
                type: 'report',
                image: 'assets/images/evidence-report.jpg'
            },
            {
                id: 'e4',
                tag: 'THE CITY HERALD',
                title: 'Front Page',
                desc: 'Nightly host vanishes mid-broadcast. Police silent as investigation deepens. — Front Page, Morning Edition',
                meta: 'Newspaper · 1 page',
                type: 'document',
                image: 'assets/images/evidence-newspaper.jpg'
            },
            {
                id: 'e5',
                tag: 'REC · 03:47:22',
                title: 'Fingerprint — Console',
                desc: 'Partial print recovered from broadcast console. Analysis pending. Latent, non-blood.',
                meta: 'Forensics · Tag 04',
                type: 'forensics',
                image: 'assets/images/evidence-fingerprint.jpg'
            },
            {
                id: 'e6',
                tag: 'FORENSICS · TAG 04',
                title: 'Handwritten Note',
                desc: '"check the tape. tower 7. she left something." Written on back of parking receipt. Timestamp: 02:14.',
                meta: 'Document · 1 page',
                type: 'document',
                image: 'assets/images/evidence-handwritten.jpg'
            },
            {
                id: 'e7',
                tag: 'AUDIO ANALYSIS',
                title: 'Environmental Audio',
                desc: 'Background: light rain. Freight train ~3.2km east. Timestamps consistent with weather log and rail schedule.',
                meta: 'Analysis · 2 pages',
                type: 'analysis',
                image: 'assets/images/evidence-audio.jpg'
            },
            {
                id: 'e8',
                tag: 'REC · 03:47:22',
                title: 'Blood — Studio B',
                desc: 'Type O-negative. Consistent with victim. Trace pattern suggests drag, not spatter. Direction: toward exit.',
                meta: 'Forensics · Tag 07',
                type: 'forensics',
                image: 'assets/images/evidence-blood.jpg'
            },
            {
                id: 'e9',
                tag: 'OBITUARY — 1997',
                title: 'Marta Vance',
                desc: 'Elena Vance\'s mother, Marta Vance, died in a fire at the same tower. Case closed as accident. Reopened 2024.',
                meta: 'Archive · 1 page',
                type: 'archive',
                image: 'assets/images/evidence-obituary.jpg'
            },
            {
                id: 'e10',
                tag: 'NOTE · ANONYMOUS',
                title: 'Final Message',
                desc: '"she came back for the truth." Delivered to station mailbox. No return address. DNA trace: inconclusive.',
                meta: 'Document · 1 page',
                type: 'document',
                image: 'assets/images/evidence-message.jpg'
            }
        ];
        
        this.render();
    }

    render() {
        const board = document.createElement('div');
        board.className = 'evidence-board stagger-children';
        
        this.evidence.forEach(item => {
            const card = document.createElement('div');
            card.className = 'evidence-item';
            card.tabIndex = 0;
            card.dataset.id = item.id;
            
            card.innerHTML = `
                <div class="evidence-image" style="background-image: url('${item.image}');">
                    <div class="evidence-image-overlay"></div>
                </div>
                <div class="evidence-content">
                    <div class="evidence-tag">
                        <span class="evidence-rec-dot"></span>
                        ${this.escapeHtml(item.tag)}
                    </div>
                    <div class="evidence-title">${this.escapeHtml(item.title)}</div>
                    <div class="evidence-desc">${this.escapeHtml(item.desc)}</div>
                    <div class="evidence-meta">${this.escapeHtml(item.meta)}</div>
                </div>
            `;
            
            card.addEventListener('click', () => this.openDetail(item));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.openDetail(item);
            });
            
            board.appendChild(card);
        });
        
        this.container.appendChild(board);
    }

    openDetail(item) {
        const content = `
            <div style="display: flex; gap: var(--space-lg); margin-bottom: var(--space-xl); flex-wrap: wrap;">
                <div style="width: 200px; height: 140px; border-radius: var(--space-sm); overflow: hidden; border: 1px solid var(--border-medium); flex-shrink: 0;">
                    <img src="${item.image}" alt="${this.escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <div class="section-tag">Evidence Detail</div>
                    <div class="section-title" style="font-size: 1.1rem;">${this.escapeHtml(item.title)}</div>
                    <div class="section-desc">${this.escapeHtml(item.desc)}</div>
                </div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-lg);">
                <div style="margin-bottom: var(--space-sm);"><strong>ID:</strong> ${item.id.toUpperCase()}</div>
                <div style="margin-bottom: var(--space-sm);"><strong>Type:</strong> ${item.type}</div>
                <div style="margin-bottom: var(--space-sm);"><strong>Status:</strong> <span class="badge badge-amber">Under Review</span></div>
                <div><strong>Chain of Custody:</strong> Intact</div>
            </div>
        `;
        
        Modal.show(item.title, content);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        // Cleanup if needed
    }
}