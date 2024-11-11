async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = ''; // Clear any previous error messages
    
    if (!email || !password) {
        errorMessage.textContent = 'Both fields are required.';
        return;
    }

    const response = await fetch('https://andypangpang.com/api/v1/user/login/ ', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem('jwtToken', data.jwtToken); // Store the token
        window.location.href = 'home.html'; // Redirect to a protected page
    } else {
        errorMessage.textContent = data.error || 'Login failed.';
    }
}