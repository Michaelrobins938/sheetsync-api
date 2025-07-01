// Ghost Terminal - Main Application
class GhostTerminal {
    constructor() {
        this.API_URL = 'https://sheetsync-api.vercel.app/api/index';
        this.operationsCount = 0;
        this.startTime = Date.now();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startUptime();
        this.loadOperations();
        this.typeWriter();
    }

    bindEvents() {
        const form = document.getElementById('stealthForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name').trim(),
            age: formData.get('age')
        };

        if (!this.validateData(data)) return;

        this.setLoading(true);
        this.showStatus('Initiating transmission...', 'warning');

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.handleSuccess(data);
            } else {
                throw new Error(result.error || 'Transmission failed');
            }
        } catch (error) {
            this.handleError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    validateData(data) {
        if (!data.name || !data.age) {
            this.showStatus('ERROR: Missing required data fields', 'danger');
            return false;
        }
        return true;
    }

    handleSuccess(data) {
        this.operationsCount++;
        this.updateStats();
        
        this.showStatus(`TRANSMISSION COMPLETE: ${data.name} (${data.age}) → Google Sheets`, 'success');
        this.addOperation(data);
        
        document.getElementById('stealthForm').reset();
        
        setTimeout(() => this.hideStatus(), 5000);
    }

    handleError(message) {
        this.showStatus(`TRANSMISSION FAILED: ${message}`, 'danger');
        setTimeout(() => this.hideStatus(), 5000);
    }

    setLoading(isLoading) {
        const btn = document.getElementById('transmitBtn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');
        
        btn.disabled = isLoading;
        
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
        }
    }

    showStatus(message, type) {
        const statusModule = document.getElementById('statusModule');
        const statusContent = document.getElementById('statusContent');
        
        statusContent.textContent = message;
        statusModule.className = `status-module ${type} show`;
    }

    hideStatus() {
        const statusModule = document.getElementById('statusModule');
        statusModule.classList.remove('show');
    }

    addOperation(data) {
        const operations = this.getOperations();
        const operation = {
            ...data,
            timestamp: new Date().toLocaleString(),
            id: Date.now()
        };
        
        operations.unshift(operation);
        if (operations.length > 5) operations.splice(5);
        
        localStorage.setItem('ghostOperations', JSON.stringify(operations));
        this.displayOperations();
    }

    loadOperations() {
        this.displayOperations();
    }

    getOperations() {
        return JSON.parse(localStorage.getItem('ghostOperations') || '[]');
    }

    displayOperations() {
        const operations = this.getOperations();
        const operationsModule = document.getElementById('operationsModule');
        const operationsList = document.getElementById('operationsList');
        
        if (operations.length === 0) {
            operationsModule.style.display = 'none';
            return;
        }

        operationsModule.classList.add('show');
        operationsList.innerHTML = operations
            .map(op => `
                <div class="operation-item">
                    <div class="operation-data">${op.name} → ${op.age}</div>
                    <div class="operation-time">${op.timestamp}</div>
                </div>
            `).join('');
    }

    startUptime() {
        setInterval(() => {
            const uptime = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(uptime / 60).toString().padStart(2, '0');
            const seconds = (uptime % 60).toString().padStart(2, '0');
            
            document.getElementById('uptime').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    updateStats() {
        document.getElementById('operations').textContent = this.operationsCount;
    }

    typeWriter() {
        // Add typing effect to boot sequence
        const bootLines = document.querySelectorAll('.boot-line');
        bootLines.forEach((line, index) => {
            line.style.opacity = '0';
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.animation = 'fadeInLeft 0.5s ease-out';
            }, index * 200);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GhostTerminal();
});
