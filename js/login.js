async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = ''; // Clear any previous error messages
    
    if (!email || !password) {
        errorMessage.textContent = 'Both fields are required.';
        return;
    }

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch('https://comp4537-c2p-api-server-1.onrender.com/api/v1/user/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
        },
        body: formData.toString()  
    });

    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem('jwtToken', data.jwtToken); // Store the token
        window.location.href = '/home';  
    } else {
        errorMessage.textContent = data.error || 'Login failed.';
    }
}
