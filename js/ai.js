function doSomething() {
    const token = localStorage.getItem('jwtToken');
  
    fetch('/api_route_name', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.status === 401) {
        return refreshAccessToken().then(() => getProtectedData()); 
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    });
  }


function refreshAccessToken() {
return fetch('/api/refresh-token', {
    method: 'POST',
    credentials: 'include' // Include cookies in the request
})
.then(response => response.json())
.then(data => {
    if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    } else {
    throw new Error('Failed to refresh token');
    }
});
}