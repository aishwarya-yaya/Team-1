// resources.js
class ResourceManager {
    constructor() {
        this.resources = [
             {
        id: 1,
        title: 'HTML',
        description: 'Learn the structure and semantics of web content using HTML',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        category: 'Web Development',
        difficulty: 'Beginner',
        topics: ['Elements', 'Tags', 'Attributes', 'Forms', 'Semantic HTML']
    },
    {
        id: 2,
        title: 'JavaScript',
        description: 'Master the fundamentals of JavaScript programming',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        category: 'Programming',
        difficulty: 'Beginner to Advanced',
        topics: ['Variables', 'Functions', 'Objects', 'Async/Await', 'DOM Manipulation']
    },
    {
        id: 3,
        title: 'MongoDB',
        description: 'Understand NoSQL databases and data modeling with MongoDB',
        url: 'https://www.mongodb.com/docs/',
        category: 'Database',
        difficulty: 'Intermediate',
        topics: ['Documents', 'Collections', 'CRUD Operations', 'Aggregation', 'Indexes']
    },
    {
        id: 4,
        title: 'Node.js',
        description: 'Explore server-side JavaScript with Node.js APIs',
        url: 'https://nodejs.org/docs/latest/api/',
        category: 'Backend',
        difficulty: 'Intermediate to Advanced',
        topics: ['Modules', 'File System', 'Events', 'Streams', 'HTTP']
    },
    {
        id: 5,
        title: 'SCC Online',
        description: 'Access legal research and case law through SCC Online',
        url: 'https://www.scconline.com/web-edition',
        category: 'Legal Research',
        difficulty: 'Advanced',
        topics: ['Case Law', 'Judgments', 'Statutes', 'Legal Journals', 'Search Tools']
    },
    {
        id: 6,
        title: 'C# / .NET',
        description: 'Develop robust applications with C# and the .NET framework',
        url: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
        category: 'Programming',
        difficulty: 'Intermediate to Advanced',
        topics: ['Syntax', 'OOP Concepts', 'LINQ', 'Async Programming', '.NET Core']
    }

        ];
        
        this.init();
    }
    
    init() {
        this.renderResources();
        this.bindEvents();
    }
    
    renderResources() {
        const resourceContainer = document.querySelector('.resource-cards');
        if (!resourceContainer) return;
        
        resourceContainer.innerHTML = '';
        
        this.resources.forEach(resource => {
            const resourceCard = this.createResourceCard(resource);
            resourceContainer.appendChild(resourceCard);
        });
    }
    
    createResourceCard(resource) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <div class="resource-details">
                <small><strong>Category:</strong> ${resource.category}</small><br>
                <small><strong>Difficulty:</strong> ${resource.difficulty}</small><br>
                <small><strong>Est. Time:</strong> ${resource.estimatedTime}</small>
            </div>
            <div class="resource-topics">
                <small><strong>Topics:</strong> ${resource.topics.join(', ')}</small>
            </div>
            <div class="resource-actions">
                <a href="${resource.url}" target="_blank" class="btn small">Learn More</a>
                <button class="btn small secondary" onclick="resourceManager.trackResourceClick(${resource.id})">
                    Mark as Started
                </button>
            </div>
        `;
        
        return card;
    }
    
    bindEvents() {
        // Add event listeners for resource interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.resource-card a')) {
                const resourceId = this.getResourceIdFromElement(e.target);
                if (resourceId) {
                    this.trackResourceClick(resourceId);
                }
            }
        });
    }
    
    getResourceIdFromElement(element) {
        const card = element.closest('.resource-card');
        if (card) {
            const title = card.querySelector('h3').textContent;
            const resource = this.resources.find(r => r.title === title);
            return resource ? resource.id : null;
        }
        return null;
    }
    
    trackResourceClick(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource) {
            // Add progress update
            if (window.progressManager) {
                window.progressManager.addUpdate(`Started learning ${resource.title} 📚`);
            }
            
            // Store learning progress
            this.updateLearningProgress(resourceId);
            
            // Notify AI assistant
            if (window.aiAssistant) {
                window.aiAssistant.handleResourceStart(resource);
            }
        }
    }
    
    updateLearningProgress(resourceId) {
        try {
            let learningProgress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
            
            if (!learningProgress[resourceId]) {
                learningProgress[resourceId] = {
                    startedAt: new Date().toISOString(),
                    timesAccessed: 1,
                    completed: false
                };
            } else {
                learningProgress[resourceId].timesAccessed++;
                learningProgress[resourceId].lastAccessed = new Date().toISOString();
            }
            
            localStorage.setItem('learning_progress', JSON.stringify(learningProgress));
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    getLearningProgress() {
        try {
            return JSON.parse(localStorage.getItem('learning_progress') || '{}');
        } catch (error) {
            return {};
        }
    }
    
    getRecommendations() {
        const progress = this.getLearningProgress();
        const recommendations = [];
        
        // Recommend resources not yet started
        this.resources.forEach(resource => {
            if (!progress[resource.id]) {
                recommendations.push({
                    type: 'new',
                    resource: resource,
                    reason: 'You haven\'t started this yet!'
                });
            }
        });
        
        // Recommend continuing started resources
        Object.keys(progress).forEach(resourceId => {
            const resourceProgress = progress[resourceId];
            if (!resourceProgress.completed) {
                const resource = this.resources.find(r => r.id === parseInt(resourceId));
                if (resource) {
                    recommendations.push({
                        type: 'continue',
                        resource: resource,
                        reason: `You've accessed this ${resourceProgress.timesAccessed} times`
                    });
                }
            }
        });
        
        return recommendations;
    }
    
    markResourceCompleted(resourceId) {
        try {
            let learningProgress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
            
            if (learningProgress[resourceId]) {
                learningProgress[resourceId].completed = true;
                learningProgress[resourceId].completedAt = new Date().toISOString();
                
                localStorage.setItem('learning_progress', JSON.stringify(learningProgress));
                
                const resource = this.resources.find(r => r.id === resourceId);
                if (resource && window.progressManager) {
                    window.progressManager.addUpdate(`Completed ${resource.title}! 🎉`);
                }
            }
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    addCustomResource(resource) {
        const newResource = {
            id: Math.max(...this.resources.map(r => r.id)) + 1,
            title: resource.title,
            description: resource.description,
            url: resource.url,
            category: resource.category || 'Custom',
            difficulty: resource.difficulty || 'Unknown',
            estimatedTime: resource.estimatedTime || 'Variable',
            topics: resource.topics || []
        };
        
        this.resources.push(newResource);
        this.renderResources();
        this.saveCustomResources();
        
        if (window.progressManager) {
            window.progressManager.addUpdate(`Added new resource: ${resource.title} ➕`);
        }
        
        return newResource;
    }
    
    saveCustomResources() {
        try {
            const customResources = this.resources.filter(r => r.id > 2); // Original resources have IDs 1 and 2
            localStorage.setItem('custom_resources', JSON.stringify(customResources));
        } catch (error) {
            console.log('Storage not available');
        }
    }
    
    loadCustomResources() {
        try {
            const customResources = JSON.parse(localStorage.getItem('custom_resources') || '[]');
            this.resources.push(...customResources);
        } catch (error) {
            console.log('Storage not available');
        }
    }
}

// Initialize resource manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resourceManager = new ResourceManager();
});