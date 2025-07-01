// Reusable Components for Stealth Tools
class StealthComponents {
    
    // Reusable Terminal Module
    static createTerminalModule(title, content, type = 'default') {
        return `
            <div class="stealth-module ${type}">
                <div class="module-header">
                    <span class="module-indicator">●</span>
                    <span class="module-title">${title}</span>
                </div>
                <div class="module-content">${content}</div>
            </div>
        `;
    }

    // Reusable Form Field
    static createFormField(label, type, name, placeholder) {
        return `
            <div class="input-group">
                <label class="input-label">${label}</label>
                <input type="${type}" name="${name}" class="terminal-input" 
                       placeholder="${placeholder}" required>
                <div class="input-underline"></div>
            </div>
        `;
    }

    // Reusable Status Indicator
    static createStatusIndicator(status, message) {
        const colors = {
            success: 'var(--primary-green)',
            warning: 'var(--warning-yellow)',
            danger: 'var(--danger-red)'
        };
        
        return `
            <div class="status-indicator-component">
                <span class="indicator" style="color: ${colors[status]}">●</span>
                <span class="message">${message}</span>
            </div>
        `;
    }

    // Matrix Rain Effect (for future use)
    static initMatrixRain(containerId) {
        // Implementation for matrix-style background effect
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Matrix rain implementation...
    }

    // Glitch Text Effect
    static glitchText(element, originalText) {
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        let iteration = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) return originalText[index];
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            if (iteration >= originalText.length) clearInterval(interval);
            iteration += 1/3;
        }, 30);
    }
}

// Export for use in other modules
window.StealthComponents = StealthComponents;
