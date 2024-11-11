// Fetch user data after login
async function fetchUserData() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '/login'; 
    }

    const response = await fetch('/api/v1/user/data', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    
    if (response.status === 200) {
        document.getElementById('userName').textContent = data.firstName;
        document.getElementById('userEmail').textContent = data.email;
        document.getElementById('apiCallsRemaining').textContent = data.apiCallsRemaining;
        
        if (data.apiCallsRemaining <= 0) {
            document.getElementById('warningMessage').textContent = 'You have reached your free API usage limit.';
        }
    } else {
        window.location.href = '/login'; 
    }
}

function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login'; 
}

fetchUserData();