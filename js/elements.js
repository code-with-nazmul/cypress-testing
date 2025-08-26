// Elements Page JavaScript

// Sample data for web tables
let tableData = [
    { firstName: 'Cierra', lastName: 'Vega', age: 39, email: 'cierra@example.com', salary: 10000, department: 'Insurance' },
    { firstName: 'Alden', lastName: 'Cantrell', age: 45, email: 'alden@example.com', salary: 12000, department: 'Compliance' },
    { firstName: 'Kierra', lastName: 'Gentry', age: 29, email: 'kierra@example.com', salary: 2000, department: 'Legal' }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTextBox();
    initializeCheckBox();
    initializeRadioButton();
    initializeWebTables();
    initializeButtons();
    initializeLinks();
    initializeUploadDownload();
    initializeDynamicProperties();
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

function initializeTextBox() {
    const form = document.getElementById('textBoxForm');
    const output = document.getElementById('output');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userName = document.getElementById('full-name').value;
        const userEmail = document.getElementById('email').value;
        const currentAddress = document.getElementById('current-address').value;
        const permanentAddress = document.getElementById('permanent-address').value;
        
        let outputHTML = '<div style="border: 1px solid #ddd; padding: 1rem; background: #f8f9fa;">';
        if (userName) outputHTML += `<p id="output-name"><strong>Name:</strong> ${userName}</p>`;
        if (userEmail) outputHTML += `<p id="output-email"><strong>Email:</strong> ${userEmail}</p>`;
        if (currentAddress) outputHTML += `<p id="output-currentAddress"><strong>Current Address:</strong> ${currentAddress}</p>`;
        if (permanentAddress) outputHTML += `<p id="output-permanentAddress"><strong>Permanent Address:</strong> ${permanentAddress}</p>`;
        outputHTML += '</div>';
        
        output.innerHTML = outputHTML;
        output.style.display = 'block';
    });
}

function initializeCheckBox() {
    const checkboxes = document.querySelectorAll('.tree-checkbox');
    const result = document.getElementById('result');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCheckboxHierarchy(this);
            updateResult();
        });
    });
    
    function updateCheckboxHierarchy(checkbox) {
        const node = checkbox.closest('.tree-node');
        
        // Update children
        const children = node.querySelectorAll('.tree-children .tree-checkbox');
        children.forEach(child => {
            child.checked = checkbox.checked;
        });
        
        // Update parent
        updateParentCheckbox(node);
    }
    
    function updateParentCheckbox(node) {
        const parent = node.parentElement.closest('.tree-node');
        if (parent) {
            const parentCheckbox = parent.querySelector(':scope > .tree-checkbox');
            const siblings = parent.querySelectorAll(':scope > .tree-children > .tree-node > .tree-checkbox');
            
            const checkedSiblings = Array.from(siblings).filter(cb => cb.checked);
            
            if (checkedSiblings.length === siblings.length) {
                parentCheckbox.checked = true;
                parentCheckbox.indeterminate = false;
            } else if (checkedSiblings.length > 0) {
                parentCheckbox.checked = false;
                parentCheckbox.indeterminate = true;
            } else {
                parentCheckbox.checked = false;
                parentCheckbox.indeterminate = false;
            }
            
            updateParentCheckbox(parent);
        }
    }
    
    function updateResult() {
        const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
        const checkedLabels = checkedBoxes.map(cb => cb.nextElementSibling.textContent);
        
        if (checkedLabels.length > 0) {
            result.innerHTML = `<p><strong>You have selected:</strong></p><p>${checkedLabels.join(', ')}</p>`;
        } else {
            result.innerHTML = '';
        }
    }
}

function initializeRadioButton() {
    const radioButtons = document.querySelectorAll('input[name="like"]');
    const result = document.getElementById('radioResult');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                result.innerHTML = `<p><strong>You have selected ${this.value}</strong></p>`;
            }
        });
    });
}

function initializeWebTables() {
    const tableContainer = document.getElementById('tableContainer');
    const searchBox = document.getElementById('searchBox');
    const addButton = document.getElementById('add');
    const addRecordForm = document.getElementById('addRecordForm');
    const submitButton = document.getElementById('webtable-submit');
    
    function renderTable(data = tableData) {
        const table = DemoQA.createTable(
            ['First Name', 'Last Name', 'Age', 'Email', 'Salary', 'Department'],
            data.map(row => [row.firstName, row.lastName, row.age, row.email, row.salary, row.department]),
            {
                actions: [
                    {
                        text: 'Edit',
                        class: 'btn-primary',
                        handler: (index, row) => editRecord(data[index])
                    },
                    {
                        text: 'Delete',
                        class: 'btn-danger',
                        handler: (index, row) => deleteRecord(data[index])
                    }
                ]
            }
        );
        
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }
    
    function editRecord(record) {
        const form = `
            <form id="editForm">
                <div class="form-group">
                    <label>First Name:</label>
                    <input type="text" name="firstName" value="${record.firstName}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value="${record.lastName}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Age:</label>
                    <input type="number" name="age" value="${record.age}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value="${record.email}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Salary:</label>
                    <input type="number" name="salary" value="${record.salary}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Department:</label>
                    <input type="text" name="department" value="${record.department}" class="form-control" required>
                </div>
            </form>
        `;
        
        DemoQA.showModal('Edit Record', form, [
            {
                text: 'Save',
                class: 'btn-primary',
                action: () => {
                    const formData = new FormData(document.getElementById('editForm'));
                    const updatedRecord = Object.fromEntries(formData.entries());
                    updatedRecord.age = parseInt(updatedRecord.age);
                    updatedRecord.salary = parseInt(updatedRecord.salary);
                    
                    const index = tableData.findIndex(r => r.email === record.email);
                    if (index !== -1) {
                        tableData[index] = updatedRecord;
                        renderTable();
                        DemoQA.showAlert('Record updated successfully!', 'success');
                    }
                    
                    document.querySelector('.modal-overlay').remove();
                }
            },
            {
                text: 'Cancel',
                class: 'btn-secondary',
                action: () => document.querySelector('.modal-overlay').remove()
            }
        ]);
    }
    
    function deleteRecord(record) {
        DemoQA.showModal('Confirm Delete', `Are you sure you want to delete ${record.firstName} ${record.lastName}?`, [
            {
                text: 'Delete',
                class: 'btn-danger',
                action: () => {
                    tableData = tableData.filter(r => r.email !== record.email);
                    renderTable();
                    DemoQA.showAlert('Record deleted successfully!', 'success');
                    document.querySelector('.modal-overlay').remove();
                }
            },
            {
                text: 'Cancel',
                class: 'btn-secondary',
                action: () => document.querySelector('.modal-overlay').remove()
            }
        ]);
    }
    
    function addRecord() {
        const form = `
            <form id="addForm">
                <div class="form-group">
                    <label>First Name:</label>
                    <input type="text" name="firstName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Last Name:</label>
                    <input type="text" name="lastName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Age:</label>
                    <input type="number" name="age" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Salary:</label>
                    <input type="number" name="salary" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Department:</label>
                    <input type="text" name="department" class="form-control" required>
                </div>
            </form>
        `;
        
        DemoQA.showModal('Add New Record', form, [
            {
                text: 'Add',
                class: 'btn-primary',
                action: () => {
                    const formData = new FormData(document.getElementById('addForm'));
                    const newRecord = Object.fromEntries(formData.entries());
                    newRecord.age = parseInt(newRecord.age);
                    newRecord.salary = parseInt(newRecord.salary);
                    
                    tableData.push(newRecord);
                    renderTable();
                    DemoQA.showAlert('Record added successfully!', 'success');
                    document.querySelector('.modal-overlay').remove();
                }
            },
            {
                text: 'Cancel',
                class: 'btn-secondary',
                action: () => document.querySelector('.modal-overlay').remove()
            }
        ]);
    }
    
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredData = tableData.filter(record => 
            Object.values(record).some(value => 
                value.toString().toLowerCase().includes(searchTerm)
            )
        );
        renderTable(filteredData);
    });
    
    addButton.addEventListener('click', function() {
        if (addRecordForm.style.display === 'none') {
            addRecordForm.style.display = 'block';
        } else {
            addRecordForm.style.display = 'none';
        }
    });
    
    submitButton.addEventListener('click', function() {
        const firstName = document.getElementById('webtable-first-name').value;
        const lastName = document.getElementById('webtable-last-name').value;
        const email = document.getElementById('webtable-email').value;
        const age = parseInt(document.getElementById('webtable-age').value);
        const salary = parseInt(document.getElementById('webtable-salary').value);
        const department = document.getElementById('webtable-department').value;
        
        if (firstName && lastName && email && age && salary && department) {
            const newRecord = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                age: age,
                salary: salary,
                department: department
            };
            
            tableData.push(newRecord);
            renderTable();
            
            // Clear form
            document.getElementById('webtable-first-name').value = '';
            document.getElementById('webtable-last-name').value = '';
            document.getElementById('webtable-email').value = '';
            document.getElementById('webtable-age').value = '';
            document.getElementById('webtable-salary').value = '';
            document.getElementById('webtable-department').value = '';
            
            // Hide form
            addRecordForm.style.display = 'none';
        }
    });
    
    // Initial render
    renderTable();
}

function initializeButtons() {
    const doubleClickBtn = document.getElementById('doubleClickBtn');
    const rightClickBtn = document.getElementById('rightClickBtn');
    const clickMeBtn = document.getElementById('clickMeBtn');
    
    doubleClickBtn.addEventListener('dblclick', function() {
        document.getElementById('doubleClickMessage').innerHTML = '<p style="color: #667eea;">You have done a double click</p>';
    });
    
    rightClickBtn.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        document.getElementById('rightClickMessage').innerHTML = '<p style="color: #667eea;">You have done a right click</p>';
    });
    
    clickMeBtn.addEventListener('click', function() {
        document.getElementById('dynamicClickMessage').innerHTML = '<p style="color: #667eea;">You have done a dynamic click</p>';
    });
}

function initializeLinks() {
    const apiLinks = document.querySelectorAll('.api-link');
    const linkResponse = document.getElementById('linkResponse');
    
    apiLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const status = this.getAttribute('data-status');
            
            // Simulate API call
            linkResponse.innerHTML = '<p>Loading...</p>';
            
            setTimeout(() => {
                linkResponse.innerHTML = `
                    <div style="border: 1px solid #ddd; padding: 1rem; background: #f8f9fa;">
                        <p>Link has responded with staus ${status} and status text ${getStatusText(status)}</p>
                    </div>
                `;
            }, 1000);
        });
    });
    
    function getStatusText(status) {
        const statusTexts = {
            '201': 'Created',
            '204': 'No Content',
            '301': 'Moved Permanently',
            '400': 'Bad Request',
            '401': 'Unauthorized',
            '403': 'Forbidden',
            '404': 'Not Found'
        };
        return statusTexts[status] || 'Unknown';
    }
}

function initializeUploadDownload() {
    const downloadButton = document.getElementById('downloadButton');
    const uploadFile = document.getElementById('upload-file');
    const uploadedFilePath = document.getElementById('uploaded-file-path');
    
    downloadButton.addEventListener('click', function() {
        // Create a sample file to download
        const content = 'This is a sample file downloaded from DemoQA mockup.\nTimestamp: ' + new Date().toISOString();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sampleFile.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert('File downloaded successfully!', 'success');
    });
    
    uploadFile.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            uploadedFilePath.innerHTML = `<p><strong>Uploaded file:</strong> ${file.name}</p>`;
            showAlert('File uploaded successfully!', 'success');
        }
    });
}

function initializeDynamicProperties() {
    // Random ID generation
    const randomIdValue = document.getElementById('randomIdValue');
    randomIdValue.textContent = DemoQA.generateId();
    
    // Enable button after 5 seconds
    const enableAfterBtn = document.getElementById('enableAfter');
    setTimeout(() => {
        enableAfterBtn.disabled = false;
        enableAfterBtn.textContent = 'Now Enabled';
        enableAfterBtn.classList.remove('btn-secondary');
        enableAfterBtn.classList.add('btn-success');
    }, 5000);
    
    // Color change button
    const colorChangeBtn = document.getElementById('colorChange');
    const colors = ['btn-primary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info'];
    let colorIndex = 0;
    
    // Automatically change color after 5 seconds
    setTimeout(() => {
        colorChangeBtn.classList.add('text-danger');
    }, 5000);
    
    colorChangeBtn.addEventListener('click', function() {
        // Remove current color class
        colors.forEach(color => this.classList.remove(color));
        
        // Add new color class
        colorIndex = (colorIndex + 1) % colors.length;
        this.classList.add(colors[colorIndex]);
    });
    
    // Show button after 5 seconds
    const visibleAfterBtn = document.getElementById('visibleAfter');
    setTimeout(() => {
        visibleAfterBtn.style.display = 'inline-block';
    }, 5000);
}

// Add CSS for tree structure
const treeStyles = `
<style>
.section-content {
    display: none;
}

.section-content.active {
    display: block;
}

.tree-container {
    font-family: monospace;
}

.tree-node {
    margin-left: 20px;
    position: relative;
}

.tree-node:first-child {
    margin-left: 0;
}

.tree-checkbox {
    margin-right: 8px;
}

.tree-label {
    cursor: pointer;
    user-select: none;
}

.tree-label.disabled {
    color: #6c757d;
    cursor: not-allowed;
}

.tree-children {
    margin-left: 20px;
    border-left: 1px dashed #ddd;
    padding-left: 10px;
}

.radio-input {
    margin-right: 8px;
}

.radio-label {
    cursor: pointer;
    user-select: none;
}

.radio-label.disabled {
    color: #6c757d;
    cursor: not-allowed;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', treeStyles);