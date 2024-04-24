// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const wallet1 = localStorage.getItem('wallet1');
const wallet2 = localStorage.getItem('wallet2');
const eliminado = localStorage.getItem('eliminado');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    //lanzo el toaster que avise al usuario de la accion realizada
    if (eliminado) {
        // Llamar a showToast
        showToast('Transportista eliminado existosamente.');
        localStorage.removeItem('eliminado');
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
    fetch(window.myAppConfig.production + '/manager/getCarriers', {
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
                let status = item.status_capacity;
                let textStatus;
                if(status == 'Libre'){
                    textStatus = `<span style="color: #22bb33">${status}</span>`;
                } else if(status == 'Parcial'){
                    textStatus = `<span style="color: #f0ad4e">${status}</span>`;
                } else if(status == 'Ocupado'){
                    textStatus = `<span style="color: #bb2124">${status}</span>`;
                }
                dataTable.row.add([
                    item.id_carrier,
                    item.number_document_carrier,
                    item.name_carrier,
                    item.last_name_carrier,
                    item.description_tc,
                    textStatus,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="detalle(${item.id_carrier})"><i class="fa-solid fa-magnifying-glass"></i></button>
                        <button type="button" id="btnEdit" class="enlaces" onClick="editar(${item.id_carrier})"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button type="button" id="btnDelete" class="enlaces" onClick="eliminar(${item.id_carrier})"><i class="fa-solid fa-trash"></i></button>
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
function detalle(id_carrier) {
    window.location = "./detail_carrier.html?id_carrier=" + id_carrier;
}

//Metodo para eliminar el paquete.
function eliminar(id_carrier) {
    // alert confirm para que el usuario confirme si efecrtivamente quiere eliminar el paquete
    let result = confirm("¿Estas seguro que deseas eliminar este paquete?, confirmar antes de aceptar.");
    // Si la confirmacion es positiva
    if (result) {
        console.log(id_carrier)
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/deleteCarrier', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_carrier
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

//Metodo para editar el paquete.
function editar(id_carrier) {
    window.location = './edit_carrier.html?id_carrier=' + id_carrier;
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