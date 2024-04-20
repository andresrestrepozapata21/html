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
    fetch(window.myAppConfig.production + '/dropshipper/getPortfolio', {
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
            // Procesar los datos y llenar la tabla
            const dataTable = $('#dataTable').DataTable();
            // ciclo para ver el estado del paquete y mostrarlo en color
            data.data.forEach(item => {
                dataTable.row.add([
                    item.id_phd,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.type_phd,
                    item.monto_phd,
                    item.description_phd
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnDescargar').addEventListener('click', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (!fechaInicio || !fechaFin) return console.log("Ingrese fechas")

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/downloadExcelPortfolio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_dropshipper,
            startDate: fechaInicio,
            endDate: fechaFin
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Devuelve el contenido del archivo como un objeto Blob
            return response.blob();
        })
        .then(blob => {
            // Validate token Expired Redirection index.html
            if (blob.result === 2) {
                // Clear the local storage which removes all blob stored in the browser's local storage,
                // including any user session blob like tokens
                localStorage.clear();
                // Redirect the user to the login page by changing the current location of the window
                // Replace 'login.html' with the actual URL of your login page
                window.location.href = 'login.html';
            }
            // Crea un URL de objeto (Object URL) para el Blob
            const url = URL.createObjectURL(blob);
            // Crea un enlace para descargar el archivo
            const a = document.createElement('a');
            a.href = url;
            // Especifica el nombre del archivo
            a.download = 'reporte_cartera_dropshipper.xlsx'; // Puedes cambiar el nombre del archivo según tus necesidades
            // Agrega el enlace al documento
            document.body.appendChild(a);
            // Haz clic en el enlace para iniciar la descarga
            a.click();
            // Libera el URL de objeto cuando ya no se necesite
            URL.revokeObjectURL(url);
            // Llamar a showToast
            showToast('Reporte descargado correctamente.');
            // Resetear el formulario después de una descarga exitosa
            document.getElementById('form').reset();
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