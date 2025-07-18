// progress.js
class ProgressManager {
    constructor() {
        this.progress = [];
        this.initElements();
        this.bindEvents();
        this.loadProgress();
    }
    
    initElements() {
        this.progressFeed = document.getElementById('progressFeed');
        this.progressInput = document.getElementById('progressInput');
        this.addProgressBtn = document.getElementById('addProgressBtn');
    }
    
    bindEvents() {
        this.addProgressBtn.addEventListener('click', () => this.addProgress());
        this.progressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addProgress();
            }
        });
    }
    
    addProgress() {
        const message = this.progressInput.value.trim();
        if (message) {
            this.addUpdate(message);
            this.progressInput.value = '';
        }
    }
    
    addUpdate(message) {
        const timestamp = new Date();
        const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const progressItem = {
            id: Date.now(),
            time: timeString,
            message: message,
            timestamp: timestamp
        };
        
        this.progress.unshift(progressItem);
        this.renderProgress();
        this.saveProgress();
        
        // Scroll to top of feed
        this.progressFeed.scrollTop = 0;
    }
    
    renderProgress() {
        this.progressFeed.innerHTML = '';
        
        this.progress.forEach(item => {
            const progressElement = document.createElement('div');
            progressElement.className = 'progress-item';
            progressElement.innerHTML = `
                <span class="time">${item.time}</span>
                <span class="message">${this.escapeHtml(item.message)}</span>
            `;
            this.progressFeed.appendChild(progressElement);
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveProgress() {
        // Note: LocalStorage is not available in Claude artifacts
        // This is a placeholder for when you deploy to your own server
        try {
            localStorage.setItem('productivity_progress', JSON.stringify(this.progress));
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('productivity_progress');
            if (saved) {
                this.progress = JSON.parse(saved);
                this.renderProgress();
            }
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    clearProgress() {
        this.progress = [];
        this.renderProgress();
        this.saveProgress();
    }
    
    getProductivityStats() {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const todayProgress = this.progress.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= todayStart;
        });
        
        return {
            totalUpdates: this.progress.length,
            todayUpdates: todayProgress.length,
            lastUpdate: this.progress.length > 0 ? this.progress[0].time : 'None'
        };
    }
}

// Initialize progress manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressManager = new ProgressManager();
});