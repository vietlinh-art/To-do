
        // Password toggle visibility
        const toggleRegPassword = document.getElementById('toggleRegPassword');
        const regPasswordInput = document.getElementById('regPassword');

        toggleRegPassword.addEventListener('click', function () {
            const type = regPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regPasswordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });

        // Save registration to localStorage
        const registerForm = document.getElementById('registerForm');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim().toLowerCase();
            const password = regPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // 1. Verify all fields are present
            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields.');
                return;
            }

            // 2. Check password match
            if (password !== confirmPassword) {
                alert('Passwords do not match. Please re-enter.');
                return;
            }

            // 3. Get existing users list
            const users = JSON.parse(localStorage.getItem('todo_users')) || [];

            // 4. Check if email already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                alert('An account with this email already exists.');
                return;
            }

            // 5. Save the new user
            users.push({
                name: name,
                email: email,
                password: password
            });

            localStorage.setItem('todo_users', JSON.stringify(users));

            alert('Account created successfully! Redirecting to login...');
            window.location.href = "login.html";
        });