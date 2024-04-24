// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_carrier = urlParams.get('id_carrier');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const carrierEditado = localStorage.getItem('carrierEditado');

// Inicializo la pagina
document.addEventListener('DOMContentLoaded', function () {
    //estrutura condicional para mostrar los toast correspondientes
    if (carrierEditado) {
        // Llamar a showToast
        showToast('Transportista editado existosamente.');
        localStorage.removeItem('carrierEditado');
    }
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/detailCarrierAndHistory', {
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
            const tipoTransportistaInput = divTransportista.querySelector('#tipoTransportista');
            const cityTransportistaInput = divTransportista.querySelector('#cityTransportista');
            //Div de los datos del vehiculo
            const placaTransportistaInput = divTransportista.querySelector('#placaTransportista');
            const marcaTransportistaInput = divTransportista.querySelector('#marcaTransportista');
            const lineaTransportistaInput = divTransportista.querySelector('#lineaTransportista');
            const cilindrajeTransportistaInput = divTransportista.querySelector('#cilindrajeTransportista');
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
            tipoTransportistaInput.value = transportista.types_carrier.description_tc;
            cityTransportistaInput.value = transportista.city.name_city + " - " + transportista.city.department.name_d;
            // info vehicle
            placaTransportistaInput.value = transportista.vehicle.plate_vehicle;
            marcaTransportistaInput.value = transportista.vehicle.brand_vehicle;
            lineaTransportistaInput.value = transportista.vehicle.line_vehicle;
            cilindrajeTransportistaInput.value = transportista.vehicle.cylinder_capacity_vehicle;
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
            // Ahora los del vehiculo
            const divDocumentsVehiculo = document.getElementById('vehiculoDocuments');
            divDocumentsVehiculo.innerHTML = '';
            transportista.vehicle.vehicle_documents.forEach(document => {
                const row = `
                    <img src="${window.myAppConfig.production}/${document.url_document_vd}" alt="">
                `;
                divDocumentsVehiculo.innerHTML += row;
            });

            //Ahora el dataTable del historial
            const historyTable = document.querySelector('.history tbody');
            historyTable.innerHTML = ''; // Clear existing rows
            data.data_history.forEach((event, index) => {
                let statusText;
                switch (event.status_sh) {
                    case 0:
                        statusText = "<span style='color: #BB2124'>CANCELADO</span>";
                        break;
                    case 1:
                        statusText = "<span style='color: #BB2124'>Bodega dropshipper</span>";
                        break;
                    case 2:
                        statusText = "<span style='color: #5BC0DE'>Bodega central origen</span>";
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
                        statusText = "<span style='color: #F0AD43'>En camino de bodega dropshipper a bodega central</span>";
                        break;
                }
                const row = `
                 <tr>
                     <td>${index + 1}</td>
                     <td>${event.package.orden_p}</td>
                     <td>${statusText}</td>
                     <td>${event.package.name_client_p}</td>
                     <td>${event.package.phone_number_client_p}</td>
                     <td>${event.package.direction_client_p}</td>
                 </tr>
             `;
                historyTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnEdit').addEventListener('click', function () {
    window.location = './edit_carrier.html?id_carrier=' + id_carrier;
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