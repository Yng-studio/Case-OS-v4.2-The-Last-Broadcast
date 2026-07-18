/**
 * Suspect Profiles - Database of persons of interest with photos
 */

import { Modal } from './animations.js';

export class SuspectProfiles {
    constructor(container) {
        this.container = container;
        this.suspects = [
            {
                id: 'PoI-01',
                name: 'Miles Corbin',
                age: 42,
                role: 'Station Manager',
                relationship: 'Employer',
                alibi: 'Home, alone. No corroboration.',
                motive: 'Financial dispute over royalties. Victim threatened to expose embezzlement.',
                risk: 82,
                status: 'high-risk',
                image: 'assets/images/suspect-corbin.jpg'
            },
            {
                id: 'PoI-02',
                name: 'Dr. Alina Reyes',
                age: 38,
                role: 'Psychiatrist',
                relationship: 'Personal therapist',
                alibi: 'Late-night session with patient. Patient confirms.',
                motive: 'Sealed case file. Doctor–patient privilege invoked.',
                risk: 54,
                status: 'medium-risk',
                image: 'assets/images/suspect-reyes.jpg'
            },
            {
                id: 'PoI-03',
                name: 'Jonah Ward',
                age: 29,
                role: 'Sound Engineer',
                relationship: 'Colleague',
                alibi: 'In studio B until 03:20. Card swipe confirmed.',
                motive: 'Recently fired. Filed grievance 2 weeks prior. Threatened victim.',
                risk: 71,
                status: 'high-risk',
                image: 'assets/images/suspect-ward.jpg'
            },
            {
                id: 'PoI-04',
                name: 'Iris Vance',
                age: 51,
                role: 'Estranged Sister',
                relationship: 'Family',
                alibi: 'Overseas — flight records unverified. Passport stamp: questionable.',
                motive: 'Inheritance dispute. Contested will. Victim was sole beneficiary.',
                risk: 63,
                status: 'medium-risk',
                image: 'assets/images/suspect-vance.jpg'
            },
            {
                id: 'PoI-05',
                name: 'Detective Ansel Fry',
                age: 47,
                role: 'Homicide, Retired',
                relationship: 'Investigated Marta Vance case (1997)',
                alibi: 'Off-duty. Bar receipts confirmed. Witness: bartender.',
                motive: 'Old case reopened. Career at stake. Knew victim since childhood.',
                risk: 44,
                status: 'low-risk',
                image: 'assets/images/suspect-fry.jpg'
            },
            {
                id: 'PoI-06',
                name: 'Unknown Caller',
                age: '?',
                role: 'Anonymous',
                relationship: 'Called station at 03:31',
                alibi: 'Untraceable. Burner phone. Voice modulator detected.',
                motive: 'Unknown. Voice matches no database. Spoke in coded phrases.',
                risk: 91,
                status: 'critical',
                image: 'assets/images/suspect-unknown.jpg'
            }
        ];
        
        this.render();
    }

    render() {
        const grid = document.createElement('div');
        grid.className = 'suspect-grid stagger-children';
        
        this.suspects.forEach(suspect => {
            const card = document.createElement('div');
            card.className = 'suspect-card';
            card.tabIndex = 0;
            
            const riskColor = suspect.risk >= 80 ? '#c94a4a' : 
                             suspect.risk >= 60 ? '#e8a838' : '#4a9c6a';
            
            const circumference = 2 * Math.PI * 36;
            const offset = circumference - (suspect.risk / 100) * circumference;
            
            card.innerHTML = `
                <div class="suspect-photo" style="background-image: url('${suspect.image}');">
                    <div class="suspect-photo-overlay"></div>
                    <div class="suspect-id-badge">${suspect.id}</div>
                </div>
                <div class="suspect-header">
                    <div>
                        <div class="suspect-id">${suspect.id} ● REC</div>
                    </div>
                    <div class="suspect-risk" style="border-color: ${riskColor}; color: ${riskColor}; background: ${riskColor}20;">
                        ${suspect.risk}% RISK
                    </div>
                </div>
                <div class="suspect-body">
                    <div class="suspect-name">${this.escapeHtml(suspect.name)}</div>
                    <div class="suspect-role">${this.escapeHtml(suspect.role)}</div>
                    <div class="suspect-progress-ring">
                        <svg class="progress-ring-svg" width="80" height="80" viewBox="0 0 80 80">
                            <circle class="progress-ring-bg" cx="40" cy="40" r="36"/>
                            <circle class="progress-ring-fill" cx="40" cy="40" r="36" 
                                stroke="${riskColor}"
                                stroke-dasharray="${circumference}"
                                stroke-dashoffset="${offset}"/>
                        </svg>
                        <div class="progress-ring-text" style="color: ${riskColor};">${suspect.risk}%</div>
                    </div>
                    <div class="suspect-details">
                        <div class="suspect-detail">
                            <div class="suspect-detail-label">Relationship</div>
                            <div class="suspect-detail-value">${this.escapeHtml(suspect.relationship)}</div>
                        </div>
                        <div class="suspect-detail">
                            <div class="suspect-detail-label">Alibi</div>
                            <div class="suspect-detail-value">${this.escapeHtml(suspect.alibi)}</div>
                        </div>
                        <div class="suspect-detail">
                            <div class="suspect-detail-label">Motive</div>
                            <div class="suspect-detail-value">${this.escapeHtml(suspect.motive)}</div>
                        </div>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.openDetail(suspect));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.openDetail(suspect);
            });
            
            grid.appendChild(card);
        });
        
        this.container.appendChild(grid);
    }

    openDetail(suspect) {
        const riskColor = suspect.risk >= 80 ? '#c94a4a' : 
                         suspect.risk >= 60 ? '#e8a838' : '#4a9c6a';
        
        const circumference = 2 * Math.PI * 36;
        const offset = circumference - (suspect.risk / 100) * circumference;
        
        const content = `
            <div style="display: flex; gap: var(--space-lg); margin-bottom: var(--space-xl); flex-wrap: wrap;">
                <div style="width: 120px; height: 150px; border-radius: var(--space-sm); overflow: hidden; border: 1px solid var(--border-medium); flex-shrink: 0;">
                    <img src="${suspect.image}" alt="${this.escapeHtml(suspect.name)}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.3);">
                </div>
                <div>
                    <div class="section-tag">Suspect Profile</div>
                    <div class="section-title" style="font-size: 1.25rem;">${this.escapeHtml(suspect.name)}</div>
                    <div class="section-desc">${this.escapeHtml(suspect.role)} · Age ${suspect.age}</div>
                </div>
            </div>
            <div style="margin: var(--space-lg) 0;">
                <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-lg);">
                    <div class="suspect-progress-ring" style="width: 80px; height: 80px;">
                        <svg class="progress-ring-svg" width="80" height="80" viewBox="0 0 80 80">
                            <circle class="progress-ring-bg" cx="40" cy="40" r="36"/>
                            <circle class="progress-ring-fill" cx="40" cy="40" r="36" 
                                stroke="${riskColor}"
                                stroke-dasharray="${circumference}"
                                stroke-dashoffset="${offset}"/>
                        </svg>
                        <div class="progress-ring-text" style="color: ${riskColor};">${suspect.risk}%</div>
                    </div>
                    <div>
                        <div style="font-family: var(--font-mono); font-size: 2rem; color: ${riskColor}; font-weight: 700;">
                            ${suspect.risk}%
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                            Risk Assessment
                        </div>
                    </div>
                </div>
                <div style="display: grid; gap: var(--space-md); font-size: 0.9rem;">
                    <div><strong style="color: var(--text-primary);">Alibi:</strong> <span style="color: var(--text-secondary);">${this.escapeHtml(suspect.alibi)}</span></div>
                    <div><strong style="color: var(--text-primary);">Motive:</strong> <span style="color: var(--text-secondary);">${this.escapeHtml(suspect.motive)}</span></div>
                    <div><strong style="color: var(--text-primary);">Status:</strong> <span class="badge" style="background: ${riskColor}20; color: ${riskColor};">${suspect.status.replace('-', ' ').toUpperCase()}</span></div>
                </div>
            </div>
        `;
        
        Modal.show(suspect.id, content);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {}
}
