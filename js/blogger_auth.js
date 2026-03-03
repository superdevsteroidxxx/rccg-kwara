/**
 * Blogger API Authentication Handler (using Google Identity Services)
 */
const BLOGGER_AUTH = {
    clientId: '527529620438-81p7vv6qfg4tbro7qiquvqool55kv1ct.apps.googleusercontent.com',
    scopes: 'https://www.googleapis.com/auth/blogger',
    tokenClient: null,
    accessToken: null,

    init() {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: this.scopes,
            callback: (response) => {
                if (response.error !== undefined) {
                    console.error('Login Error:', response);
                    return;
                }
                this.accessToken = response.access_token;
                console.log('Access Token acquired');
                // Persist token in session storage for current tab session
                sessionStorage.setItem('blogger_access_token', this.accessToken);
                this.updateUI(true);
                // Trigger any post-login actions (like refreshing post list with edit buttons)
                if (typeof fetchBloggerPosts === 'function') {
                    fetchBloggerPosts();
                }
            },
        });

        // Check for existing token
        const savedToken = sessionStorage.getItem('blogger_access_token');
        if (savedToken) {
            this.accessToken = savedToken;
            this.updateUI(true);
        }

        this.setupEventListeners();
    },

    setupEventListeners() {
        const loginLink = document.getElementById('admin-login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.accessToken) {
                    this.signOut();
                } else {
                    this.signIn();
                }
            });
        }
    },

    signIn() {
        // Request access token
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
    },

    signOut() {
        if (this.accessToken) {
            google.accounts.oauth2.revoke(this.accessToken, () => {
                this.accessToken = null;
                sessionStorage.removeItem('blogger_access_token');
                this.updateUI(false);
                console.log('Tokens revoked');
                if (typeof fetchBloggerPosts === 'function') {
                    fetchBloggerPosts();
                }
            });
        }
    },

    updateUI(isLoggedIn) {
        const loginLink = document.getElementById('admin-login-link');
        if (loginLink) {
            if (isLoggedIn) {
                loginLink.innerHTML = '<i class="fas fa-unlock"></i> Log Out';
                loginLink.classList.add('logged-in');
            } else {
                loginLink.innerHTML = '<i class="fas fa-lock"></i> Staff Login';
                loginLink.classList.remove('logged-in');
            }
        }
    }
};

// Initialize when library is loaded
window.onload = () => {
    BLOGGER_AUTH.init();
};
