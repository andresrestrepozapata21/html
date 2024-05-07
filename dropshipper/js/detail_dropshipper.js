// capturo las variables de entorno que puedo necesitar
const id_dropshipper = localStorage.getItem('id_dropshipper');
const token = localStorage.getItem('token');
const wallet = localStorage.getItem('wallet');
// variables adicionestes
const eliminado = localStorage.getItem('eliminado');
const eliminadoStore = localStorage.getItem('eliminadoStore');
const editado = localStorage.getItem('editado');
const agregado = localStorage.getItem('agregado');
// busco todos los campos para poder enviarlos en el formulario de registro del dropshiiper
const tipoDocumento = document.getElementById('tipoDocumento');
const numeroDocumento = document.getElementById('numeroDocumento');
const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const telefono = document.getElementById('telefono');
const email = document.getElementById('email');
const password = document.getElementById('password');
// Obtener el elemento select de departamento
var selectDepartamento = document.getElementById('departamentoB');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    //lanzo el toaster que avise al usuario de la accion realizada
    if (eliminado) {
        // Llamar a showToast
        showToast('Dropshipper eliminado existosamente.');
        localStorage.removeItem('eliminado');
    } else if (editado) {
        // Llamar a showToast
        showToast('Dropshipper editado existosamente.');
        localStorage.removeItem('editado');
    } else if (agregado) {
        // Llamar a showToast
        showToast('Bodega agregada existosamente.');
        localStorage.removeItem('agregado');
    } else if (eliminadoStore) {
        // Llamar a showToast
        showToast('Bodega eliminada existosamente.');
        localStorage.removeItem('eliminadoStore');
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
            //inserto los datos del droshipper
            tipoDocumento.value = data.data.tipo_documento;
            numeroDocumento.value = data.data.numero_documento;
            nombre.value = data.data.name_dropshipper;
            apellido.value = data.data.last_name_dropshipper;
            telefono.value = data.data.phone_number_dropshipper;
            email.value = data.data.email_dropshipper;
            password.value = data.data.password_dropshipper;

            // Procesar los datos y llenar la tabla
            const dataTable = $('#dataTable').DataTable();
            // ciclo para ver el estado del paquete y mostrarlo en color
            data.data.stores.forEach(item => {
                dataTable.row.add([
                    item.id_store,
                    item.direction_store + " - " + item.city.name_city + " - " + item.city.department.name_d,
                    item.phone_number_store,
                    item.capacity_store,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="detalle(${item.id_store})"><i class="fa-solid fa-magnifying-glass"></i></button>
                        <button type="button" id="btnEdit" class="enlaces" onClick="editarStore(${item.id_store})"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button type="button" id="btnDelete" class="enlaces" onClick="eliminarStore(${item.id_store})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    `
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/getDepartments', {
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
                var selectDepartments = document.querySelector('select[name="departamentoB"]');
                // Obtener el listado de documentos disponibles (suponiendo que esté en una variable llamada documentosDisponibles)
                var departaments = data.data;
                // Limpiar el select
                selectDepartments.innerHTML = '';

                var option = document.createElement('option');
                option.value = '';
                option.textContent = `-- SELECCIONAR --`;
                selectDepartments.appendChild(option);
                // Iterar sobre los documentos disponibles y agregar opciones al select
                departaments.forEach(function (departamento) {
                    var option = document.createElement('option');
                    option.value = departamento.id_d;
                    option.textContent = `${departamento.name_d}`;
                    selectDepartments.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

document.getElementById('btnAgregar').addEventListener('click', function (e) {
    e.preventDefault();
    const direction_store = document.getElementById('direccionB').value;
    const phone_number_store = document.getElementById('telefonoB').value;
    const capacity_store = document.getElementById('capacidadB').value;
    const fk_id_city_store = document.getElementById('ciudadB').value;
    const fk_id_dropshipper_store = id_dropshipper;

    if (direction_store && phone_number_store && capacity_store && fk_id_city_store && fk_id_dropshipper_store) {
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/addStore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                direction_store,
                phone_number_store,
                capacity_store,
                fk_id_city_store,
                fk_id_dropshipper_store
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
                    localStorage.setItem('agregado', true);
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error en la petición Fetch:', error);
            });
    }
});

document.getElementById('btnEdit').addEventListener('click', function () {
    window.location = './edit_dropshipper.html?id_dropshipper=' + id_dropshipper;
});

// Escuchar el evento de cambio en el select de departamento
selectDepartamento.addEventListener('change', function () {
    // Cargar las ciudades relacionadas con el departamento seleccionado
    cargarCiudades();
});

//Metodo para mostrar los detelles del paquete.
function detalle(id_store) {
    window.location = './detail_store.html?id_store=' + id_store;
}

//Metodo para eliminar el paquete.
function eliminarStore(id_store) {
    // alert confirm para que el usuario confirme si efecrtivamente quiere eliminar el paquete
    let result = confirm("¿Estas seguro que deseas eliminar esta bodega?, confirmar antes de aceptar.");
    // Si la confirmacion es positiva
    if (result) {
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/deleteStore', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_store
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
                    localStorage.setItem('eliminadoStore', true);
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
function editarStore(id_store) {
    window.location = './edit_store.html?id_store=' + id_store;
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

// Función para cargar las ciudades basadas en el departamento seleccionado
function cargarCiudades() {
    var departamentoSeleccionado = document.getElementById('departamentoB').value;
    // Realizar la petición Fetch al endpoint de ciudades basadas en el departamento seleccionado
    fetch(window.myAppConfig.production + '/manager/getCitiesByDepartment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            fk_id_d_city: departamentoSeleccionado
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
                var selectCiudades = document.getElementById('ciudadB');
                // Limpiar el select de ciudades
                selectCiudades.innerHTML = '';
                // Crear la opción por defecto
                var optionDefault = document.createElement('option');
                optionDefault.value = '';
                optionDefault.textContent = `-- SELECCIONAR --`;
                selectCiudades.appendChild(optionDefault);
                // Iterar sobre las ciudades y agregarlas al select
                data.data.forEach(function (ciudad) {
                    var option = document.createElement('option');
                    option.value = ciudad.id_city;
                    option.textContent = `${ciudad.name_city}`;
                    selectCiudades.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
}