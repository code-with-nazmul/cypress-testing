// Main JavaScript for DemoQA Mockup

// Utility Functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        min-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    switch(type) {
        case 'success':
            alertDiv.style.background = '#28a745';
            break;
        case 'error':
            alertDiv.style.background = '#dc3545';
            break;
        case 'warning':
            alertDiv.style.background = '#ffc107';
            alertDiv.style.color = '#212529';
            break;
        default:
            alertDiv.style.background = '#17a2b8';
    }
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function showModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    const modalHeader = document.createElement('h3');
    modalHeader.textContent = title;
    modalHeader.style.marginBottom = '1rem';
    
    const modalBody = document.createElement('div');
    modalBody.innerHTML = content;
    modalBody.style.marginBottom = '1.5rem';
    
    const modalFooter = document.createElement('div');
    modalFooter.style.textAlign = 'right';
    
    if (buttons.length === 0) {
        buttons = [{ text: 'OK', action: () => modal.remove() }];
    }
    
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button.text;
        btn.className = `btn ${button.class || 'btn-primary'}`;
        btn.style.marginLeft = '0.5rem';
        btn.onclick = button.action;
        modalFooter.appendChild(btn);
    });
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    return modal;
}

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#ced4da';
        }
        
        if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        }
        
        if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        }
    });
    
    return isValid;
}

// Table Utilities
function createTable(headers, data, options = {}) {
    const table = document.createElement('table');
    table.className = 'table';
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    if (options.actions) {
        const th = document.createElement('th');
        th.textContent = 'Actions';
        headerRow.appendChild(th);
    }
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        
        if (options.actions) {
            const td = document.createElement('td');
            options.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.textContent = action.text;
                btn.className = `btn ${action.class || 'btn-primary'}`;
                btn.style.marginRight = '0.5rem';
                btn.onclick = () => action.handler(index, row);
                td.appendChild(btn);
            });
            tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    return table;
}

// Drag and Drop Utilities
function makeDraggable(element) {
    element.draggable = true;
    element.style.cursor = 'move';
    
    element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', element.id || generateId());
        element.style.opacity = '0.5';
    });
    
    element.addEventListener('dragend', () => {
        element.style.opacity = '1';
    });
}

function makeDroppable(element, onDrop) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.style.background = '#f8f9fa';
    });
    
    element.addEventListener('dragleave', () => {
        element.style.background = '';
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.style.background = '';
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(draggedId);
        if (onDrop) {
            onDrop(draggedElement, element);
        }
    });
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add loading states to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.loading !== 'true') {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.disabled = true;
                this.dataset.loading = 'true';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.dataset.loading = 'false';
                }, 1000);
            }
        });
    });
});

// Export utilities for use in other scripts
window.DemoQA = {
    showAlert,
    showModal,
    generateId,
    formatDate,
    validateEmail,
    validatePhone,
    validateForm,
    createTable,
    makeDraggable,
    makeDroppable
};