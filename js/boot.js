/**
 * Boot Sequence - Simulates OS startup with cinematic typing effect
 */

export class BootSequence {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.screen = document.getElementById('boot-screen');
        this.progressBar = this.screen.querySelector('.boot-progress-bar');
        this.statusText = this.screen.querySelector('.boot-text');
        this.messages = [
            'BIOS Check... OK',
            'Loading kernel modules...',
            'Mounting encrypted volumes...',
            'Establishing secure connection...',
            'Decrypting case files...',
            'Loading evidence database...',
            'Initializing forensics toolkit...',
            'Verifying clearance level...',
            'Access granted. Welcome, Detective.'
        ];
        this.currentIndex = 0;
    }

    async start() {
        // Skip boot if reduced motion preferred
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.complete();
            return;
        }

        await this.typeMessages();
        await this.fillProgress();
        await this.wait(500);
        this.complete();
    }

    async typeMessages() {
        for (const message of this.messages) {
            await this.typeText(message);
            await this.wait(300 + Math.random() * 400);
        }
    }

    async typeText(text) {
        this.statusText.textContent = '';
        for (let i = 0; i < text.length; i++) {
            this.statusText.textContent += text[i];
            await this.wait(20 + Math.random() * 30);
        }
    }

    async fillProgress() {
        return new Promise(resolve => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    this.progressBar.style.width = '100%';
                    resolve();
                } else {
                    this.progressBar.style.width = `${progress}%`;
                }
            }, 100);
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    complete() {
        this.screen.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
            this.screen.classList.add('hidden');
            if (this.onComplete) this.onComplete();
        }, 500);
    }
}