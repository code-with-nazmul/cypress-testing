// Alerts, Frame & Windows Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeNavigation();
    } catch (e) {
        console.error('Error in initializeNavigation:', e);
    }
    
    try {
        initializeBrowserWindows();
    } catch (e) {
        console.error('Error in initializeBrowserWindows:', e);
    }
    
    try {
        initializeAlerts();
    } catch (e) {
        console.error('Error in initializeAlerts:', e);
    }
    
    try {
        initializeModals();
    } catch (e) {
        console.error('Error in initializeModals:', e);
    }
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

function initializeBrowserWindows() {
    const newTabBtn = document.getElementById('new-tab-button');
    const newWindowBtn = document.getElementById('new-window-button');
    const newWindowMessageBtn = document.getElementById('new-window-message-button');
    const windowResult = document.getElementById('windowResult');
    
    console.log('newTabBtn:', newTabBtn);
    console.log('newWindowBtn:', newWindowBtn);
    console.log('newWindowMessageBtn:', newWindowMessageBtn);
    console.log('windowResult:', windowResult);
    
    if (!newTabBtn || !newWindowBtn || !newWindowMessageBtn || !windowResult) {
        console.log('Some browser window elements not found');
        return;
    }
    
    newTabBtn.addEventListener('click', function() {
        const newTab = window.open('data:text/html,<html><body style="font-family: Arial; padding: 20px; text-align: center;"><h1>This is a sample page</h1><p>This page was opened in a new tab for testing purposes.</p><button onclick="window.close()">Close Tab</button></body></html>', '_blank');
        
        if (newTab) {
            windowResult.innerHTML = '<div class="alert alert-success">New tab opened successfully!</div>';
        } else {
            windowResult.innerHTML = '<div class="alert alert-warning">Pop-up blocked. Please allow pop-ups for this site.</div>';
        }
    });
    
    newWindowBtn.addEventListener('click', function() {
        const newWindow = window.open('data:text/html,<html><body style="font-family: Arial; padding: 20px; text-align: center;"><h1>This is a sample page</h1><p>This page was opened in a new window for testing purposes.</p><button onclick="window.close()">Close Window</button></body></html>', '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
        
        if (newWindow) {
            windowResult.innerHTML = '<div class="alert alert-success">New window opened successfully!</div>';
        } else {
            windowResult.innerHTML = '<div class="alert alert-warning">Pop-up blocked. Please allow pop-ups for this site.</div>';
        }
    });
    
    newWindowMessageBtn.addEventListener('click', function() {
        const messageContent = `
            <html>
                <body style="font-family: Arial; padding: 20px; text-align: center; background: #f8f9fa;">
                    <h1 style="color: #007bff;">Knowledge increases by sharing but not by saving.</h1>
                    <p style="font-size: 18px; margin: 20px 0;">This is a motivational message window!</p>
                    <p style="color: #6c757d;">Window opened from Test Automation Practice</p>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Window</button>
                </body>
            </html>
        `;
        
        const messageWindow = window.open('data:text/html,' + encodeURIComponent(messageContent), '_blank', 'width=500,height=300,scrollbars=yes,resizable=yes');
        
        if (messageWindow) {
            windowResult.innerHTML = '<div class="alert alert-success">Message window opened successfully!</div>';
        } else {
            windowResult.innerHTML = '<div class="alert alert-warning">Pop-up blocked. Please allow pop-ups for this site.</div>';
        }
    });
}

function initializeAlerts() {
    const alertButton = document.getElementById('simple-alert-button');
    const timerAlertButton = document.getElementById('timer-alert-button');
    const confirmButton = document.getElementById('confirm-alert-button');
    const promtButton = document.getElementById('prompt-alert-button');
    const confirmResult = document.getElementById('confirm-result');
    const promptResult = document.getElementById('prompt-result');
    
    if (!alertButton || !timerAlertButton || !confirmButton || !promtButton) {
        console.log('Some alert elements not found');
        return;
    }
    
    // Simple Alert
    alertButton.addEventListener('click', function() {
        alert('You clicked a button');
    });
    
    // Timer Alert
    timerAlertButton.addEventListener('click', function() {
        this.disabled = true;
        this.textContent = 'Alert will appear in 5 seconds...';
        
        let countdown = 5;
        const countdownInterval = setInterval(() => {
            countdown--;
            this.textContent = `Alert will appear in ${countdown} seconds...`;
            
            if (countdown === 0) {
                clearInterval(countdownInterval);
                alert('This alert appeared after 5 seconds');
                this.disabled = false;
                this.textContent = 'Click me';
            }
        }, 1000);
    });
    
    // Confirm Alert
    confirmButton.addEventListener('click', function() {
        const result = confirm('Do you confirm action?');
        if (result) {
            confirmResult.textContent = 'You selected Ok';
            confirmResult.style.color = '#28a745';
        } else {
            confirmResult.textContent = 'You selected Cancel';
            confirmResult.style.color = '#dc3545';
        }
    });
    
    // Prompt Alert
    promtButton.addEventListener('click', function() {
        const result = prompt('Please enter your name', '');
        if (result !== null && result.trim() !== '') {
            promptResult.textContent = `You entered ${result}`;
            promptResult.style.color = '#28a745';
        } else if (result === null) {
            promptResult.textContent = '';
            promptResult.style.color = '';
        } else {
            promptResult.textContent = 'You entered an empty string';
            promptResult.style.color = '#ffc107';
        }
    });
}

function initializeModals() {
    // Small Modal
    const smallModalBtn = document.getElementById('small-modal-button');
    const smallModal = document.getElementById('small-modal');
    const closeSmallModal = document.getElementById('closeSmallModal');
    const closeSmallModalBtn = document.getElementById('closeSmallModalBtn');
    
    // Large Modal
    const largeModalBtn = document.getElementById('large-modal-button');
    const largeModal = document.getElementById('large-modal');
    const closeLargeModal = document.getElementById('closeLargeModal');
    const closeLargeModalBtn = document.getElementById('closeLargeModalBtn');
    
    if (!smallModalBtn || !smallModal || !largeModalBtn || !largeModal) {
        console.log('Some modal elements not found');
        return;
    }
    
    // Small Modal Events
    smallModalBtn.addEventListener('click', function() {
        smallModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeSmallModal.addEventListener('click', function() {
        closeModal(smallModal);
    });
    
    closeSmallModalBtn.addEventListener('click', function() {
        closeModal(smallModal);
    });
    
    // Large Modal Events
    largeModalBtn.addEventListener('click', function() {
        largeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    closeLargeModal.addEventListener('click', function() {
        closeModal(largeModal);
    });
    
    closeLargeModalBtn.addEventListener('click', function() {
        closeModal(largeModal);
    });
    
    // Close modal when clicking outside
    smallModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this);
        }
    });
    
    largeModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (smallModal.style.display === 'flex') {
                closeModal(smallModal);
            }
            if (largeModal.style.display === 'flex') {
                closeModal(largeModal);
            }
        }
    });
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add CSS for alerts and modals
const alertsStyles = `
<style>
.section-content {
    display: none;
}

.section-content.active {
    display: block;
}

.demo-section {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.alert-demo {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: white;
}

.alert-demo h4 {
    margin-bottom: 1rem;
    color: #495057;
}

.modal-demo {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: white;
}

.modal-demo h4 {
    margin-bottom: 1rem;
    color: #495057;
}

.frame-container {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: white;
}

.frame-container h4 {
    margin-bottom: 1rem;
    color: #495057;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.result-area {
    margin-top: 1rem;
    min-height: 50px;
}

.alert {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.alert-success {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    color: #155724;
}

.alert-warning {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    color: #856404;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-height: 90vh;
    overflow-y: auto;
}

.small-modal {
    width: 90%;
    max-width: 400px;
}

.large-modal {
    width: 90%;
    max-width: 800px;
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h4 {
    margin: 0;
    color: #495057;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6c757d;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.close-btn:hover {
    background: #f8f9fa;
    color: #495057;
}

#confirmResult, #promptResult {
    margin-left: 1rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .button-group {
        flex-direction: column;
    }
    
    .modal-content {
        margin: 1rem;
    }
    
    .small-modal, .large-modal {
        width: calc(100% - 2rem);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', alertsStyles);