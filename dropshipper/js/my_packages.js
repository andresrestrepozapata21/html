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
                let confirmation = item.confirmation_dropshipper_p;
                let checkHTML;
                if (confirmation === 1) {
                    checkHTML = '<input type="checkbox" class="checked" disabled checked>';
                } else {
                    checkHTML = `<input type="checkbox" class="check" name="seleccionPaquete" value="${item.id_p}" onchange="verificarSeleccionPaquetes()">`;
                }
                dataTable.row.add([
                    item.id_p,
                    item.orden_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.warehouse,
                    item.client_p,
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
                let confirmation = item.confirmation_dropshipper_p;
                let checkHTML;
                if (confirmation === 1) {
                    checkHTML = '<input type="checkbox" class="checked" disabled checked>';
                } else {
                    checkHTML = `<input type="checkbox" class="check" name="seleccionPaquete" value="${item.id_p}" onchange="verificarSeleccionPaquetes()">`;
                }
                dataTable.row.add([
                    item.id_p,
                    item.orden_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.warehouse,
                    item.client_p,
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
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de filtro:', error.message);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    window.location.reload();
});

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

    let result = confirm("¿Estas seguro que deseas eliminar este paquete?, confirmar antes de aceptar.");

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