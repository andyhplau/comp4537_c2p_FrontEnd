// Fetch admin data and user information
async function fetchAdminData() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '/login';
    }

    const response = await fetch('https://comp4537-c2p-api-server-1.onrender.com/api/v1/user/userStats/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    const data = await response.json();
    
    if (response.status === 200) {
        const userTableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
        data.users.forEach(user => {
            const row = userTableBody.insertRow();
            row.insertCell(0).textContent = user.firstName;
            row.insertCell(1).textContent = user.email;
            row.insertCell(2).textContent = user.apiCallsUsed;
            row.insertCell(3).textContent = user.apiCallsRemaining;
        });
    } else {
        window.location.href = '/login'; 
    }
}

function logout() {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
}

fetchAdminData();