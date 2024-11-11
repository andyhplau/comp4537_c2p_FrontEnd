async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = '';

    if (!email || !password) {
        errorMessage.textContent = 'Both fields are required.';
        return;
    }

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('https://andypangpang.com/api/v1/user/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()  
    });

    const data = await response.json();

    if (response.status === 200) {
        window.location.href = '/login';
    } else {
        errorMessage.textContent = data.error || 'Registration failed.';
        console.log('Registration failed with error:', data.error || 'Registration failed');
    }
}
