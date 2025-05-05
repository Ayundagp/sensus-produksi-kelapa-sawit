document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    const loginForm = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    const loginButton = document.getElementById('loginButton');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    function setLoading(isLoading) {
        if (isLoading) {
            loginButton.disabled = true;
            loginText.textContent = 'Masuk...';
            loginSpinner.classList.remove('hidden');
            loginButton.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            loginButton.disabled = false;
            loginText.textContent = 'Masuk';
            loginSpinner.classList.add('hidden');
            loginButton.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        errorEl.textContent = ''; // Clear previous error messages
        errorEl.classList.add('hidden');
        
        setLoading(true);

        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const remember = document.getElementById('remember').checked;

        // Basic validation
        if (!username || !password) {
            showError('Semua field wajib diisi.');
            setLoading(false);
            return;
        }

        try {
            console.log('Attempting login with:', { username });
            // Call API login function
            const response = await window.api.login({ username, password });
            console.log('Login response:', response);
            
            // Handle remember me
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }

            console.log('Login successful, redirecting...');
            // Redirect to main page
            window.location.href = 'index.html';
        } catch (err) {
            console.error('Error during login:', err);
            showError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
            setLoading(false);
        }
    });

    function showError(message) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    // Check if user was remembered
    const isRemembered = localStorage.getItem('rememberMe') === 'true';
    const isLogged = localStorage.getItem('isLogged') === 'true';
    console.log('Checking remembered login:', { isRemembered, isLogged });
    
    if (isRemembered && isLogged) {
        console.log('User was remembered, redirecting...');
        window.location.href = 'index.html';
    }
});
