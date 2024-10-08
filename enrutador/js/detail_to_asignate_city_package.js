// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const id_carrier = urlParams.get('id_carrier');
const token = localStorage.getItem('token');
const id_ru = localStorage.getItem('id_ru');
const asignado = localStorage.getItem('asignado');
// Array para almacenar los paquetes seleccionados
let paquetesSeleccionados = [];
// Inicializo la pagina
document.addEventListener('DOMContentLoaded', function () {
    if (asignado) {
        // Llamar a showToast
        showToast('Paquetes asignados existosamente.');
        localStorage.removeItem('asignado');
    }
    //Llamo el metodo cargar datos del servidor
    cargarDatosDelServidor();

    // Añadir evento al botón regresar si es necesario
    document.getElementById('btnRegresar').addEventListener('click', function () {
        window.location = './to_asignate_city_package.html';
    });

    // Captura del evento click del botón "Asignar"
    document.getElementById('btnAsignar').addEventListener('click', function () {
        enviarDatosDeAsignacion();
    });
});
// Evento que captura el clic de la X para cerrar el modal de los productos del paquete
document.querySelector('.close').addEventListener('click', cerrarModal);
// metodo para cargar los detalles de la pagina
async function cargarDatosDelServidor() {
    const url = window.myAppConfig.production + "/routerUser/getDetailAsignate";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id_carrier })
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();

        // Validate token Expired Redirection index.html
        if (data.result === 2) {
            // Clear the local storage which removes all data stored in the browser's local storage,
            // including any user session data like tokens
            localStorage.clear();
            // Redirect the user to the login page by changing the current location of the window
            // Replace 'login.html' with the actual URL of your login page
            window.location.href = 'login.html';
        }

        // 'data' contiene las propiedades 'data_carrier' y 'data_packages'
        cargarInformacionTransportista(data.data_carrier);
        cargarTablaPaquetes(data.data_free_packages, data.data_asignated_packages, data.data_carrier.vehicle.capacity_vehicle);
    } catch (error) {
        console.error('Error al cargar los datos del servidor:', error);
    }
}
// Cargo la informacion del transportista
function cargarInformacionTransportista(transportista) {
    // Obtener el elemento div
    const divTransportista = document.getElementById('transportista-component');

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

    nombreTransportistaInput.value = transportista.name_carrier;
    apellidoTransportistaInput.value = transportista.last_name_carrier;
    telefonoTransportistaInput.value = transportista.phone_number_carrier;
    emailTransportistaInput.value = transportista.email_carrier;
    placaTransportistaInput.value = transportista.vehicle.plate_vehicle;
    marcaTransportistaInput.value = transportista.vehicle.brand_vehicle;
    lineaTransportistaInput.value = transportista.vehicle.line_vehicle;
    modeloTransportistaInput.value = transportista.vehicle.model_vehicle;
    colorTransportistaInput.value = transportista.vehicle.color_vehicle;
    claseTransportistaInput.value = transportista.vehicle.class_vehicle;
    capacidadVehiculoInput.value = `${transportista.vehicle.capacity_vehicle} paquetes`;
    descripcionVehiculoTextarea.value = transportista.vehicle.description_vehicle;
}
// Cargo la tabla de los paquetes
function cargarTablaPaquetes(paquetes, paquetes_asignados, capacidadVehiculo) {
    // Obtener las referencias de los cuerpos de las tablas
    const tbody = document.getElementById('tabla-paquetes').getElementsByTagName('tbody')[0];
    const tbody2 = document.getElementById('tabla-paquetes-asignated').getElementsByTagName('tbody')[0];

    // Limpiar las tablas antes de insertar nuevos datos
    tbody.innerHTML = '';
    tbody2.innerHTML = '';

    // Inicializar los DataTables para cada tabla
    const dataTablePackages = $('#tabla-paquetes').DataTable({
        'destroy': true, // Permite destruir la tabla previa
        'paging': true,  // Habilita la paginación
        'order': [],     // No ordena por defecto
        'initComplete': function() {
            // Restaurar los checkboxes seleccionados al cambiar de página
            this.api().rows().every(function() {
                const row = this.node();
                const checkbox = $(row).find('input[type="checkbox"]');
                const paqueteId = checkbox.val();
                if (paquetesSeleccionados.includes(paqueteId)) {
                    checkbox.prop('checked', true);
                }
            });
        }
    });
    const dataTableAsignated = $('#tabla-paquetes-asignated').DataTable({
        'destroy': true
    });

    // Iterar sobre los paquetes asignados y agregarlos al DataTable correspondiente
    paquetes_asignados.forEach((paquete) => {
        // Construir el HTML de la fila con los datos del paquete asignado
        const statusText = getStatusText(paquete.status_p);
        const withCollectionText = getWithCollectionText(paquete.with_collection_p);
        const row = [
            paquete.id_p,
            paquete.orden_p,
            paquete.name_client_p,
            paquete.phone_number_client_p,
            paquete.guide_number_p,
            statusText,
            withCollectionText,
            `<a href="#" class="view-products" onclick="mostrarDetallePaquete(${paquete.id_p})">Ver Productos</a>`,
            '<input type="checkbox" disabled checked>'
        ];
        dataTableAsignated.row.add(row).draw();
    });

    // Iterar sobre los paquetes y agregarlos al DataTable correspondiente
    paquetes.forEach((paquete) => {
        // Construir el HTML de la fila con los datos del paquete
        const statusText = getStatusText(paquete.status_p);
        const withCollectionText = getWithCollectionText(paquete.with_collection_p);
        const row = [
            paquete.id_p,
            paquete.orden_p,
            paquete.name_client_p,
            paquete.phone_number_client_p,
            paquete.guide_number_p,
            statusText,
            withCollectionText,
            `<a href="#" class="view-products" onclick="mostrarDetallePaquete(${paquete.id_p})">Ver Productos</a>`,
            `<input type="checkbox" name="seleccionPaquete" value="${paquete.id_p}" onchange="actualizarSeleccionPaquete(this, ${capacidadVehiculo})">`
        ];
        dataTablePackages.row.add(row).draw();
    });
}
// Función para obtener el texto de estado
function getStatusText(status) {
    switch (status) {
        case 1:
            return statusText = "<span style='color: #BB2124'>Bodega Comercio</span>";
        case 4:
            return statusText = "<span style='color: #5BC0DE'>En bodega central destino</span>";
        case 5:
            return statusText = "<span style='color: #F0AD4E'>En camino a entrega final</span>";
        case 6:
            return statusText = "<span style='color: #22BB33'>Entregado</span>";
        case 7:
            return statusText = "<span style='color: #F0AD43'>En camino de Bodega Comercio a bodega central</span>";
        default:
            return "";
    }
}
// Función para obtener el texto de recaudo
function getWithCollectionText(withCollection) {
    switch (withCollection) {
        case 0:
            return "Sin Recaudo";
        case 1:
            return "Con Recaudo";
        default:
            return "";
    }
}
// Envio los datos de asignaicion
function enviarDatosDeAsignacion() {
    // Validar que se hayan seleccionado paquetes
    const datosAsignacion = {
        id_carrier,
        ids_p: paquetesSeleccionados
    };
    // Realizar la petición Fetch para asignar los paquetes
    fetch(window.myAppConfig.production + '/routerUser/toAsignatePackages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosAsignacion)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.result = 1) {
                // Save the token and id user router to local storage
                localStorage.setItem('asignado', true);
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Ocurrió un error al asignar los paquetes.');
        });
}
// Muestro el detalle de los paquetes
function mostrarDetallePaquete(idPaquete) {
    const formData = {
        id_p: idPaquete,
    };
    // Realizar la petición Fetch para obtener los productos del paquete
    fetch(window.myAppConfig.production + `/routerUser/getProductsPackage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            //todo el codigo para insertar los datos en la tabla del modal
            const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
            // Limpia el contenido de la tabla antes de insertar nuevos datos
            productTable.innerHTML = '';
            //recorro y cargo los datos correspondients
            data.data.forEach((item) => {
                item.package_products.forEach(product => {
                    const tr = document.createElement('tr');
                    let total = parseInt(product.product.price_sale_product) * parseInt(product.cuantity_pp);
                    tr.innerHTML = `
                        <td>${product.product.id_product}</td>
                        <td>${product.product.name_product}</td>
                        <td>${product.product.description_product}</td>
                        <td>${product.product.size_product}</td>
                        <td>${product.cuantity_pp}</td>
                        <td>${product.product.price_sale_product.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    })}</td>
                        <td>${total.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    })}</td>
                    `;
                    productTable.appendChild(tr);
                });
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch de productos del paquete:', error);
        });
    abrirModal();
}
//Metodo para verificar que la cantidad de paquetes sea la indicada.
function verificarSeleccionPaquetes(capacidadVehiculo) {
    // Obtener el botón de asignar
    const btnAsignar = document.getElementById('btnAsignar');
    // Verificar si la cantidad de paquetes seleccionados excede la capacidad del vehículo
    if (paquetesSeleccionados.length > capacidadVehiculo) {
        alert(`La selección esta excediendo la capacidad del vehículo de ${capacidadVehiculo} paquetes, asegurese de que el vehiculo tenga la capcidad actual para asignar esta cantidad.`);
    } else {
        console.log(capacidadVehiculo)
        console.log(paquetesSeleccionados)
    }
    // Habilitar o deshabilitar el botón de asignar según la cantidad de paquetes seleccionados
    if (paquetesSeleccionados.length > 0) {
        btnAsignar.disabled = false;
        btnAsignar.classList.remove('disabled');
    } else {
        btnAsignar.disabled = true;
        btnAsignar.classList.add('disabled');
    }
}
// Metodo para abrir el modal de los productos del paquete
function abrirModal() {
    document.getElementById('modal').style.display = 'block';
}
// Metodo para cerrar el modal de los productos del paquete
function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
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
// Función para actualizar el array de paquetes seleccionados
function actualizarSeleccionPaquete(checkbox, capacidadVehiculo) {
    // Obtener el id del paquete
    const paqueteId = checkbox.value;
    // Verificar si el checkbox está seleccionado
    if (checkbox.checked) {
        // Si el paquete es seleccionado, añadirlo al array
        if (!paquetesSeleccionados.includes(paqueteId)) {
            paquetesSeleccionados.push(paqueteId);
        }
    } else {
        // Si se deselecciona, removerlo del array
        paquetesSeleccionados = paquetesSeleccionados.filter(id => id !== paqueteId);
    }
    // Verificar la cantidad de paquetes seleccionados
    verificarSeleccionPaquetes(capacidadVehiculo);
}