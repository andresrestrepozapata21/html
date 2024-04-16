// Adding an event listener to the logout button by its ID
document.getElementById('cerrarSesion').addEventListener('click', function() {
    // Clear the local storage which removes all data stored in the browser's local storage,
    // including any user session data like tokens
    localStorage.clear();

    // Redirect the user to the login page by changing the current location of the window
    // Replace 'login.html' with the actual URL of your login page
    window.location.href = 'index.html';
});
