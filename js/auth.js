// Constants
// Backend runs on port 5000 (see server.js). Update the API URL to match the running backend.
const API_URL = 'http://localhost:5000/api';

// Error handling utility
const showError = (message) => {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorAlert.classList.remove('hidden');
    setTimeout(() => {
        errorAlert.classList.add('hidden');
    }, 5000);
};

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token
                localStorage.setItem('token', data.token);
                // Store basic user info for UI (e.g. username)
                if (data.user) {
                    try {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    } catch (e) {
                        console.warn('Failed to store user in localStorage', e);
                    }
                }
                
                // Redirect to dashboard or home page
                window.location.href = 'index.html';
            } else {
                showError(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            showError('Network error. Please try again later.');
            console.error('Login error:', error);
        }
    });
}

// Registration form handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Basic validation
        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to login page on successful registration
                window.location.href = 'login.html';
            } else {
                showError(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            showError('Network error. Please try again later.');
            console.error('Registration error:', error);
        }
    });
}

// Check authentication status
const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Logout functionality
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
};

// Handle protected routes
const protectRoute = () => {
    if (!checkAuth()) {
        window.location.href = 'login.html';
    }
};