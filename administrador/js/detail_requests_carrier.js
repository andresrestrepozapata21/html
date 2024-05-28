// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_carrier = urlParams.get('id_carrier');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
// Inicializo la pagina
document.addEventListener('DOMContentLoaded', function () {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/detailCarrier', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_carrier
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
            let transportista = data.data[0];
            // Obtener el elemento div
            const divTransportista = document.getElementById('transportista-component');
            // busco los div de cada uno
            const tipoDocumentoTransportistaInput = divTransportista.querySelector('#tipoDocumento');
            const numeroDocumentoTransportistaInput = divTransportista.querySelector('#numeroDocumento');
            const nombreTransportistaInput = divTransportista.querySelector('#nombreTransportista');
            const apellidoTransportistaInput = divTransportista.querySelector('#apellidoTransportista');
            const telefonoTransportistaInput = divTransportista.querySelector('#telefonoTransportista');
            const emailTransportistaInput = divTransportista.querySelector('#emailTransportista');
            const placaTransportistaInput = divTransportista.querySelector('#placaTransportista');
            const marcaTransportistaInput = divTransportista.querySelector('#marcaTransportista');
            const lineaTransportistaInput = divTransportista.querySelector('#lineaTransportista');
            const modeloTransportistaInput = divTransportista.querySelector('#modeloTransportista');
            const colorTransportistaInput = divTransportista.querySelector('#colorTransportista');
            const claseTransportistaInput = divTransportista.querySelector('#claseTransportista');
            const capacidadVehiculoInput = divTransportista.querySelector('#capacidadVehiculo');
            const descripcionVehiculoTextarea = divTransportista.querySelector('#descripcionVehiculo');
            //Info carrier
            tipoDocumentoTransportistaInput.value = transportista.types_document.description_td;
            numeroDocumentoTransportistaInput.value = transportista.number_document_carrier;
            nombreTransportistaInput.value = transportista.name_carrier;
            apellidoTransportistaInput.value = transportista.last_name_carrier;
            telefonoTransportistaInput.value = transportista.phone_number_carrier;
            emailTransportistaInput.value = transportista.email_carrier;
            // info vehicle
            placaTransportistaInput.value = transportista.vehicle.plate_vehicle;
            marcaTransportistaInput.value = transportista.vehicle.brand_vehicle;
            lineaTransportistaInput.value = transportista.vehicle.line_vehicle;
            modeloTransportistaInput.value = transportista.vehicle.model_vehicle;
            colorTransportistaInput.value = transportista.vehicle.color_vehicle;
            claseTransportistaInput.value = transportista.vehicle.class_vehicle;
            capacidadVehiculoInput.value = `${transportista.vehicle.capacity_vehicle} paquetes`;
            descripcionVehiculoTextarea.value = transportista.vehicle.description_vehicle;
            //Coloco los documentos del transportista
            const divDocumentsTransportista = document.getElementById('carrierDocuments');
            divDocumentsTransportista.innerHTML = '';
            transportista.carrier_documents.forEach(document => {
                const row = `
                    <img src="${window.myAppConfig.production}/${document.url_cd}" alt="">
                `;
                divDocumentsTransportista.innerHTML += row;
            });
            // Colocamos la hora de vida del transporista que viene en los datos del carrier JSON response nivel 1
            const divHVTransportista = document.getElementById('carrierHV');
            divHVTransportista.innerHTML = '';
            const row = `
                <a href="${window.myAppConfig.production}/${transportista.url_hv_carrier}" target="_blank">Abrir Hoja de Vida PDF</a>
                `;
            divHVTransportista.innerHTML += row;
            // Ahora los del vehiculo
            const divDocumentsVehiculo = document.getElementById('vehiculoDocuments');
            divDocumentsVehiculo.innerHTML = '';
            transportista.vehicle.vehicle_documents.forEach(document => {
                const row = `
                    <img src="${window.myAppConfig.production}/${document.url_document_vd}" alt="">
                `;
                divDocumentsVehiculo.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    window.location = './requests_carrier.html';
});

// Captura del evento click del botón "Asignar"
document.getElementById('btnAceptar').addEventListener('click', function () {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/agreeCarrier', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_carrier
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
                localStorage.setItem('CarrierAceptado', true);
                // Redirect to home page
                window.location = `./requests_carrier.html`;
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Captura del evento click del botón "Rechazar"
document.getElementById('btnRechazar').addEventListener('click', function () {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/rejectCarrier', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_carrier
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
                // Save the token and id user router to local storage
                localStorage.setItem('CarrierRechazado', true);
                // Redirect to home page
                window.location = `./requests_carrier.html`;
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