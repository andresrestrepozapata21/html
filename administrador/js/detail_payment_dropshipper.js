// capturo las variables de entorno que puedo necesitar
const urlParams = new URLSearchParams(window.location.search);
const id_dpr = urlParams.get('id_dpr');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
//const wallet1 = localStorage.getItem('wallet1');
//const wallet2 = localStorage.getItem('wallet2');

// Inicializo la pagina
document.addEventListener('DOMContentLoaded', function () {
    //// Formatear el valor como moneda
    //let valorFormateado1 = wallet1.toLocaleString('es-CO', {
    //    style: 'currency',
    //    currency: 'COP'
    //});
    //// Formatear el valor como moneda
    //let valorFormateado2 = wallet2.toLocaleString('es-CO', {
    //    style: 'currency',
    //    currency: 'COP'
    //});
    //// i select wallet component
    //const walletElement1 = document.querySelector('.wallet1');
    //const walletElement2 = document.querySelector('.wallet2');
    //// To asignate wallet value
    //walletElement1.textContent = valorFormateado1;
    //walletElement2.textContent = valorFormateado2;
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/detailPaymentRequestDropshipper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_dpr
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
            let dropshipper = data.data[0];
            console.log(dropshipper)
            // Obtener el elemento div
            const div = document.getElementById('transportista-component');
            // busco los div de cada uno
            const tipoDocumentoInput = div.querySelector('#tipoDocumento');
            const numeroDocumentoInput = div.querySelector('#numeroDocumento');
            const nombreInput = div.querySelector('#nombre');
            const apellidoInput = div.querySelector('#apellido');
            const telefonoInput = div.querySelector('#telefono');
             //Cuentas
             const banco = div.querySelector('#banco');
             const tipocuenta = div.querySelector('#tipocuenta');
             const numeroCuenta = div.querySelector('#numeroCuenta');
             const montoSolicitado = div.querySelector('#montoSolicitado');
            //Info carrier
            tipoDocumentoInput.value = dropshipper.dropshipper_bank_account.dropshipper.tipo_documento;
            numeroDocumentoInput.value = dropshipper.dropshipper_bank_account.dropshipper.numero_documento;
            nombreInput.value = dropshipper.dropshipper_bank_account.dropshipper.name_dropshipper;
            apellidoInput.value = dropshipper.dropshipper_bank_account.dropshipper.last_name_dropshipper;
            telefonoInput.value = dropshipper.dropshipper_bank_account.dropshipper.phone_number_dropshipper;
            banco.textContent = `Banco: ${dropshipper.dropshipper_bank_account.bank_dba}`;
            tipocuenta.textContent = `Tipo Cuenta: ${dropshipper.dropshipper_bank_account.type_dba}`;
            numeroCuenta.textContent = `# Cuenta: ${dropshipper.dropshipper_bank_account.number_dba}`;
            let cantidad = dropshipper.quantity_requested_dpr.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP'
            });
            montoSolicitado.textContent = `Monto Solicitado: ${cantidad}`;
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnPagar').addEventListener('click', function () {

    let result = confirm('¿Estas seguro que deseas pagarle al dropshipper?');

    if (result) {
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/toPayDropshipper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_dpr
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
                if (data.result === 1) {
                    // Save the token and id user router to local storage
                    localStorage.setItem('pagado', true);
                    // Redirect to home page
                    window.location = './payments_dropshippers.html';
                }
            })
            .catch(error => {
                console.error('Error en la petición Fetch:', error);
            });
    }
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRechazar').addEventListener('click', function () {

    let result = confirm('¿Estas seguro que deseas cancelar la solicitud, esto retornara el monto solicitado a la wallet del dropshipper?');

    if (result) {
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/toPayRejectDropshipper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_dpr
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
                if (data.result === 1) {
                    // Save the token and id user router to local storage
                    localStorage.setItem('rechazada', true);
                    // Redirect to home page
                    window.location = './payments_dropshippers.html';
                }
            })
            .catch(error => {
                console.error('Error en la petición Fetch:', error);
            });
    }
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    window.location = './payments_dropshippers.html';
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