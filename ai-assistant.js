// ai-assistant.js
class AIAssistant {
    constructor() {
        this.apiKey = '';
        this.conversationHistory = [];
        this.hardcodedResponses = {
            'tips': [
                "Take a 5-minute break every 25 minutes (Pomodoro Technique) 🍅",
                "Keep a clean workspace to maintain focus 🧹",
                "Use the 2-minute rule: if it takes less than 2 minutes, do it now ⏰",
                "Prioritize your most important tasks in the morning 🌅",
                "Turn off notifications during focused work sessions 🔕"
            ],
            'break': [
                "Time for a break! Try some quick stretches 🧘‍♂️",
                "Step away from your screen and look at something far away 👀",
                "Take a short walk or do some light exercise 🚶‍♂️",
                "Drink some water and have a healthy snack 💧",
                "Do some deep breathing exercises to refresh your mind 🌬️"
            ],
            'motivation': [
                "You're doing great! Keep up the excellent work! 💪",
                "Every small step counts towards your bigger goals 🎯",
                "Progress is progress, no matter how small 📈",
                "You've got this! Stay focused and keep pushing forward 🚀",
                "Remember why you started - you're closer than you think! ✨"
            ],
            'resources': [
                "Check out the JavaScript resources - they're perfect for building strong foundations! 🏗️",
                "React is a great next step if you're comfortable with JavaScript basics ⚛️",
                "Consider practicing with small projects to reinforce your learning 🛠️",
                "Join developer communities online for support and networking 👥",
                "Don't forget to build a portfolio as you learn! 📁"
            ]
        };
        
        this.init();
    }
    
    init() {
        this.initElements();
        this.bindEvents();
        this.loadApiKey();
        this.loadConversationHistory();
        this.showWelcomeMessage();
    }
    
    initElements() {
        this.aiChat = document.getElementById('aiChat');
        this.aiInput = document.getElementById('aiInput');
        this.aiSendBtn = document.getElementById('aiSendBtn');
        this.apiKeyInput = document.getElementById('apiKey');
        this.saveApiBtn = document.getElementById('saveApiBtn');
    }
    
    bindEvents() {
        this.aiSendBtn.addEventListener('click', () => this.sendMessage());
        this.aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.saveApiBtn.addEventListener('click', () => this.saveApiKey());
        this.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveApiKey();
            }
        });
    }
    
    showWelcomeMessage() {
        const welcomeMessage = "Hello! I'm your productivity assistant. I can help you with tips, break suggestions, motivation, and resource recommendations. Try asking me for 'tips' or 'break ideas'!";
        this.addMessage(welcomeMessage, 'assistant');
    }
    
    async sendMessage() {
        const message = this.aiInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.aiInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            let response;
            
            if (this.apiKey) {
                // Use actual GPT API
                response = await this.getGPTResponse(message);
            } else {
                // Use hardcoded responses
                response = this.getHardcodedResponse(message);
            }
            
            this.removeTypingIndicator();
            this.addMessage(response, 'assistant');
            
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
            console.error('AI Assistant Error:', error);
        }
    }
    
    getHardcodedResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords and return appropriate responses
        if (lowerMessage.includes('tip') || lowerMessage.includes('advice')) {
            return this.getRandomResponse('tips');
        } else if (lowerMessage.includes('break') || lowerMessage.includes('rest')) {
            return this.getRandomResponse('break');
        } else if (lowerMessage.includes('motivat') || lowerMessage.includes('encourage')) {
            return this.getRandomResponse('motivation');
        } else if (lowerMessage.includes('learn') || lowerMessage.includes('resource') || lowerMessage.includes('study')) {
            return this.getRandomResponse('resources');
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! How can I help you be more productive today? 😊";
        } else if (lowerMessage.includes('time') || lowerMessage.includes('schedule')) {
            return "Time management is key! Try time-blocking your tasks and using the Pomodoro Technique. What specific time management challenge are you facing? ⏰";
        } else if (lowerMessage.includes('focus') || lowerMessage.includes('concentration')) {
            return "To improve focus, try eliminating distractions, using website blockers, and working in focused 25-minute sessions. What's making it hard to concentrate? 🎯";
        } else if (lowerMessage.includes('responsive') || lowerMessage.includes('mobile view')) {
    return "Making your site responsive? Try using CSS Flexbox or Grid with media queries. Want help with a specific layout? 📱";
} else if (lowerMessage.includes('github') || lowerMessage.includes('version control')) {
    return "Using GitHub is a great way to track changes and collaborate. Need help with commits, branches, or pull requests? 🛠";
} else if (lowerMessage.includes('hosting') || lowerMessage.includes('deploy')) {
    return "You can host your site on Netlify, Vercel, or GitHub Pages! Need help setting up a deployment? 🌐";
} else if (lowerMessage.includes('database') || lowerMessage.includes('sql')) {
    return "Databases store your data—SQL is great for relational data, MongoDB for flexible schemas. What are you trying to build? 🗃";
} else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return "Take a deep breath. Anxiety often comes from trying to control the future. Focus on what you can do right now, one step at a time 🌸";
} else if (lowerMessage.includes('low') || lowerMessage.includes('not okay')) {
    return "It’s okay to not feel okay. You’re not alone, and you’re not a burden. Want to talk about what’s on your mind? 💬";
} else if (lowerMessage.includes('confidence') || lowerMessage.includes('self doubt')) {
    return "Imposter syndrome hits even the best. You’re learning, growing, and doing more than you give yourself credit for. Keep going 💪";
} else if (lowerMessage.includes('stuck') || lowerMessage.includes('can’t think')) {
    return "Feeling stuck is part of the creative process. Step away for a bit—clarity often comes after a short break or change of scene 🌀";
} else if (lowerMessage.includes('portfolio') || lowerMessage.includes('resume site')) {
    return "Great idea! A portfolio helps show your skills. Want tips on design, layout, or what projects to include? 🎨";
} else if (lowerMessage.includes('css animation') || lowerMessage.includes('transitions')) {
    return "CSS animations can really make your UI pop! Need help with keyframes, transitions, or effects? ✨";
}
else if (lowerMessage.includes('exhausted') || lowerMessage.includes('drained')) {
    return "You've been giving a lot, and it's okay to feel drained. Rest isn’t a luxury—it’s part of being productive. Step away, recharge, come back stronger 🌿";
} else if (lowerMessage.includes('burnout') || lowerMessage.includes('burned out')) {
    return "Burnout means you've been pushing too hard for too long. Your health matters—take a break, breathe, even a walk outside can help 🌤";
} else if (lowerMessage.includes('fatigue') || lowerMessage.includes('mentally tired')) {
    return "Mental fatigue is real, especially when you’ve been deep in code. Try a power nap, hydrate, or do something fun for 15 minutes 🧠✨";
} else if (lowerMessage.includes('demotivated') || lowerMessage.includes('no energy')) {
    return "Even the most passionate devs feel unmotivated sometimes. It's okay. Progress isn't always fast—but you're still moving forward 💫";
} else if (lowerMessage.includes('can’t code') || lowerMessage.includes('mind blank')) {
    return "Some days the code just doesn't flow—and that’s normal. Don’t force it. You’re still a good developer, even on low-energy days ⚙🖤";
} else if (lowerMessage.includes('too much work') || lowerMessage.includes('overworked')) {
    return "You’re carrying a lot, and that’s no small thing. Prioritize, delegate if you can, and don’t be afraid to say 'no' sometimes. Your health comes first 🛑💡";
} else if (lowerMessage.includes('nothing working') || lowerMessage.includes('frustrated')) {
    return "Ugh, those days when every bug feels personal. Step back, take a breath—it’ll click soon. You’ve solved tough problems before, and you will again 🔍💪";
}
else if (lowerMessage.includes('late nights') || lowerMessage.includes('no sleep')) {
    return "Late night coding sprints are heroic—but not sustainable. Sleep is your brain’s debugger. Prioritize rest, and tomorrow you'll code better 😴🧘";
} else if (lowerMessage.includes('why am i doing this') || lowerMessage.includes('pointless')) {
    return "It's easy to forget your 'why' when you're tired. But remember—your work matters, and so do you. You’re building something amazing, even if it’s hard 💖";
} else if (lowerMessage.includes('need a break') || lowerMessage.includes('step away')) {
    return "Then take one, guilt-free. Breaks make better builders. Your code—and your mind—will thank you for it 🍃🔧";
}
    else if (lowerMessage.includes('progress') || lowerMessage.includes('track')) {
            return "Tracking progress is motivating! Use the progress feed to log your achievements. Small wins add up to big successes! 📊";
      } else {
            // Default responses for general queries
            const defaultResponses = [
                "That's interesting! Can you tell me more about what you're working on? 🤔",
                "I'm here to help with productivity tips, break suggestions, and learning resources. What would you like to know more about? 💡",
                "Let me help you with that! Try asking me for specific tips, break ideas, or motivation. What's your current challenge? 🚀",
                "I'd love to help! You can ask me about productivity tips, learning resources, or time management strategies. What interests you most? ✨"
            ];
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
    }
    
    getRandomResponse(category) {
        const responses = this.hardcodedResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    async getGPTResponse(message) {
        const apiUrl = 'https://api.openai.com/v1/chat/completions';
        
        const systemPrompt = `You are a helpful productivity assistant. You help users with:
        - Time management and productivity tips
        - Break suggestions and wellness advice
        - Learning resource recommendations
        - Motivation and encouragement
        - Programming and development guidance
        
        Keep responses concise, helpful, and encouraging. Use emojis occasionally to make responses friendly.`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
                    { role: 'user', content: message }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'user-message' : 'ai-message';
        
        if (sender === 'user') {
            messageElement.innerHTML = `<strong>You:</strong> ${this.escapeHtml(message)}`;
        } else {
            messageElement.innerHTML = `<strong>Assistant:</strong> ${this.escapeHtml(message)}`;
        }
        
        this.aiChat.appendChild(messageElement);
        this.aiChat.scrollTop = this.aiChat.scrollHeight;
        
        // Save to conversation history
        this.conversationHistory.push({
            role: sender === 'user' ? 'user' : 'assistant',
            content: message
        });
        
        this.saveConversationHistory();
    }
    
    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'ai-message typing-indicator';
        indicator.innerHTML = '<strong>Assistant:</strong> <em>Typing...</em>';
        indicator.id = 'typing-indicator';
        
        this.aiChat.appendChild(indicator);
        this.aiChat.scrollTop = this.aiChat.scrollHeight;
    }
    
    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveApiKey() {
        this.apiKey = this.apiKeyInput.value.trim();
        if (this.apiKey) {
            try {
                localStorage.setItem('openai_api_key', this.apiKey);
                this.addMessage('API key saved! I can now provide more personalized responses using GPT.', 'assistant');
            } catch (error) {
                console.log('Storage not available');
            }
        }
        this.apiKeyInput.value = '';
    }
    
    loadApiKey() {
        try {
            const savedKey = localStorage.getItem('openai_api_key');
            if (savedKey) {
                this.apiKey = savedKey;
            }
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    saveConversationHistory() {
        try {
            localStorage.setItem('ai_conversation_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('ai_conversation_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    // Special methods for integration with other modules
    suggestBreak() {
        const breakSuggestion = this.getRandomResponse('break');
        this.addMessage(`Great job completing your timer! ${breakSuggestion}`, 'assistant');
    }
    
    handleResourceStart(resource) {
        const responses = [
            `Excellent choice starting with ${resource.title}! Take your time and practice as you go. 📚`,
            `${resource.title} is a great resource! Don't hesitate to come back and ask questions. 💡`,
            `Nice! ${resource.title} will help build your skills. Remember to apply what you learn! 🛠️`
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(response, 'assistant');
    }
    
    clearConversation() {
        this.conversationHistory = [];
        this.aiChat.innerHTML = '';
        this.showWelcomeMessage();
        this.saveConversationHistory();
    }
}

// Initialize AI assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
});