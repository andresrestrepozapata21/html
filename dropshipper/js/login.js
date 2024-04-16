// when load content loaded
document.addEventListener('DOMContentLoaded', function () {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordField = document.getElementById('password');

    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        // Change eye icon based on password entry type
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');
    });
});

// Login button click event
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Make the HTTP request to log in
    fetch(window.myAppConfig.production + '/dropshipper/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email_dropshipper: email,
            password_dropshipper: password
        })
    })
        .then(response => {
            // Check if the request was successful
            if (response.ok) {
                // Extract token from response
                return response.json();
            } else {
                // If the request was not successful, display an error message
                // Llamar a la función para mostrar la alerta
                mostrarAlerta();
                document.getElementById('uploadForm').reset();
                throw new Error('Credenciales inválidas');
            }
        })
        .then(data => {
            // Save the token and id user router to local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('id_dropshipper', data.data[0].id_dropshipper);

            // Redirect to home page
            window.location.href = 'master.html';
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de inicio de sesión:', error.message);
        });
});

// show the message alert credencials incorrect
function mostrarAlerta() {
    const alerta = document.getElementById('alert');
    alerta.textContent = 'Credenciales incorrectas';
    alerta.style.display = 'block';

    // non-show alert later 3 seconds
    setTimeout(function () {
        alerta.style.display = 'none';
    }, 3000);
}