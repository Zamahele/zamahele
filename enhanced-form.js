// GitHub Pages optimized contact form handler
// Enhanced form handling for static site hosting

function initializeGitHubPagesContactForm() {
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
        
        // Save the submission using GitHub Pages form manager
        const submission = window.GitHubPagesFormManager.saveSubmission(formData);
        
        // Generate enhanced email content for GitHub Pages
        const emailData = window.GitHubPagesFormManager.generateEnhancedEmail(submission);
        
        // Create mailto link
        const mailtoLink = `mailto:ndimandezj@gmail.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
        
        // Simulate processing delay
        setTimeout(async () => {
            try {
                // Try external services if configured
                await attemptExternalSubmission(submission);
                
                // Open email client
                window.location.href = mailtoLink;
                
                // Show success message with GitHub Pages context
                formStatus.innerHTML = createSuccessMessage(submission);
                
                // Reset form
                setTimeout(() => {
                    this.reset();
                }, 500);
                
                // Track the submission
                trackFormSubmission(submission);
                
            } catch (error) {
                console.warn('External submission failed:', error);
                
                // Still proceed with mailto and local storage
                window.location.href = mailtoLink;
                formStatus.innerHTML = createSuccessMessage(submission, true);
                
                setTimeout(() => {
                    this.reset();
                }, 500);
            }
        }, 1000);
    });
}

// Attempt external submission services
async function attemptExternalSubmission(submission) {
    const config = window.GITHUB_PAGES_CONFIG?.formSubmissionOptions || {};
    const results = [];

    // Try Formspree if configured
    if (config.formspree && window.FORMSPREE_ENDPOINT) {
        try {
            await window.GitHubPagesFormManager.sendToFormspree(submission);
            results.push('Formspree: ?');
        } catch (error) {
            results.push('Formspree: ?');
        }
    }

    // Try Google Forms if configured
    if (config.googleForms && window.GOOGLE_FORM_URL) {
        try {
            await window.GitHubPagesFormManager.sendToGoogleForms(submission);
            results.push('Google Forms: ?');
        } catch (error) {
            results.push('Google Forms: ?');
        }
    }

    // Try GitHub Issues if configured
    if (config.githubIssues && window.GITHUB_TOKEN) {
        try {
            await window.GitHubPagesFormManager.createGitHubIssue(submission);
            results.push('GitHub Issues: ?');
        } catch (error) {
            results.push('GitHub Issues: ?');
        }
    }

    // Log results
    if (results.length > 0) {
        console.log('External submission results:', results);
        submission.externalResults = results;
    }
}

// Create success message for GitHub Pages
function createSuccessMessage(submission, hasErrors = false) {
    const config = window.BlackTechConfig || {};
    const isGitHub = window.IS_GITHUB_PAGES;
    
    let message = `
        <div class="success">
            ? Message saved successfully! 
            <br><small>Submission ID: ${submission.id}</small>
            <br><small>Your email client should open with the message ready to send.</small>
    `;

    // Add GitHub Pages specific info
    if (isGitHub) {
        message += `<br><small>?? Hosted on GitHub Pages</small>`;
    }

    // Add external service status
    if (submission.externalResults && submission.externalResults.length > 0) {
        message += `<br><small>External services: ${submission.externalResults.join(', ')}</small>`;
    }

    // Add error note if applicable
    if (hasErrors) {
        message += `<br><small style="color: var(--warning);">?? Some external services unavailable, but your message was saved locally.</small>`;
    }

    // Add action buttons
    message += `
            <br>
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
                <button type="button" onclick="showSubmissionDetails('${submission.id}')" class="btn ghost" style="padding: 6px 12px; font-size: 12px;">View Details</button>
                <button type="button" onclick="downloadSubmission('${submission.id}')" class="btn ghost" style="padding: 6px 12px; font-size: 12px;">Download Backup</button>
                <button type="button" onclick="openAdminPanel()" class="btn ghost" style="padding: 6px 12px; font-size: 12px;">Admin Panel</button>
            </div>
        </div>
    `;

    return message;
}

// Track form submission with GitHub Pages context
function trackFormSubmission(submission) {
    // Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            event_category: 'Lead Generation',
            event_label: submission.projectType || 'Unknown',
            custom_parameter_1: 'github_pages'
        });
    }

    // Microsoft Clarity if available
    if (typeof clarity !== 'undefined') {
        clarity('set', 'form_submission', submission.projectType || 'Unknown');
    }

    // Custom tracking
    if (window.BlackTechEmpowerSite && window.BlackTechEmpowerSite.trackEvent) {
        window.BlackTechEmpowerSite.trackEvent('form_submission', 'Lead Generation', submission.projectType);
    }

    console.log('Form submission tracked:', {
        id: submission.id,
        projectType: submission.projectType,
        source: 'github_pages'
    });
}

// Enhanced admin panel for GitHub Pages
function openAdminPanel() {
    const existingPanel = document.querySelector('.admin-panel');
    if (existingPanel) {
        existingPanel.remove();
    } else {
        document.body.appendChild(createGitHubPagesAdminPanel());
    }
}

// Create GitHub Pages optimized admin panel
function createGitHubPagesAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.className = 'admin-panel';
    
    const submissions = window.GitHubPagesFormManager.getAllSubmissions();
    const config = window.BlackTechConfig || {};
    
    adminPanel.innerHTML = `
        <div class="admin-content">
            <div class="admin-header">
                <h3>Form Submissions Admin</h3>
                <div class="admin-actions">
                    <button onclick="exportForGitHubPages()" class="btn primary">Export All</button>
                    <button onclick="showGitHubPagesConfig()" class="btn ghost">Config</button>
                    <button onclick="clearAllSubmissions()" class="btn ghost">Clear All</button>
                    <button onclick="this.closest('.admin-panel').remove()" class="modal-close">×</button>
                </div>
            </div>
            <div class="admin-body">
                <div class="admin-stats">
                    <div class="stat-item">
                        <strong>${submissions.length}</strong>
                        <span>Total Submissions</span>
                    </div>
                    <div class="stat-item">
                        <strong>${window.IS_GITHUB_PAGES ? 'Yes' : 'No'}</strong>
                        <span>GitHub Pages</span>
                    </div>
                    <div class="stat-item">
                        <strong>${config.site?.formSubmissionOptions ? Object.values(config.site.formSubmissionOptions).filter(Boolean).length : 0}</strong>
                        <span>Active Integrations</span>
                    </div>
                </div>
                <div id="submissions-list">
                    ${submissions.length === 0 ? 
                        '<p>No submissions found.</p>' : 
                        submissions.map(sub => `
                            <div class="submission-item">
                                <div class="submission-summary">
                                    <strong>${sub.name}</strong> - ${sub.email}
                                    <small>${new Date(sub.timestamp).toLocaleDateString()} ${sub.projectType ? `• ${sub.projectType}` : ''}</small>
                                    ${sub.externalResults ? `<br><small class="external-status">${sub.externalResults.join(' • ')}</small>` : ''}
                                </div>
                                <div class="submission-actions">
                                    <button onclick="showSubmissionDetails('${sub.id}')" class="btn ghost">View</button>
                                    <button onclick="downloadSubmission('${sub.id}')" class="btn ghost">Download</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `;
    
    return adminPanel;
}

// Export optimized for GitHub Pages
function exportForGitHubPages() {
    window.GitHubPagesFormManager.exportForDeployment();
}

// Show configuration panel
function showGitHubPagesConfig() {
    const config = window.BlackTechConfig || {};
    const configPanel = document.createElement('div');
    configPanel.className = 'submission-modal';
    configPanel.style.display = 'flex';
    
    configPanel.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>GitHub Pages Configuration</h3>
                <button class="modal-close" onclick="this.closest('.submission-modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <h4>Current Settings</h4>
                <p><strong>Site:</strong> ${config.site?.siteName || 'Not configured'}</p>
                <p><strong>GitHub Pages:</strong> ${window.IS_GITHUB_PAGES ? 'Yes' : 'No'}</p>
                <p><strong>Development:</strong> ${window.IS_DEVELOPMENT ? 'Yes' : 'No'}</p>
                
                <h4>Form Submission Options</h4>
                <ul>
                    <li>Local Storage: ? Active</li>
                    <li>Email Client: ? Active</li>
                    <li>Formspree: ${config.site?.formSubmissionOptions?.formspree ? '? Active' : '? Not configured'}</li>
                    <li>Google Forms: ${config.site?.formSubmissionOptions?.googleForms ? '? Active' : '? Not configured'}</li>
                    <li>GitHub Issues: ${config.site?.formSubmissionOptions?.githubIssues ? '? Active' : '? Not configured'}</li>
                </ul>
                
                <h4>Setup Instructions</h4>
                <p>To enable external integrations, edit <code>github-config.js</code> and uncomment the relevant sections.</p>
                
                <h4>Repository</h4>
                <p><a href="https://github.com/Zamahele/zamahele" target="_blank">View on GitHub</a></p>
            </div>
            <div class="modal-footer">
                <button onclick="window.open('https://github.com/Zamahele/zamahele/blob/main/github-config.js', '_blank')" class="btn primary">Edit Config</button>
                <button onclick="this.closest('.submission-modal').remove()" class="btn ghost">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(configPanel);
}

// Enhanced keyboard shortcuts for GitHub Pages
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+A: Admin panel
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        openAdminPanel();
    }
    
    // Ctrl+Shift+E: Export data
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        exportForGitHubPages();
    }
    
    // Ctrl+Shift+C: Show config
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        showGitHubPagesConfig();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for GitHub Pages form manager to be available
    if (window.GitHubPagesFormManager) {
        initializeGitHubPagesContactForm();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (window.GitHubPagesFormManager) {
                initializeGitHubPagesContactForm();
            }
        }, 100);
    }
    
    // Log GitHub Pages status
    console.log('GitHub Pages Form Handler initialized:', {
        isGitHubPages: window.IS_GITHUB_PAGES,
        isDevelopment: window.IS_DEVELOPMENT,
        formManagerAvailable: !!window.GitHubPagesFormManager
    });
});