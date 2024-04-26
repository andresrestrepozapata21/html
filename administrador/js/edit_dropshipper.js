// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_dropshipper = urlParams.get('id_dropshipper');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const wallet1 = localStorage.getItem('wallet1');
const wallet2 = localStorage.getItem('wallet2');
// busco todos los campos para poder enviarlos en el formulario de registro del dropshiiper
const tipoDocumento = document.getElementById('tipoDocumento');
const numeroDocumento = document.getElementById('numeroDocumento');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const telefono = document.getElementById('telefono');
const email = document.getElementById('email');
const password = document.getElementById('password');
// Inicializo la pagina
document.addEventListener('DOMContentLoaded', function () {
    // Formatear el valor como moneda
    let valorFormateado1 = wallet1.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });
    // Formatear el valor como moneda
    let valorFormateado2 = wallet2.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });
    // i select wallet component
    const walletElement1 = document.querySelector('.wallet1');
    const walletElement2 = document.querySelector('.wallet2');
    // To asignate wallet value
    walletElement1.textContent = valorFormateado1;
    walletElement2.textContent = valorFormateado2;

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/getDetailDropshipper', {
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
            //inserto los datos del droshipper
            tipoDocumento.value = data.data.tipo_documento;
            numeroDocumento.value = data.data.numero_documento;
            nombre.value = data.data.name_dropshipper;
            apellido.value = data.data.last_name_dropshipper;
            telefono.value = data.data.phone_number_dropshipper;
            email.value = data.data.email_dropshipper;
            password.value = data.data.password_dropshipper;

            // Procesar los datos y llenar la tabla
            const dataTable = $('#dataTable').DataTable();
            // ciclo para ver el estado del paquete y mostrarlo en color
            data.data.stores.forEach(item => {
                dataTable.row.add([
                    item.id_store,
                    item.direction_store + " - " + item.city.name_city + " - " + item.city.department.name_d,
                    item.phone_number_store,
                    item.capacity_store,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="detalle(${item.id_store})"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    `
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    window.location = './detail_dropshipper.html?id_dropshipper=' + id_dropshipper;
});

// Captura del evento click del botón "Asignar"
document.getElementById('btnEditar').addEventListener('click', function () {
    let tipo_documento = tipoDocumento.value;
    let numero_documento = numeroDocumento.value;
    let name_dropshipper = nombre.value;
    let last_name_dropshipper = apellido.value;
    let phone_number_dropshipper = telefono.value;
    let email_dropshipper = email.value;
    let password_dropshipper = password.value;

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/editDropshipper/' + id_dropshipper, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            tipo_documento,
            numero_documento,
            name_dropshipper,
            last_name_dropshipper,
            phone_number_dropshipper,
            email_dropshipper,
            password_dropshipper
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
                localStorage.setItem('editado', true);
                // Redirect to home page
                window.location = './detail_dropshipper.html?id_dropshipper=' + id_dropshipper;
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
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