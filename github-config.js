// GitHub Pages Configuration for BLACK TECH EMPOWER
// Configure external services for form submissions

window.GITHUB_PAGES_CONFIG = {
    // Site configuration
    siteName: 'BLACK TECH EMPOWER',
    siteUrl: window.location.origin,
    
    // Form submission options for GitHub Pages
    formSubmissionOptions: {
        localStorage: true,          // Always available
        emailClient: true,          // mailto: links
        formspree: false,           // Set to true when configured
        netlifyForms: false,        // Set to true if using Netlify
        googleForms: false,         // Set to true when configured
        githubIssues: false         // Set to true when configured
    }
};

// ==============================================
// CONFIGURATION INSTRUCTIONS FOR GITHUB PAGES
// ==============================================

/*

OPTION 1: FORMSPREE INTEGRATION (Recommended)
????????????????????????????????????????????
1. Go to https://formspree.io/
2. Sign up for free account
3. Create a new form
4. Get your form endpoint URL
5. Uncomment and update below:

window.FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
window.GITHUB_PAGES_CONFIG.formSubmissionOptions.formspree = true;

*/

// window.FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
// window.GITHUB_PAGES_CONFIG.formSubmissionOptions.formspree = true;


/*

OPTION 2: GOOGLE FORMS INTEGRATION
?????????????????????????????????
1. Create a Google Form
2. Get the form URL and field IDs
3. Uncomment and update below:

window.GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
window.GOOGLE_FORM_FIELDS = {
    name: 'entry.123456789',      // Replace with actual field IDs
    email: 'entry.987654321',
    company: 'entry.456789123',
    message: 'entry.789123456'
};
window.GITHUB_PAGES_CONFIG.formSubmissionOptions.googleForms = true;

*/

// window.GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
// window.GOOGLE_FORM_FIELDS = {
//     name: 'entry.123456789',
//     email: 'entry.987654321',
//     company: 'entry.456789123',
//     message: 'entry.789123456'
// };
// window.GITHUB_PAGES_CONFIG.formSubmissionOptions.googleForms = true;


/*

OPTION 3: GITHUB ISSUES INTEGRATION
??????????????????????????????????
1. Create a Personal Access Token in GitHub
2. Give it 'public_repo' scope
3. Uncomment and update below:

window.GITHUB_TOKEN = 'ghp_your_personal_access_token_here';
window.GITHUB_REPO = 'Zamahele/zamahele';  // Your repo
window.GITHUB_PAGES_CONFIG.formSubmissionOptions.githubIssues = true;

WARNING: Don't commit tokens to public repos! Use GitHub Secrets or environment variables.

*/

// window.GITHUB_TOKEN = 'ghp_your_personal_access_token_here';
// window.GITHUB_REPO = 'Zamahele/zamahele';
// window.GITHUB_PAGES_CONFIG.formSubmissionOptions.githubIssues = true;


/*

OPTION 4: NETLIFY FORMS (If using Netlify)
?????????????????????????????????????????
If you deploy to Netlify instead of GitHub Pages:

window.GITHUB_PAGES_CONFIG.formSubmissionOptions.netlifyForms = true;

And add data-netlify="true" to your form element.

*/


// ==============================================
// ANALYTICS CONFIGURATION
// ==============================================

/*

GOOGLE ANALYTICS SETUP
?????????????????????
1. Create Google Analytics property
2. Get your Measurement ID
3. Uncomment and update below:

window.GOOGLE_ANALYTICS_ID = 'G-XXXXXXXXXX';

*/

// window.GOOGLE_ANALYTICS_ID = 'G-XXXXXXXXXX';


/*

MICROSOFT CLARITY SETUP (Free heatmaps)
??????????????????????????????????????
1. Go to https://clarity.microsoft.com/
2. Create project and get tracking code
3. Uncomment and update below:

window.CLARITY_PROJECT_ID = 'your_project_id';

*/

// window.CLARITY_PROJECT_ID = 'your_project_id';


// ==============================================
// BUSINESS CONFIGURATION
// ==============================================

window.BUSINESS_CONFIG = {
    name: 'BLACK TECH EMPOWER (Pty) Ltd',
    email: 'ndimandezj@gmail.com',
    phone: '+27 73 590 4108',
    whatsapp: '27735904108',
    linkedin: 'https://linkedin.com/in/zamagcwensa-ndimande',
    registration: '2025/688796/07',
    location: 'South Africa',
    
    // Services
    services: [
        'ASP.NET Core Development',
        'API Integration',
        'Database Solutions',
        'Data Streaming',
        'DevOps & CI/CD',
        'Technical Consulting'
    ],
    
    // Technologies
    technologies: [
        'ASP.NET Core', 'Blazor', 'Entity Framework',
        'REST APIs', 'WCF Services', 'Microservices',
        'MS SQL Server', 'Oracle', 'Apache Kafka',
        'RabbitMQ', 'Azure DevOps', 'Docker', 'Azure Cloud'
    ]
};

// ==============================================
// DEPLOYMENT HELPERS
// ==============================================

// Check if running on GitHub Pages
window.IS_GITHUB_PAGES = (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('github.com')
);

// Development vs Production detection
window.IS_DEVELOPMENT = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port !== ''
);

// Log configuration on load
console.log('GitHub Pages Config Loaded:', {
    siteName: window.GITHUB_PAGES_CONFIG.siteName,
    isGitHubPages: window.IS_GITHUB_PAGES,
    isDevelopment: window.IS_DEVELOPMENT,
    formOptions: window.GITHUB_PAGES_CONFIG.formSubmissionOptions
});

// Export configuration
window.BlackTechConfig = {
    site: window.GITHUB_PAGES_CONFIG,
    business: window.BUSINESS_CONFIG,
    isGitHubPages: window.IS_GITHUB_PAGES,
    isDevelopment: window.IS_DEVELOPMENT
};