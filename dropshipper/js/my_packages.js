// capturo las variables de entorno que puedo necesitar 
const token = localStorage.getItem('token');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const wallet = localStorage.getItem('wallet');
const eliminado = localStorage.getItem('eliminado');
const confirmado = localStorage.getItem('confirmado');
const recargado = localStorage.getItem('recargado');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    //estrutura condicional para mostrar los toast correspondientes
    if (eliminado) {
        // Llamar a showToast
        showToast('Paquete eliminado existosamente.');
        localStorage.removeItem('eliminado');
    } else if (confirmado) {
        // Llamar a showToast
        showToast('Paquete confirmado existosamente.');
        localStorage.removeItem('confirmado');
    } else if (recargado) {
        // Llamar a showToast
        showToast('Tabla recargada existosamente.');
        localStorage.removeItem('recargado');
    }
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
    fetch(window.myAppConfig.production + '/dropshipper/getpackages', {
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
                let confirmation = item.confirmation_dropshipper_p;
                let checkHTML;
                if (confirmation === 1) {
                    checkHTML = '<input type="checkbox" class="checked" disabled checked>';
                } else {
                    checkHTML = `<input type="checkbox" class="check" name="seleccionPaquete" value="${item.id_p}"  data-tooltip="Confirmar" onchange="verificarSeleccionPaquetes()">`;
                }
                dataTable.row.add([
                    item.orden_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.warehouse,
                    item.name_client_p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
                    item.address_client_p,
                    item.type_send,
                    statusText,
                    item.carrier,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="detallePaquete(${item.id_p})" data-tooltip="Ver detalles"><i class="fa-solid fa-magnifying-glass"></i></button>
                        <button type="button" id="btnEdit" class="enlaces" onClick="editarPaquete(${item.id_p})" data-tooltip="Editar"><i class="fa-regular fa-pen-to-square"></i></button>
                        ${checkHTML}
                        <button type="button" id="btnDelete" class="enlaces" onClick="eliminarPaquete(${item.id_p})" data-tooltip="Eliminar"><i class="fa-solid fa-ban"></i></button>
                    </div>`
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
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
            var select = document.getElementById('filterWarehouse');
            // Limpiar el select de ciudades
            select.innerHTML = '';
            // Crear la opción por defecto
            var optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = `Todos`;
            select.appendChild(optionDefault);
            // ciclo para ver el estado del paquete y mostrarlo en color
            data.data.stores.forEach(item => {
                var option = document.createElement('option');
                option.value = item.direction_store;
                option.textContent = `${item.direction_store} - ${item.city.name_city} - ${item.city.department.name_d}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Fragmento de codigo para realizar el filtro en la tabla
document.getElementById("form").addEventListener('submit', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/filterByDate', {
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
            return response.json();
        })
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
            const dataTable = $('#dataTable').DataTable().clear();
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
                let confirmation = item.confirmation_dropshipper_p;
                let checkHTML;
                if (confirmation === 1) {
                    checkHTML = '<input type="checkbox" class="checked" disabled checked>';
                } else {
                    checkHTML = `<input type="checkbox" class="check" name="seleccionPaquete" value="${item.id_p}" onchange="verificarSeleccionPaquetes()">`;
                }
                dataTable.row.add([
                    item.orden_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.warehouse,
                    item.name_client_p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(),
                    item.address_client_p,
                    item.type_send,
                    statusText,
                    item.carrier,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="detallePaquete(${item.id_p})"><i class="fa-solid fa-magnifying-glass"></i></button>
                        <button type="button" id="btnEdit" class="enlaces" onClick="editarPaquete(${item.id_p})"><i class="fa-regular fa-pen-to-square"></i></button>
                        ${checkHTML}
                        <button type="button" id="btnDelete" class="enlaces" onClick="eliminarPaquete(${item.id_p})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    `
                ]).draw();
            });
            //llamo mi notificacion toast
            showToast("Tabla filtrada existosamente.")
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de filtro:', error.message);
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
    fetch(window.myAppConfig.production + '/dropshipper/downloadExcelpackagesDate', {
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
            a.download = 'reporte_paquetes.xlsx'; // Puedes cambiar el nombre del archivo según tus necesidades
            // Agrega el enlace al documento
            document.body.appendChild(a);
            // Haz clic en el enlace para iniciar la descarga
            a.click();
            // Libera el URL de objeto cuando ya no se necesite
            URL.revokeObjectURL(url);
            //Muestro el toast correspondiente
            showToast('Descarga existosa.');
            // Resetear el formulario después de una descarga exitosa
            document.getElementById('form').reset();
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de filtro:', error.message);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    // Save the token and id user router to local storage
    localStorage.setItem('recargado', true);
    window.location.reload();
});

//formulario de filtro adicional
document.getElementById("advancedFilterForm").addEventListener('submit', function (event) {
    // Prevengo el comportamiento por defecto del formulario
    event.preventDefault();
    // Obtengo los valores de los filtros
    const filterClient = document.getElementById('filterClient').value.toLowerCase();
    const filterWarehouse = document.getElementById('filterWarehouse').value.toLowerCase();
    const filterType = document.getElementById('typerPackage').value.toLowerCase();
    const filterStatus = document.getElementById('filterStatus').value;

    // Filtro la tabla con los valores introducidos
    const dataTable = $('#dataTable').DataTable();

    // Limpiar todas las búsquedas previas
    dataTable.columns().search('');

    // Aplicar los filtros si tienen valores
    if (filterWarehouse) {
        dataTable.column(2).search(filterWarehouse);
    }
    if (filterClient) {
        dataTable.column(3).search(filterClient);
    }
    if (filterType) {
        dataTable.column(5).search(filterType);
    }
    if (filterStatus !== "") {
        // Es posible que necesites ajustar esta línea según cómo se almacene el estado en la tabla.
        const statusText = getStatusText(filterStatus);
        dataTable.column(6).search(statusText);
    }
    // Aplicar la búsqueda
    dataTable.draw();
});

// Limpiar filtros
document.getElementById('btnClearFilter').addEventListener('click', function () {
    // Limpiar los valores de los filtros
    document.getElementById('filterWarehouse').value = '';
    document.getElementById('filterClient').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('typerPackage').value = '';

    // Resetear la búsqueda del DataTable
    const dataTable = $('#dataTable').DataTable();
    dataTable.search('').columns().search('').draw();
});

// Mostrar/ocultar los filtros adicionales
document.getElementById('btnToggleFilters').addEventListener('click', function () {
    var filtersContainer = document.getElementById('filtersContainer');
    filtersContainer.classList.toggle('show');
});

//Valido el estado del paquete para mostrarlo
function getStatusText(status) {
    switch (status) {
        case "0":
            return "CANCELADO";
        case "1":
            return "En Bodega Comercio";
        case "2":
            return "En bodega central origen";
        case "3":
            return "En camino entre bodegas centrales";
        case "4":
            return "En bodega central destino";
        case "5":
            return "En camino a entrega final";
        case "6":
            return "Entregado";
        case "7":
            return "En camino de Bodega Comercio a bodega central";
        default:
            return "";
    }
}

//Metodo para verificar que la cantidad de paquetes sea la indicada.
function verificarSeleccionPaquetes() {

    let result = confirm("¿Estas seguro que deseas Confirmar el pedido?, Verificar bien el pedido a confirmar.");
    const checkboxesSeleccionados = document.querySelectorAll('input[name="seleccionPaquete"]:checked');

    if (result) {
        let id_p = checkboxesSeleccionados[0].value;

        console.log(id_p)
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/dropshipper/corfirmatePackage', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_p
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
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
                    localStorage.setItem('confirmado', true);
                    // Recargo la pagina
                    window.location.reload();
                }
            })
            .catch(error => {
                // Handle login errors
                console.error('Error de filtro:', error.message);
            });
    } else {
        checkboxesSeleccionados[0].checked = false;
    }
}

//Metodo para eliminar el paquete.
function eliminarPaquete(id_p) {

    let result = confirm("¿Estas seguro que deseas CANCELAR este paquete?, confirmar antes de aceptar.");

    if (result) {
        console.log(id_p)
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/dropshipper/deletePackage', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_p
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
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
                    localStorage.setItem('eliminado', true);
                    window.location.reload();
                }
            })
            .catch(error => {
                // Handle login errors
                console.error('Error de filtro:', error.message);
            });
    } else {
        checkboxesSeleccionados[0].checked = false;
    }
}

//Metodo para mostrar los detelles del paquete.
function detallePaquete(id_p) {
    window.location = "./detail_package.html?id_p=" + id_p;
}

//Metodo para editar el paquete.
function editarPaquete(id_p) {
    window.location = "./edit_package.html?id_p=" + id_p;
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