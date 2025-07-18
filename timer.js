// timer.js
class Timer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.originalTime = 25 * 60;
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        
        this.initElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.timerMinutes = document.getElementById('timerMinutes');
        this.setTimerBtn = document.getElementById('setTimerBtn');
        this.timerAlert = document.getElementById('timerAlert');
        this.timerSection = document.querySelector('.timer-section');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.setTimerBtn.addEventListener('click', () => this.setTimer());
        
        // Enter key support for timer input
        this.timerMinutes.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.setTimer();
            }
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.timerSection.classList.add('timer-running');
            this.timerSection.classList.remove('timer-paused');
            
            this.startBtn.textContent = 'Running...';
            this.startBtn.disabled = true;
            
            this.intervalId = setInterval(() => {
                this.tick();
            }, 1000);
            
            // Add progress update
            if (window.progressManager) {
                window.progressManager.addUpdate('Timer started! 🎯');
            }
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.timerSection.classList.remove('timer-running');
            this.timerSection.classList.add('timer-paused');
            
            clearInterval(this.intervalId);
            this.startBtn.textContent = 'Resume';
            this.startBtn.disabled = false;
            
            // Add progress update
            if (window.progressManager) {
                window.progressManager.addUpdate('Timer paused ⏸️');
            }
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.timerSection.classList.remove('timer-running', 'timer-paused');
        
        clearInterval(this.intervalId);
        this.timeLeft = this.originalTime;
        this.updateDisplay();
        
        this.startBtn.textContent = 'Start';
        this.startBtn.disabled = false;
        
        // Add progress update
        if (window.progressManager) {
            window.progressManager.addUpdate('Timer reset 🔄');
        }
    }
    
    setTimer() {
        const minutes = parseInt(this.timerMinutes.value);
        if (minutes && minutes > 0 && minutes <= 120) {
            this.reset();
            this.timeLeft = minutes * 60;
            this.originalTime = minutes * 60;
            this.updateDisplay();
            
            // Add progress update
            if (window.progressManager) {
                window.progressManager.addUpdate(`Timer set to ${minutes} minutes ⏱️`);
            }
        } else {
            alert('Please enter a valid number between 1 and 120 minutes.');
        }
    }
    
    tick() {
        this.timeLeft--;
        this.updateDisplay();
        
        if (this.timeLeft <= 0) {
            this.onTimerComplete();
        }
    }
    
    onTimerComplete() {
        this.isRunning = false;
        this.timerSection.classList.remove('timer-running');
        
        clearInterval(this.intervalId);
        this.startBtn.textContent = 'Start';
        this.startBtn.disabled = false;
        
        // Play sound
        this.playAlert();
        
        // Show notification
        this.showNotification();
        
        // Add progress update
        if (window.progressManager) {
            window.progressManager.addUpdate('Timer completed! Great job! 🎉');
        }
        
        // Get AI suggestion for break
        if (window.aiAssistant) {
            window.aiAssistant.suggestBreak();
        }
    }
    
    playAlert() {
        // Try to play the embedded audio
        if (this.timerAlert) {
            this.timerAlert.play().catch(() => {
                // Fallback: create a simple beep using Web Audio API
                this.createBeep();
            });
        } else {
            this.createBeep();
        }
    }
    
    createBeep() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    showNotification() {
        // Browser notification
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Timer Complete!', {
                    body: 'Time to take a break! 🎉',
                    icon: '⏰'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Timer Complete!', {
                            body: 'Time to take a break! 🎉',
                            icon: '⏰'
                        });
                    }
                });
            }
        }
        
        // Fallback: alert
        setTimeout(() => {
            alert('Timer Complete! 🎉\nTime to take a break!');
        }, 100);
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update page title
        document.title = `${this.timeDisplay.textContent} - Productivity Assistant`;
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timer = new Timer();
});