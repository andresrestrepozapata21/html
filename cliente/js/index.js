// index button click event
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const guia = document.getElementById('guia').value;

    // Make the HTTP request to log in
    fetch(window.myAppConfig.production + '/client/getPackageGuide', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            guide_number_p: guia,
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
                throw new Error('Guide Invalidate');
            }
        })
        .then(data => {
            if (data.result == 1) {
                window.location = './detail.html?guia=' + data.data.guide_number_p
            }
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de inicio de sesión:', error.message);
        });
});

// show the message alert credencials incorrect
function mostrarAlerta() {
    const alerta = document.getElementById('alert');
    alerta.textContent = 'Guía incorrecta';
    alerta.style.display = 'block';

    // non-show alert later 3 seconds
    setTimeout(function () {
        alerta.style.display = 'none';
    }, 3000);
}