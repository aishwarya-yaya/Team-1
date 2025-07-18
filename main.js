// main.js
class ProductivityApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindGlobalEvents();
        this.requestNotificationPermission();
        this.setupServiceWorker();
        this.loadAppSettings();
        this.setupKeyboardShortcuts();
        
        // Add welcome message to progress
        setTimeout(() => {
            if (window.progressManager) {
                window.progressManager.addUpdate('Productivity Assistant loaded! 🚀');
            }
        }, 1000);
    }
    
    bindGlobalEvents() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showErrorMessage('An error occurred. Please refresh the page if issues persist.');
        });
        
        // Visibility change handling (for timer pause/resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onAppMinimized();
            } else {
                this.onAppRestored();
            }
        });
        
        // Prevent accidental page reload during timer
        window.addEventListener('beforeunload', (e) => {
            if (window.timer && window.timer.isRunning) {
                e.preventDefault();
                e.returnValue = 'Your timer is still running. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    if (window.progressManager) {
                        window.progressManager.addUpdate('Notifications enabled! 🔔');
                    }
                }
            });
        }
    }
    
    setupServiceWorker() {
        // Service worker for offline functionality (optional)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registered');
            }).catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
        }
    }
    
    loadAppSettings() {
        try {
            const settings = localStorage.getItem('app_settings');
            if (settings) {
                this.settings = JSON.parse(settings);
            } else {
                this.settings = this.getDefaultSettings();
                this.saveAppSettings();
            }
        } catch (error) {
            this.settings = this.getDefaultSettings();
        }
        
        this.applySettings();
    }
    
    getDefaultSettings() {
        return {
            theme: 'default',
            soundEnabled: true,
            autoBreakReminder: true,
            defaultTimerMinutes: 25,
            version: '1.0.0'
        };
    }
    
    saveAppSettings() {
        try {
            localStorage.setItem('app_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    applySettings() {
        // Apply theme
        if (this.settings.theme && this.settings.theme !== 'default') {
            document.body.className = `theme-${this.settings.theme}`;
        }
        
        // Apply default timer setting
        if (window.timer && this.settings.defaultTimerMinutes) {
            document.getElementById('timerMinutes').value = this.settings.defaultTimerMinutes;
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key) {
                case ' ': // Spacebar - Start/Pause timer
                    e.preventDefault();
                    if (window.timer) {
                        if (window.timer.isRunning) {
                            window.timer.pause();
                        } else {
                            window.timer.start();
                        }
                    }
                    break;
                    
                case 'r': // R - Reset timer
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        if (window.timer) {
                            window.timer.reset();
                        }
                    }
                    break;
                    
                case 'f': // F - Focus on progress input
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('progressInput').focus();
                    }
                    break;
                    
                case 'a': // A - Focus on AI input
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('aiInput').focus();
                    }
                    break;
            }
        });
    }
    
    onAppMinimized() {
        // App minimized - could pause timer or show notification
        if (window.timer && window.timer.isRunning) {
            console.log('App minimized while timer running');
        }
    }
    
    onAppRestored() {
        // App restored - could resume timer or update display
        if (window.timer) {
            window.timer.updateDisplay();
        }
    }
    
    showErrorMessage(message) {
        // Simple error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    showSuccessMessage(message) {
        // Simple success display
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }
    
    // Data export/import functionality
    exportData() {
        const data = {
            progress: window.progressManager ? window.progressManager.progress : [],
            learningProgress: window.resourceManager ? window.resourceManager.getLearningProgress() : {},
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `productivity-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showSuccessMessage('Data exported successfully!');
    }
    
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Import progress
                if (data.progress && window.progressManager) {
                    window.progressManager.progress = data.progress;
                    window.progressManager.renderProgress();
                    window.progressManager.saveProgress();
                }
                
                // Import learning progress
                if (data.learningProgress) {
                    localStorage.setItem('learning_progress', JSON.stringify(data.learningProgress));
                }
                
                // Import settings
                if (data.settings) {
                    this.settings = { ...this.settings, ...data.settings };
                    this.saveAppSettings();
                    this.applySettings();
                }
                
                this.showSuccessMessage('Data imported successfully!');
                
            } catch (error) {
                this.showErrorMessage('Invalid file format. Please select a valid backup file.');
            }
        };
        
        reader.readAsText(file);
    }
    
    // Analytics and insights
    generateProductivityReport() {
        const stats = {
            totalProgressUpdates: window.progressManager ? window.progressManager.progress.length : 0,
            learningResourcesAccessed: 0,
            totalTimerSessions: 0,
            aiInteractions: window.aiAssistant ? window.aiAssistant.conversationHistory.length : 0
        };
        
        // Calculate learning resources accessed
        if (window.resourceManager) {
            const learningProgress = window.resourceManager.getLearningProgress();
            stats.learningResourcesAccessed = Object.keys(learningProgress).length;
        }
        
        return stats;
    }
    
    // Debug information
    getDebugInfo() {
        return {
            version: this.settings.version,
            modules: {
                timer: !!window.timer,
                progressManager: !!window.progressManager,
                resourceManager: !!window.resourceManager,
                aiAssistant: !!window.aiAssistant
            },
            storage: {
                available: this.isStorageAvailable(),
                used: this.getStorageUsage()
            },
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                online: navigator.onLine
            }
        };
    }
    
    isStorageAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (error) {
            return false;
        }
    }
    
    getStorageUsage() {
        if (!this.isStorageAvailable()) return 0;
        
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productivityApp = new ProductivityApp();
    
    // Add some helpful keyboard shortcuts info
    console.log('Keyboard shortcuts:');
    console.log('Space: Start/Pause timer');
    console.log('Ctrl+R: Reset timer');
    console.log('Ctrl+F: Focus progress input');
    console.log('Ctrl+A: Focus AI input');
});