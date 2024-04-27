// capturo las variables de entorno que puedo necesitar
const urlParams = new URLSearchParams(window.location.search);
const id_store = urlParams.get('id_store');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const wallet1 = localStorage.getItem('wallet1');
const wallet2 = localStorage.getItem('wallet2');
// busco todos los campos para poder enviarlos en el formulario de registro del dropshiiper
const direccion = document.getElementById('direccion');
const ciudad = document.getElementById('ciudad');
const departamento = document.getElementById('departamento');
const telefono = document.getElementById('telefono');
const capacidad = document.getElementById('capacidad');
// Obtener el elemento select de departamento
var selectDepartamento = document.getElementById('departamento');
// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
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
    fetch(window.myAppConfig.production + '/manager/getPackagesByStore', {
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
            //inserto los datos del droshipper
            direccion.value = data.data.direction_store;
            telefono.value = data.data.phone_number_store;
            capacidad.value = data.data.capacity_store;
            //capturo los ids para ponerlos en el select
            let id_d = data.data.city.department.id_d;
            let id_city = data.data.city.id_city;
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
                        var selectDepartments = document.querySelector('select[name="departamento"]');
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

                            // Si el ID del documento coincide con el ID del documento seleccionado, marcarlo como seleccionado
                            if (departamento.id_d === id_d) {
                                option.selected = true;
                            }

                            selectDepartments.appendChild(option);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error en la petición Fetch:', error);
                });
            // Realizar la petición Fetch al endpoint de ciudades basadas en el departamento seleccionado
            fetch(window.myAppConfig.production + '/manager/getCitiesByDepartment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fk_id_d_city: id_d
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
                        var selectCiudades = document.getElementById('ciudad');
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
                            // Si el ID del documento coincide con el ID del documento seleccionado, marcarlo como seleccionado
                            if (ciudad.id_city === id_city) {
                                option.selected = true;
                            }
                            selectCiudades.appendChild(option);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error en la petición Fetch:', error);
                });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón editar
document.getElementById('btnEditar').addEventListener('click', function () {
    // capturo los datos que necesito
    let direction_store = direccion.value;
    let phone_number_store = telefono.value;
    let capacity_store = capacidad.value;
    let fk_id_city_store = document.getElementById('ciudad').value;
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/editStore/' + id_store, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            direction_store,
            phone_number_store,
            capacity_store,
            fk_id_city_store,
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
                localStorage.setItem('editado', true);
                // Redirect to home page
                window.location = './detail_store.html?id_store=' + id_store;
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    window.location = './detail_store.html?id_store=' + id_store;
});

// Escuchar el evento de cambio en el select de departamento
selectDepartamento.addEventListener('change', function () {
    // Cargar las ciudades relacionadas con el departamento seleccionado
    cargarCiudades();
});

// Función para cargar las ciudades basadas en el departamento seleccionado
function cargarCiudades() {
    let departamentoSeleccionado = document.getElementById('departamento').value;
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
                var selectCiudades = document.getElementById('ciudad');
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