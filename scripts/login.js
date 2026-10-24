
    // Password visibility toggle
    const toggleBtn = document.getElementById('togglePassword');
    const pwdInput = document.getElementById('loginPassword');

    toggleBtn.addEventListener('click', () => {
      const isPassword = pwdInput.type === 'password';
      pwdInput.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    });

    // Check credentials and redirect to index.html
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = emailInput.value.trim().toLowerCase();
      const password = pwdInput.value;

      if (!email || !password) {
        alert('Please fill in both fields.');
        return;
      }

      // Check registered users in localStorage
      const users = JSON.parse(localStorage.getItem('todo_users')) || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Save active session
        localStorage.setItem('todo_current_user', JSON.stringify({
          name: user.name,
          email: user.email
        }));

        // Loads your index.html file
        window.location.href = "index.html";
      } else {
        alert('Incorrect email or password.');
      }
    });