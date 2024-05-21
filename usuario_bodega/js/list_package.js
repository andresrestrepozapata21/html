// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_su = localStorage.getItem('id_su');
const id_store = localStorage.getItem('id_store');
const city = localStorage.getItem('city');
const eliminado = localStorage.getItem('eliminado');


// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    //estrutura condicional para mostrar los toast correspondientes
    if (eliminado) {
        // Llamar a showToast
        showToast('Paquete eliminado existosamente.');
        localStorage.removeItem('eliminado');
    }
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/storeUser/packages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_store
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
                let statusText;
                switch (item.status_p) {
                    case 0:
                        statusText = "<span style='color: #BB2124'>CANCELADO</span>";
                        break;
                    case 1:
                        statusText = "<span style='color: #BB2124'>En Bodega Comercio</span>";
                        break;
                    case 2:
                        statusText = "<span style='color: #5BC0DE'>En bodega central origen</span>";
                        break;
                    case 3:
                        statusText = "<span style='color: #F0AD4E'>En camino entre bodegas centrales</span>";
                        break;
                    case 4:
                        statusText = "<span style='color: #5BC0DE'>En bodega central destino</span>";
                        break;
                    case 5:
                        statusText = "<span style='color: #F0AD4E'>En camino a entrega final</span>";
                        break;
                    case 6:
                        statusText = "<span style='color: #22BB33'>Entregado</span>";
                        break;
                    case 7:
                        statusText = "<span style='color: #F0AD43'>En camino de Bodega Comercio a bodega central</span>";
                        break;
                }
                let id = item.id_p;
                let orden_p = item.orden_p;
                let createdAt = item.createdAt.slice(0, 19).replace("T", " ");
                let name_client_p = item.name_client_p;
                let direction_client_p = item.direction_client_p;
                let types_package = item.types_package.description_tp;
                dataTable.row.add([
                    item.id_p,
                    item.orden_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.name_client_p + " - " + item.direction_client_p,
                    item.types_package.description_tp,
                    statusText,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="barCode(${item.guide_number_p}, ${id}, '${orden_p}', '${createdAt}', '${name_client_p}', '${direction_client_p}', '${types_package}')"><i class="fa-solid fa-barcode"></i></button>
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
function barCode(guide_number_p, id_p, orden_p, createdAt, name_client_p, direction_client_p, types_package) {

    if (guide_number_p) {
        // Generar el código de barras en el canvas
        const canvas = document.getElementById('barcode');
        JsBarcode(canvas, guide_number_p, {
            format: 'CODE128',
            displayValue: true,
        });

        // Obtener la imagen del código de barras en base64
        const barcodeBase64 = canvas.toDataURL('image/png');

        // Crear el PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configurar el título y centrarlo
        doc.setFontSize(16);
        doc.text('Información del Paquete', 105, 10, { align: 'center' });

        // Datos del paquete
        doc.setFontSize(12);
        doc.text(`Número de guía: ${guide_number_p}`, 10, 20);
        doc.text(`ID: ${id_p}`, 10, 30);
        doc.text(`Orden: ${orden_p}`, 10, 40);
        doc.text(`Fecha de creación: ${createdAt}`, 10, 50);
        doc.text(`Cliente: ${name_client_p}`, 10, 60);
        doc.text(`Dirección: ${direction_client_p}`, 10, 70);
        doc.text(`Tipo de paquete: ${types_package}`, 10, 80);

        //añado la imagen del codigo de barras
        doc.addImage(barcodeBase64, 'PNG', 55, 100, 100, 50); // Ajusta las coordenadas y tamaño según tu diseño

        // Generar el Blob del PDF
        const pdfBlob = doc.output('blob');

        // Crear una URL para el Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Abrir el PDF en una nueva pestaña
        window.open(pdfUrl);
    } else {
        alert('No se pudo obtener el número de la API');
    }
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