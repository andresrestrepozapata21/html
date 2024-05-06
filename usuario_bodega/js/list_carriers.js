//capturo las varialbes que necesto
const token = localStorage.getItem('token');
const id_su = localStorage.getItem('id_su');
const city = localStorage.getItem('city');
const abonado = localStorage.getItem('abonado');
// Al cargar la pagina
document.addEventListener('DOMContentLoaded', function () {
    //estrutura condicional para mostrar los toast correspondientes
    if (abonado) {
        // Llamar a showToast
        showToast('Transportista abonado existosamente.');
        localStorage.removeItem('abonado');
    }
    // to do request router user get carriers
    fetch(window.myAppConfig.production + '/storeUser/getCarriers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            city
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
            // Procesar los datos y llenar la tabla
            const dataTable = $('#dataTable').DataTable();

            data.data.forEach(item => {
                dataTable.row.add([
                    item.id_carrier,
                    item.type_document,
                    item.number_document_carrier,
                    item.name_carrier,
                    item.last_name_carrier,
                    item.phone_number_carrier,
                    item.email_carrier,
                    item.debt_carrier.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    }),
                    `<button class="pass" onClick="viewPackages(${item.id_carrier}, ${item.debt_carrier})">Abonar</button>`
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});
// Captura del evento click del botón "Asignar"
document.getElementById('btnAbonar').addEventListener('click', function () {
    let pass = document.getElementById('abono').value;
    let id_carrier = document.getElementById('id_carrier').value;
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/storeUser/passCarrier/' + id_carrier, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            pass
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
                document.getElementById('myModal').style.display = 'none';
                localStorage.setItem('abonado', true);
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Evento que captura el clic de la X para cerrar el modal de los productos del paquete
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none';
});

// Función para manejar el evento click del enlace "Ver Paquetes"
function viewPackages(carrierId, debt) {
    document.getElementById('id_carrier').value = carrierId;
    document.getElementById('deuda').value = debt.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });
    document.getElementById('myModal').style.display = 'block';
}

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