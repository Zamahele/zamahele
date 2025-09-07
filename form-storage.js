// Simple form submission handler that saves to local storage and JSON file
// This is a basic client-side solution

class FormSubmissionManager {
    constructor() {
        this.submissions = this.loadSubmissions();
    }

    // Load submissions from localStorage
    loadSubmissions() {
        const stored = localStorage.getItem('blacktech_submissions');
        return stored ? JSON.parse(stored) : [];
    }

    // Save submission
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
            source: 'website_contact_form'
        };

        this.submissions.push(submission);
        localStorage.setItem('blacktech_submissions', JSON.stringify(this.submissions));
        
        // Also save to downloadable JSON file
        this.downloadSubmissionBackup(submission);
        
        return submission;
    }

    // Download submission as JSON file
    downloadSubmissionBackup(submission) {
        const dataStr = JSON.stringify(submission, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `submission_${submission.id}.json`;
        
        // Auto-download (can be disabled)
        // link.click();
        
        console.log('Submission saved:', submission);
    }

    // Get all submissions
    getAllSubmissions() {
        return this.submissions;
    }

    // Export all submissions
    exportAllSubmissions() {
        const dataStr = JSON.stringify(this.submissions, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `blacktech_all_submissions_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Clear all submissions
    clearSubmissions() {
        this.submissions = [];
        localStorage.removeItem('blacktech_submissions');
    }
}

// Initialize the form manager
const formManager = new FormSubmissionManager();

// Export for use in other scripts
window.BlackTechFormManager = formManager;