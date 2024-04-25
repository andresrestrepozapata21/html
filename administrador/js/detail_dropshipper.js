// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const wallet1 = localStorage.getItem('wallet1');
const wallet2 = localStorage.getItem('wallet2');
const eliminado = localStorage.getItem('eliminado');
const agregado = localStorage.getItem('agregado');
// busco todos los campos para poder enviarlos en el formulario de registro del dropshiiper
const tipoDocumento = document.getElementById('tipoDocumento');
const numeroDocumento = document.getElementById('numeroDocumento');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const telefono = document.getElementById('telefono');
const email = document.getElementById('email');
const password = document.getElementById('password');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    //lanzo el toaster que avise al usuario de la accion realizada
    if (eliminado) {
        // Llamar a showToast
        showToast('Dropshipper eliminado existosamente.');
        localStorage.removeItem('eliminado');
    } else if (agregado) {
        // Llamar a showToast
        showToast('Dropshipper creado existosamente.');
        localStorage.removeItem('agregado');
    }
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
    fetch(window.myAppConfig.production + '/manager/getDropshippers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
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
            // ciclo para ver el estado del paquete y mostrarlo en color
            data.data.forEach(item => {
                let status = item.status_dropshipper;
                let textStatus;
                if (status == 1) {
                    textStatus = `<span style="color: #22bb33">Activo</span>`;
                } else {
                    textStatus = `<span style="color: #bb2124">Desactivado</span>`;
                }
                dataTable.row.add([
                    item.id_dropshipper,
                    item.tipo_documento,
                    item.numero_documento,
                    item.name_dropshipper,
                    item.last_name_dropshipper,
                    item.phone_number_dropshipper,
                    item.email_dropshipper,
                    item.password_dropshipper,
                    textStatus,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="detalle(${item.id_dropshipper})"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    `
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

//Metodo para mostrar los detelles del paquete.
function detalle(id_dropshipper) {
    window.location = "./detail_carrier.html?id_dropshipper=" + id_dropshipper;
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