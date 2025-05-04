document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        errorEl.textContent = ''; // Clear previous error messages
        errorEl.classList.add('hidden');

        // Get username and password values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const remember = document.getElementById('remember').checked;

        // Basic validation
        if (!username || !password) {
            showError('Semua field wajib diisi.');
            return;
        }

        try {
            // Hardcoded credentials for demo purposes
            if(username === 'admin' && password === 'admin123') {
                // Save authentication flag and username in localStorage
                localStorage.setItem('isLogged', 'true');
                localStorage.setItem('loggedUser', username);
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
                // Redirect to main page
                window.location.href = 'index.html';
            } else {
                showError('Username atau password salah.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            showError('Terjadi kesalahan. Silakan coba lagi.');
        }
    });

    function showError(message) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    // Check if user was remembered
    if (localStorage.getItem('rememberMe') === 'true' && localStorage.getItem('isLogged') === 'true') {
        window.location.href = 'index.html';
    }
});
