document.addEventListener('DOMContentLoaded', () => {
    let usersDB = JSON.parse(localStorage.getItem('usersDB')) || [
        {
            name: "Admin",
            email: "admin@example.com",
            password: "admin123"
        }
    ];

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authContainer = document.getElementById('auth-container');
    const welcomeContainer = document.getElementById('welcome-container');
    const userEmailDisplay = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    const toggleLink = document.getElementById('toggle-link');
    const toggleText = document.getElementById('toggle-text');
    const formTitle = document.getElementById('form-title');
    const alertMessage = document.getElementById('alert-message');

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const isLogin = loginForm.style.display !== 'none';

        loginForm.style.display = isLogin ? 'none' : 'block';
        registerForm.style.display = isLogin ? 'block' : 'none';
        formTitle.textContent = isLogin ? 'Register' : 'Login';
        toggleText.textContent = isLogin ? 'Already have an account?' : "Don't have an account?";
        toggleLink.textContent = isLogin ? 'Login here' : 'Register here';
        clearErrors();
        clearFormInputs();
        hideAlert();
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        let isValid = true;

        if (!email || !validateEmail(email)) {
            showError('login-email-error', 'Please enter a valid email');
            isValid = false;
        }

        if (!password || password.length < 6) {
            showError('login-password-error', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) return;

        const user = usersDB.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', user.email);
            showWelcomeScreen(user.email);
            showAlert('success', 'Login successful!');
        } else {
            showAlert('danger', 'Invalid email or password');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        let isValid = true;

        if (!name || name.length < 3) {
            showError('register-name-error', 'Name must be at least 3 characters');
            isValid = false;
        }

        if (!email || !validateEmail(email)) {
            showError('register-email-error', 'Please enter a valid email');
            isValid = false;
        } else if (usersDB.some(u => u.email === email)) {
            showError('register-email-error', 'Email already registered');
            isValid = false;
        }

        if (!password || password.length < 6) {
            showError('register-password-error', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!confirmPassword || password !== confirmPassword) {
            showError('register-confirm-password-error', 'Passwords do not match');
            isValid = false;
        }

        if (!isValid) return;

        const newUser = { name, email, password };
        usersDB.push(newUser);
        localStorage.setItem('usersDB', JSON.stringify(usersDB));

        showAlert('success', 'Registration successful! Please login.');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        formTitle.textContent = 'Login';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = "Register here";
        clearFormInputs();
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        authContainer.style.display = 'block';
        welcomeContainer.style.display = 'none';
        clearFormInputs();
    });

    function showError(id, message) {
        const el = document.getElementById(id);
        el.textContent = message;
        el.style.display = 'block';
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(err => err.style.display = 'none');
    }

    function clearFormInputs() {
        document.querySelectorAll('input').forEach(input => input.value = '');
    }

    function showAlert(type, message) {
        alertMessage.textContent = message;
        alertMessage.className = 'alert alert-' + type;
        alertMessage.style.display = 'block';
        setTimeout(hideAlert, 5000);
    }

    function hideAlert() {
        alertMessage.style.display = 'none';
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showWelcomeScreen(email) {
        authContainer.style.display = 'none';
        welcomeContainer.style.display = 'block';
        userEmailDisplay.textContent = `Logged in as: ${email}`;
    }

    function checkLoggedIn() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            showWelcomeScreen(loggedInUser);
        }
    }

    checkLoggedIn();


});
