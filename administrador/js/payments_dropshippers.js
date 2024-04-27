// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const wallet1 = localStorage.getItem('wallet1');
const wallet2 = localStorage.getItem('wallet2');
const pagado = localStorage.getItem('pagado');
const rechazada = localStorage.getItem('rechazada');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    //estrutura condicional para mostrar los toast correspondientes
    if (pagado) {
        // Llamar a showToast
        showToast('Solcitud pagada existosamente.');
        localStorage.removeItem('pagado');
    } else if (rechazada) {
        // Llamar a showToast
        showToast('Solicitud rechazada existosamente.');
        localStorage.removeItem('rechazada');
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
    fetch(window.myAppConfig.production + '/manager/getPaymentsRequestDropshipper', {
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
                dataTable.row.add([
                    item.id_dpr,
                    item.dropshipper_bank_account.dropshipper.tipo_documento,
                    item.dropshipper_bank_account.dropshipper.numero_documento,
                    item.dropshipper_bank_account.dropshipper.name_dropshipper,
                    item.dropshipper_bank_account.dropshipper.last_name_dropshipper,
                    item.quantity_requested_dpr.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    }),
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="detalle(${item.id_dpr})"><i class="fa-solid fa-comments-dollar"></i></button>
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
function detalle(id_dpr) {
    window.location = "./detail_payment_dropshipper.html?id_dpr=" + id_dpr;
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