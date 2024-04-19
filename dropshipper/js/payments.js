// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const wallet = localStorage.getItem('wallet');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    // Formatear el valor como moneda
    let valorFormateado = wallet.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });
    // i select wallet component
    const walletElement = document.querySelector('.wallet');
    // To asignate wallet value
    walletElement.textContent = valorFormateado;

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/getBankAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_dropshipper
        })
    })
        .then(response => response.json())
        .then(data => {
            // Validate token Expired Redirection index.html
            if (data.result === 2) {
                // Clear the local storage which removes all data stored in the browser's local storage,
                // including any user session data like tokens
                localStorage.clear();
                // Redirect the user to the login page by changing the current location of the window
                // Replace 'login.html' with the actual URL of your login page
                window.location.href = 'login.html';
            }
            if (data.result == 1) {
                // Obtener el elemento select
                var selectBank = document.getElementById('cuenta');
                // Obtener el listado de transportistas disponibles (suponiendo que esté en una variable llamada cuentasDisponibles
                var cuentasDisponibles = data.data;
                // Limpiar el select
                selectBank.innerHTML = '';

                var option = document.createElement('option');
                option.value = '';
                option.textContent = `-- SELECCIONAR --`;
                selectBank.appendChild(option);
                // Iterar sobre las cuentas disponibles y agregar opciones al select
                cuentasDisponibles.forEach(function (cuenta) {
                    var option = document.createElement('option');
                    option.value = cuenta.id_dba;
                    option.textContent = `${cuenta.bank_dba} - ${cuenta.number_dba} - ${cuenta.type_dba} - ${cuenta.description_dba}`;
                    selectBank.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Fragmento de codigo para realizar el filtro en la tabla
document.getElementById("form").addEventListener('submit', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const cantidad = document.getElementById('cantidad').value;
    const cuenta = document.getElementById('cuenta').value;

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/addPaymentRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            quantity_requested_dpr: cantidad,
            fk_id_dba_drp: cuenta,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Validate token Expired Redirection index.html
            if (data.result === 2) {
                // Clear the local storage which removes all data stored in the browser's local storage,
                // including any user session data like tokens
                localStorage.clear();
                // Redirect the user to the login page by changing the current location of the window
                // Replace 'login.html' with the actual URL of your login page
                window.location.href = 'login.html';
            } else if (data.result === 1) {
                let id_dpr = data.newPaymentRequest.id_dpr
                window.location = './pin_verification.html?id_dpr=' + id_dpr
            }
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de filtro:', error.message);
        });
});