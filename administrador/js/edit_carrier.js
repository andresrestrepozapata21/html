// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_carrier = urlParams.get('id_carrier');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
// Obtener el elemento div
const divTransportista = document.getElementById('transportista-component');
// declaro y busco los div de cada uno
const numeroDocumentoTransportistaInput = divTransportista.querySelector('#numeroDocumento');
const nombreTransportistaInput = divTransportista.querySelector('#nombreTransportista');
const apellidoTransportistaInput = divTransportista.querySelector('#apellidoTransportista');
const telefonoTransportistaInput = divTransportista.querySelector('#telefonoTransportista');
const emailTransportistaInput = divTransportista.querySelector('#emailTransportista');
//variables de los datos del vehiculo
const placaTransportistaInput = divTransportista.querySelector('#placaTransportista');
const marcaTransportistaInput = divTransportista.querySelector('#marcaTransportista');
const lineaTransportistaInput = divTransportista.querySelector('#lineaTransportista');
const cilindrajeTransportistaInput = divTransportista.querySelector('#cilindrajeTransportista');
const modeloTransportistaInput = divTransportista.querySelector('#modeloTransportista');
const colorTransportistaInput = divTransportista.querySelector('#colorTransportista');
const claseTransportistaInput = divTransportista.querySelector('#claseTransportista');
const capacidadVehiculoInput = divTransportista.querySelector('#capacidadVehiculo');
const descripcionVehiculoTextarea = divTransportista.querySelector('#descripcionVehiculo');
var id_vehicle;
// Inicializo la pagina
document.addEventListener('DOMContentLoaded', function () {
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
            let id_tipo_documento = data.data[0].types_document.id_td;
            let id_tipo_carrier = data.data[0].types_carrier.id_tc;
            id_vehicle = data.data[0].vehicle.id_vehicle;

            // Realizar la petición Fetch al endpoint
            fetch(window.myAppConfig.production + '/manager/getTypeDocumentsCarrier', {
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
                    if (data.result === 1) {
                        // Obtener el elemento select
                        var selectDocuments = document.querySelector('select[name="tipoDocumento"]');
                        // Obtener el listado de documentos disponibles (suponiendo que esté en una variable llamada documentosDisponibles)
                        var tipoDocumentosDisponibles = data.data;
                        // Limpiar el select
                        selectDocuments.innerHTML = '';

                        var option = document.createElement('option');
                        option.value = '';
                        option.textContent = `-- SELECCIONAR --`;
                        selectDocuments.appendChild(option);
                        // Iterar sobre los documentos disponibles y agregar opciones al select
                        tipoDocumentosDisponibles.forEach(function (documento) {
                            var option = document.createElement('option');
                            option.value = documento.id_td;
                            option.textContent = `${documento.id_td} - ${documento.description_td}`;

                            // Si el ID del documento coincide con el ID del documento seleccionado, marcarlo como seleccionado
                            if (documento.id_td === id_tipo_documento) {
                                option.selected = true;
                            }

                            selectDocuments.appendChild(option);
                        });
                    }

                })
                .catch(error => {
                    console.error('Error en la petición Fetch:', error);
                });

            // Realizar la petición Fetch al endpoint
            fetch(window.myAppConfig.production + '/manager/getTypeCarrier', {
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
                    if (data.result === 1) {
                        // Obtener el elemento select
                        var selectCarriers = document.querySelector('select[name="tipoCarrier"]');
                        // Obtener el listado de los tipos de carriers disponibles (suponiendo que esté en una variable llamada tiposCarriersDisponibles)
                        var tipoCarriersDisponibles = data.data;
                        // Limpiar el select
                        selectCarriers.innerHTML = '';

                        var option = document.createElement('option');
                        option.value = '';
                        option.textContent = `-- SELECCIONAR --`;
                        selectCarriers.appendChild(option);
                        // Iterar sobre los documentos disponibles y agregar opciones al select
                        tipoCarriersDisponibles.forEach(function (tipo) {
                            var option = document.createElement('option');
                            option.value = tipo.id_tc;
                            option.textContent = `${tipo.id_tc} - ${tipo.description_tc}`;

                            // Si el ID del tipo coincide con el ID del tipo seleccionado, marcarlo como seleccionado
                            if (tipo.id_tc === id_tipo_carrier) {
                                option.selected = true;
                            }

                            selectCarriers.appendChild(option);
                        });
                    }

                })
                .catch(error => {
                    console.error('Error en la petición Fetch:', error);
                });

            //Info carrier
            numeroDocumentoTransportistaInput.value = transportista.number_document_carrier;
            nombreTransportistaInput.value = transportista.name_carrier;
            apellidoTransportistaInput.value = transportista.last_name_carrier;
            telefonoTransportistaInput.value = transportista.phone_number_carrier;
            emailTransportistaInput.value = transportista.email_carrier;
            // info vehicle
            placaTransportistaInput.value = transportista.vehicle.plate_vehicle;
            marcaTransportistaInput.value = transportista.vehicle.brand_vehicle;
            lineaTransportistaInput.value = transportista.vehicle.line_vehicle;
            cilindrajeTransportistaInput.value = transportista.vehicle.cylinder_capacity_vehicle;
            modeloTransportistaInput.value = transportista.vehicle.model_vehicle;
            colorTransportistaInput.value = transportista.vehicle.color_vehicle;
            claseTransportistaInput.value = transportista.vehicle.class_vehicle;
            capacidadVehiculoInput.value = `${transportista.vehicle.capacity_vehicle}`;
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
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    window.location = './detail_carrier.html?id_carrier=' + id_carrier;
});

// Captura del evento click del botón "Asignar"
document.getElementById('btnEditar').addEventListener('click', function () {
    let fk_id_td_carrier = document.getElementById('tipoDocumento').value;
    let number_document_carrier = numeroDocumentoTransportistaInput.value;
    let name_carrier = nombreTransportistaInput.value;
    let last_name_carrier = apellidoTransportistaInput.value;
    let phone_number_carrier = telefonoTransportistaInput.value;
    let email_carrier = emailTransportistaInput.value;
    let fk_id_tc_carrier = document.getElementById('tipoCarrier').value;

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/editCarrier/' + id_carrier, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            fk_id_td_carrier,
            number_document_carrier,
            name_carrier,
            last_name_carrier,
            phone_number_carrier,
            email_carrier,
            fk_id_tc_carrier
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
                let description_vehicle = descripcionVehiculoTextarea.value;
                let class_vehicle = claseTransportistaInput.value;
                let plate_vehicle = placaTransportistaInput.value;
                let color_vehicle = colorTransportistaInput.value;
                let brand_vehicle = marcaTransportistaInput.value;
                let line_vehicle = lineaTransportistaInput.value;
                let model_vehicle = modeloTransportistaInput.value;
                let cylinder_capacity_vehicle = cilindrajeTransportistaInput.value;
                let capacity_vehicle = capacidadVehiculoInput.value;
                // Realizar la petición Fetch al endpoint
                fetch(window.myAppConfig.production + '/manager/editVehicle/' + id_vehicle, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        description_vehicle,
                        class_vehicle,
                        plate_vehicle,
                        color_vehicle,
                        brand_vehicle,
                        line_vehicle,
                        model_vehicle,
                        cylinder_capacity_vehicle,
                        capacity_vehicle
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
                            localStorage.setItem('carrierEditado', true);
                            // Redirect to home page
                            window.location = './detail_carrier.html?id_carrier=' + id_carrier;
                        }
                    })
                    .catch(error => {
                        console.error('Error en la petición Fetch:', error);
                    });
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