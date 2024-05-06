// capturo las variables de entorno que puedo necesitar
const urlParams = new URLSearchParams(window.location.search);
const id_store = urlParams.get('id_store');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const token = localStorage.getItem('token');
const wallet = localStorage.getItem('wallet');

// Obtener el elemento select de departamento
var selectDepartamento = document.getElementById('departamentoP');
// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    // Formatear el valor como moneda
    let valorFormateado1 = wallet.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });
    // i select wallet component
    const walletElement1 = document.querySelector('.wallet');
    // To asignate wallet value
    walletElement1.textContent = valorFormateado1;
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

                    selectDepartments.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/getTypePackage', {
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
                var selectTypePackage = document.querySelector('select[name="fk_id_tp_p"]');
                // Obtener el listado de documentos disponibles (suponiendo que esté en una variable llamada documentosDisponibles)
                var types = data.data;
                // Limpiar el select
                selectTypePackage.innerHTML = '';

                var option = document.createElement('option');
                option.value = '';
                option.textContent = `-- SELECCIONAR --`;
                selectTypePackage.appendChild(option);
                // Iterar sobre los documentos disponibles y agregar opciones al select
                types.forEach(function (type) {
                    var option = document.createElement('option');
                    option.value = type.id_tp;
                    option.textContent = `${type.description_tp}`;

                    selectTypePackage.appendChild(option);
                });
            }
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/getProductsByDropshipper', {
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
                dataTable.row.add([
                    item.id_product,
                    item.name_product,
                    item.description_product,
                    item.size_product,
                    item.price_cost_product,
                    item.price_sale_product,
                    `<input type="checkbox" name="seleccionProductos" value="${item.id_product}" onchange="habilitarCantidad(this)">
                     <input type="number" min="1" class="cantidad" id="cant${item.id_product}" disabled style="width: 60px;">`
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

document.getElementById('btnAgregar').addEventListener('click', function (e) {
    e.preventDefault();
    let orden_p = document.getElementById('orden_p').value;
    let guide_number_p = document.getElementById('guide_number_p').value;
    let with_collection_p = document.getElementById('with_collection_p').value;
    let profit_carrier_p = document.getElementById('profit_carrier_p').value;
    let profit_carrier_inter_city_p = document.getElementById('profit_carrier_inter_city_p').value;
    let profit_dropshipper_p = document.getElementById('profit_dropshipper_p').value;
    let total_price_p = document.getElementById('total_price_p').value;
    let fk_id_tp_p = document.getElementById('fk_id_tp_p').value;
    let fk_id_destiny_city_p = document.getElementById('ciudadP').value;
    let fk_id_store_p = id_store;
    let direction_client_p = document.getElementById('direction_client_p').value;
    let comments_p = document.getElementById('comments_p').value;
    let name_client_p = document.getElementById('name_client_p').value;
    let phone_number_client_p = document.getElementById('phone_number_client_p').value;
    let email_client_p = document.getElementById('email_client_p').value;
    const checkboxesSeleccionados = document.querySelectorAll('input[name="seleccionProductos"]:checked');
    // valido que todo este lleno
    if (orden_p && guide_number_p && with_collection_p && profit_carrier_p && profit_carrier_inter_city_p && profit_dropshipper_p && total_price_p && fk_id_tp_p && fk_id_destiny_city_p && fk_id_store_p && direction_client_p && comments_p && name_client_p && phone_number_client_p && email_client_p && checkboxesSeleccionados.length > 0) {
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/addPackage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                orden_p,
                guide_number_p,
                with_collection_p,
                profit_carrier_p,
                profit_carrier_inter_city_p,
                profit_dropshipper_p,
                total_price_p,
                direction_client_p,
                comments_p,
                name_client_p,
                phone_number_client_p,
                email_client_p,
                fk_id_tp_p,
                fk_id_destiny_city_p,
                fk_id_store_p
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
                    let fk_id_p_pp = data.data.id_p;
                    //capturo los checks
                    let products = [];

                    checkboxesSeleccionados.forEach(function (checkbox) {
                        let cantidad = document.getElementById('cant'+ checkbox.value).value;
                        products.push({
                            id_producto: parseInt(checkbox.value),
                            cuantity_pp: cantidad
                        });
                    });

                    const datosAsignacion = {
                        fk_id_p_pp,
                        products
                    };
                    //Ahora consumo el endpoint para agrearle los productos al paquete
                    fetch(window.myAppConfig.production + '/manager/addProductToPackage', {
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
                                localStorage.setItem('agregado', true);
                                window.location = 'detail_store.html?id_dropshipper=' + id_dropshipper + '&id_store=' + id_store;
                            }
                        })
                        .catch(error => {
                            console.error('Error en la solicitud:', error);
                            alert('Ocurrió un error al asignar los paquetes.');
                        });
                }
            })
            .catch(error => {
                console.error('Error en la petición Fetch:', error);
            });
    }
});

// Escuchar el evento de cambio en el select de departamento
selectDepartamento.addEventListener('change', function () {
    // Cargar las ciudades relacionadas con el departamento seleccionado
    cargarCiudades();
});

// Función para cargar las ciudades basadas en el departamento seleccionado
function cargarCiudades() {
    let departamentoSeleccionado = document.getElementById('departamentoP').value;
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
                var selectCiudades = document.getElementById('ciudadP');
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

// Escuchar eventos de clic en los checkboxes
function habilitarCantidad(checkbox) {
    // Encuentra el campo de entrada de cantidad correspondiente al checkbox
    var inputCantidad = checkbox.nextElementSibling;

    // Habilita o deshabilita el campo de entrada basado en el estado del checkbox
    if (checkbox.checked) {
        inputCantidad.disabled = false;
    } else {
        inputCantidad.disabled = true;
        inputCantidad.value = ''; // Limpiar el valor si deseleccionan el producto
    }
}
