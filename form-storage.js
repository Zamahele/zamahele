// GitHub Pages compatible form submission handler
// Since GitHub Pages is static hosting, we'll use client-side solutions

class GitHubPagesFormManager {
    constructor() {
        this.submissions = this.loadSubmissions();
        this.initGitHubIntegration();
    }

    // Load submissions from localStorage (only option for static sites)
    loadSubmissions() {
        const stored = localStorage.getItem('blacktech_submissions');
        return stored ? JSON.parse(stored) : [];
    }

    // Initialize GitHub Pages specific features
    initGitHubIntegration() {
        // Add GitHub Pages URL context
        this.siteUrl = window.location.origin;
        this.isGitHubPages = this.siteUrl.includes('github.io') || this.siteUrl.includes('github.com');
        
        console.log('GitHub Pages Form Manager initialized');
        console.log('Site URL:', this.siteUrl);
        console.log('Is GitHub Pages:', this.isGitHubPages);
    }

    // Save submission with GitHub Pages context
    saveSubmission(formData) {
        const submission = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company') || '',
            phone: formData.get('phone') || '',
            projectType: formData.get('project-type') || '',
            budget: formData.get('budget') || '',
            message: formData.get('message'),
            status: 'new',
            source: 'github_pages_website',
            siteUrl: this.siteUrl,
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        };

        this.submissions.push(submission);
        localStorage.setItem('blacktech_submissions', JSON.stringify(this.submissions));
        
        // Auto-backup for GitHub Pages users
        this.createBackupFile(submission);
        
        // Send to external service if configured
        this.sendToExternalService(submission);
        
        return submission;
    }

    // Create downloadable backup (GitHub Pages compatible)
    createBackupFile(submission) {
        try {
            const backupData = {
                site: 'BLACK TECH EMPOWER',
                timestamp: new Date().toISOString(),
                submission: submission,
                allSubmissions: this.submissions
            };
            
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Store backup URL for admin panel
            const backupUrl = URL.createObjectURL(dataBlob);
            submission.backupUrl = backupUrl;
            
            console.log('Backup created for submission:', submission.id);
        } catch (error) {
            console.warn('Could not create backup file:', error);
        }
    }

    // Send to external service (GitHub Pages compatible options)
    async sendToExternalService(submission) {
        // Option 1: Formspree (free tier available)
        if (window.FORMSPREE_ENDPOINT) {
            try {
                await this.sendToFormspree(submission);
            } catch (error) {
                console.warn('Formspree submission failed:', error);
            }
        }

        // Option 2: Netlify Forms (if using Netlify)
        if (window.NETLIFY_FORMS_ENABLED) {
            try {
                await this.sendToNetlify(submission);
            } catch (error) {
                console.warn('Netlify forms submission failed:', error);
            }
        }

        // Option 3: Google Forms (always available)
        if (window.GOOGLE_FORM_URL) {
            try {
                await this.sendToGoogleForms(submission);
            } catch (error) {
                console.warn('Google Forms submission failed:', error);
            }
        }

        // Option 4: GitHub Issues API (create issue in repo)
        if (window.GITHUB_ISSUES_ENABLED) {
            try {
                await this.createGitHubIssue(submission);
            } catch (error) {
                console.warn('GitHub issue creation failed:', error);
            }
        }
    }

    // Send to Formspree (popular GitHub Pages solution)
    async sendToFormspree(submission) {
        const response = await fetch(window.FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: submission.name,
                email: submission.email,
                company: submission.company,
                phone: submission.phone,
                projectType: submission.projectType,
                budget: submission.budget,
                message: submission.message,
                submissionId: submission.id,
                timestamp: submission.timestamp
            })
        });

        if (response.ok) {
            console.log('Submission sent to Formspree successfully');
            submission.formspreeStatus = 'sent';
        } else {
            throw new Error('Formspree submission failed');
        }
    }

    // Send to Google Forms (free and reliable)
    async sendToGoogleForms(submission) {
        // Google Forms can be submitted via URL parameters
        const formUrl = new URL(window.GOOGLE_FORM_URL);
        
        // Add form data as URL parameters (you need to configure these IDs)
        if (window.GOOGLE_FORM_FIELDS) {
            formUrl.searchParams.set(window.GOOGLE_FORM_FIELDS.name, submission.name);
            formUrl.searchParams.set(window.GOOGLE_FORM_FIELDS.email, submission.email);
            formUrl.searchParams.set(window.GOOGLE_FORM_FIELDS.company, submission.company);
            formUrl.searchParams.set(window.GOOGLE_FORM_FIELDS.message, submission.message);
        }

        // Submit via hidden iframe to avoid navigation
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = formUrl.toString();
        document.body.appendChild(iframe);
        
        setTimeout(() => {
            document.body.removeChild(iframe);
            console.log('Submission sent to Google Forms');
            submission.googleFormsStatus = 'sent';
        }, 2000);
    }

    // Create GitHub Issue (requires personal access token)
    async createGitHubIssue(submission) {
        if (!window.GITHUB_TOKEN || !window.GITHUB_REPO) {
            throw new Error('GitHub integration not configured');
        }

        const issueData = {
            title: `New Contact Form Submission from ${submission.name}`,
            body: `
# Contact Form Submission

**Submission ID:** ${submission.id}
**Date:** ${submission.timestamp}

## Contact Information
- **Name:** ${submission.name}
- **Email:** ${submission.email}
- **Company:** ${submission.company || 'Not specified'}
- **Phone:** ${submission.phone || 'Not specified'}

## Project Details
- **Service Type:** ${submission.projectType || 'Not specified'}
- **Budget Range:** ${submission.budget || 'Not specified'}

## Message
${submission.message}

---
*This issue was automatically created from the BLACK TECH EMPOWER website contact form.*
            `,
            labels: ['contact-form', 'lead']
        };

        const response = await fetch(`https://api.github.com/repos/${window.GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${window.GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(issueData)
        });

        if (response.ok) {
            const issue = await response.json();
            console.log('GitHub issue created:', issue.html_url);
            submission.githubIssueUrl = issue.html_url;
        } else {
            throw new Error('GitHub issue creation failed');
        }
    }

    // Export for GitHub Pages deployment
    exportForDeployment() {
        const exportData = {
            site: 'BLACK TECH EMPOWER',
            exportDate: new Date().toISOString(),
            totalSubmissions: this.submissions.length,
            submissions: this.submissions
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `blacktech_submissions_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Get submissions with GitHub Pages context
    getAllSubmissions() {
        return this.submissions.map(sub => ({
            ...sub,
            isGitHubPages: this.isGitHubPages,
            siteUrl: this.siteUrl
        }));
    }

    // Email with GitHub Pages optimizations
    generateEnhancedEmail(submission) {
        return {
            subject: `?? Project Enquiry from ${submission.name} - BLACK TECH EMPOWER`,
            body: `
BLACK TECH EMPOWER - Contact Form Submission
???????????????????????????????????????????

?? SUBMISSION DETAILS
?????????????????????
Submission ID: ${submission.id}
Date & Time: ${new Date(submission.timestamp).toLocaleString()}
Source: GitHub Pages Website
Site URL: ${this.siteUrl}

?? CONTACT INFORMATION
?????????????????????
Name: ${submission.name}
Email: ${submission.email}
Company: ${submission.company || 'Not specified'}
Phone: ${submission.phone || 'Not specified'}

?? PROJECT DETAILS
?????????????????
Service Type: ${submission.projectType || 'Not specified'}
Budget Range: ${submission.budget || 'Not specified'}

?? MESSAGE
?????????
${submission.message}

?? TECHNICAL INFO
???????????????
User Agent: ${submission.userAgent}
Referrer: ${submission.referrer}
GitHub Pages: ${this.isGitHubPages ? 'Yes' : 'No'}

?????????????????????????????????????????????
This submission was automatically captured and stored locally.
For backup, download the JSON file from the admin panel.

GitHub Repository: https://github.com/Zamahele/zamahele
Website: ${this.siteUrl}
            `.trim()
        };
    }

    // Clear submissions
    clearSubmissions() {
        this.submissions = [];
        localStorage.removeItem('blacktech_submissions');
        console.log('All submissions cleared from localStorage');
    }
}

// Initialize GitHub Pages compatible form manager
const gitHubFormManager = new GitHubPagesFormManager();

// Export for global access
window.BlackTechFormManager = gitHubFormManager;
window.GitHubPagesFormManager = gitHubFormManager;