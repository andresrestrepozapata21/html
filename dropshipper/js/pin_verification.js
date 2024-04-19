// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const wallet = localStorage.getItem('wallet');
// Obtener la URL actual
// Crear un objeto URLSearchParams
// Acceder al parámetro específico
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id_dpr = urlParams.get('id_dpr');

document.querySelectorAll('.pin-input').forEach((input, index, array) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < array.length - 1) {
            array[index + 1].focus();
        }
    });
});

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

});

// Fragmento de codigo para realizar el filtro en la tabla
document.getElementById("form").addEventListener('submit', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const pin1 = document.getElementById('pin1').value;
    const pin2 = document.getElementById('pin2').value;
    const pin3 = document.getElementById('pin3').value;
    const pin4 = document.getElementById('pin4').value;
    const pin5 = document.getElementById('pin5').value;
    const pin6 = document.getElementById('pin6').value;

    const pin = parseInt(pin1 + pin2 + pin3 + pin4 + pin5 + pin6);

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/validateVerificationPin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_dpr,
            verification_pin_request: pin,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            console.log(data)
            // Validate token Expired Redirection index.html
            if (data.result === 2) {
                // Clear the local storage which removes all data stored in the browser's local storage,
                // including any user session data like tokens
                localStorage.clear();
                // Redirect the user to the login page by changing the current location of the window
                // Replace 'login.html' with the actual URL of your login page
                window.location.href = 'login.html';
            } else if (data.result === 0) {
                // Ejemplo de cómo llamar a showToast
                showToast('PIN de verificación incorrecto');
                document.querySelectorAll('.pin-input').forEach((input, index, array) => {
                    input.value = "";
                });
            }else if (data.result === 1) {
                window.location = "./confirmation_pin_correct.html"
            }
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de filtro:', error.message);
        });
});
// funion para mostrar notificaiciones toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    const toastContainer = document.getElementById('toast-container');
    if (toastContainer) {
        toastContainer.appendChild(toast);
    }

    // Agrega la clase para mostrar el toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100); // Pequeño retraso antes de mostrar el toast

    // Ocultar el toast después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');

        // Espera a que la transición termine para eliminar el toast
        toast.addEventListener('transitionend', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }, 3000);
}
