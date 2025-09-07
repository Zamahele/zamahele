// Enhanced form handler with multiple storage options
// Add this to your existing script.js or include separately

// Enhanced contact form handling with storage
function initializeEnhancedContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const formStatus = document.getElementById('form-status');
        
        // Client-side validation
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();
        
        // Clear previous status
        formStatus.innerHTML = '';
        
        // Validation
        if (!name || !email || !message) {
            formStatus.innerHTML = '<div class="error">Please fill in all required fields.</div>';
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            formStatus.innerHTML = '<div class="error">Please enter a valid email address.</div>';
            return;
        }
        
        // Show loading state
        formStatus.innerHTML = '<div class="loading">Processing your message...</div>';
        
        // Save the submission using our form manager
        const submission = window.BlackTechFormManager.saveSubmission(formData);
        
        // Prepare email content
        const subject = `Project Enquiry from ${name} - BLACK TECH EMPOWER`;
        const company = formData.get('company')?.trim() || 'Not specified';
        const phone = formData.get('phone')?.trim() || 'Not specified';
        const projectType = formData.get('project-type') || 'Not specified';
        const budget = formData.get('budget') || 'Not specified';
        
        const body = `
Project Enquiry - BLACK TECH EMPOWER
Submission ID: ${submission.id}

Contact Information:
??????????????????????
Name: ${name}
Email: ${email}
Company: ${company}
Phone: ${phone}

Project Details:
??????????????????????
Service Type: ${projectType}
Budget Range: ${budget}

Message:
??????????????????????
${message}

??????????????????????
Sent via BLACK TECH EMPOWER contact form
${new Date().toLocaleString()}
Stored locally for backup
        `.trim();
        
        // Create mailto link
        const mailtoLink = `mailto:ndimandezj@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Simulate processing delay
        setTimeout(() => {
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message with submission details
            formStatus.innerHTML = `
                <div class="success">
                    ? Message saved successfully! 
                    <br><small>Submission ID: ${submission.id}</small>
                    <br><small>Your email client should open with the message ready to send.</small>
                    <br><button type="button" onclick="showSubmissionDetails('${submission.id}')" class="btn ghost" style="margin-top: 10px; padding: 6px 12px; font-size: 12px;">View Details</button>
                </div>
            `;
            
            // Reset form after successful submission
            setTimeout(() => {
                this.reset();
            }, 500);
            
            // Track the submission
            if (window.BlackTechEmpowerSite) {
                window.BlackTechEmpowerSite.trackEvent('form_submission', 'Lead Generation', projectType);
            }
        }, 1000);
    });
}

// Function to show submission details
function showSubmissionDetails(submissionId) {
    const submissions = window.BlackTechFormManager.getAllSubmissions();
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission) {
        const modal = createSubmissionModal(submission);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }
}

// Create modal to display submission details
function createSubmissionModal(submission) {
    const modal = document.createElement('div');
    modal.className = 'submission-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Submission Details</h3>
                <button class="modal-close" onclick="this.closest('.submission-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <p><strong>ID:</strong> ${submission.id}</p>
                <p><strong>Date:</strong> ${new Date(submission.timestamp).toLocaleString()}</p>
                <p><strong>Name:</strong> ${submission.name}</p>
                <p><strong>Email:</strong> ${submission.email}</p>
                <p><strong>Company:</strong> ${submission.company || 'Not specified'}</p>
                <p><strong>Phone:</strong> ${submission.phone || 'Not specified'}</p>
                <p><strong>Project Type:</strong> ${submission.projectType || 'Not specified'}</p>
                <p><strong>Budget:</strong> ${submission.budget || 'Not specified'}</p>
                <p><strong>Message:</strong></p>
                <div class="message-content">${submission.message}</div>
            </div>
            <div class="modal-footer">
                <button onclick="downloadSubmission('${submission.id}')" class="btn primary">Download JSON</button>
                <button onclick="this.closest('.submission-modal').remove()" class="btn ghost">Close</button>
            </div>
        </div>
    `;
    
    return modal;
}

// Download individual submission
function downloadSubmission(submissionId) {
    const submissions = window.BlackTechFormManager.getAllSubmissions();
    const submission = submissions.find(s => s.id === submissionId);
    
    if (submission) {
        const dataStr = JSON.stringify(submission, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `submission_${submission.id}.json`;
        link.click();
    }
}

// Admin panel for viewing all submissions
function createAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
        <div class="admin-content">
            <div class="admin-header">
                <h3>Form Submissions Admin</h3>
                <div class="admin-actions">
                    <button onclick="exportAllSubmissions()" class="btn primary">Export All</button>
                    <button onclick="clearAllSubmissions()" class="btn ghost">Clear All</button>
                    <button onclick="this.closest('.admin-panel').remove()" class="modal-close">×</button>
                </div>
            </div>
            <div class="admin-body">
                <div id="submissions-list"></div>
            </div>
        </div>
    `;
    
    // Populate submissions list
    const submissions = window.BlackTechFormManager.getAllSubmissions();
    const submissionsList = adminPanel.querySelector('#submissions-list');
    
    if (submissions.length === 0) {
        submissionsList.innerHTML = '<p>No submissions found.</p>';
    } else {
        const list = submissions.map(sub => `
            <div class="submission-item">
                <div class="submission-summary">
                    <strong>${sub.name}</strong> - ${sub.email}
                    <small>${new Date(sub.timestamp).toLocaleDateString()}</small>
                </div>
                <div class="submission-actions">
                    <button onclick="showSubmissionDetails('${sub.id}')" class="btn ghost">View</button>
                    <button onclick="downloadSubmission('${sub.id}')" class="btn ghost">Download</button>
                </div>
            </div>
        `).join('');
        submissionsList.innerHTML = list;
    }
    
    return adminPanel;
}

// Export all submissions
function exportAllSubmissions() {
    window.BlackTechFormManager.exportAllSubmissions();
}

// Clear all submissions with confirmation
function clearAllSubmissions() {
    if (confirm('Are you sure you want to clear all submissions? This cannot be undone.')) {
        window.BlackTechFormManager.clearSubmissions();
        alert('All submissions cleared.');
        
        // Refresh admin panel if open
        const adminPanel = document.querySelector('.admin-panel');
        if (adminPanel) {
            adminPanel.remove();
            document.body.appendChild(createAdminPanel());
        }
    }
}

// Secret admin access (press Ctrl+Shift+A)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        const existingPanel = document.querySelector('.admin-panel');
        if (existingPanel) {
            existingPanel.remove();
        } else {
            document.body.appendChild(createAdminPanel());
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for form manager to be available
    if (window.BlackTechFormManager) {
        initializeEnhancedContactForm();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (window.BlackTechFormManager) {
                initializeEnhancedContactForm();
            }
        }, 100);
    }
});