// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const wallet = localStorage.getItem('wallet');
// Obtener la URL actual
// Crear un objeto URLSearchParams
// Acceder al parámetro específico
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id_p = urlParams.get('id_p');
// ids de los productos que necesito para seleccionar en al tabla
var id_products = [];
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
    fetch(window.myAppConfig.production + '/dropshipper/detailPackage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_p
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
            //Capturo el tipo de envio
            let type_send = data.data.fk_id_tp_p;
            //capturo el status del paquete, el estado y el id de circulo tienen el mismo numero, por eso
            let status = data.data.status_p;
            //estructura condicional para saber que timline mostrar el local o nacional
            if (type_send == 1) {
                document.getElementById('local').classList.remove('none');
                //busco el id correcpondiente al stado y lo pinto con la clase active.
                if (status != 0 && status != 6) {
                    document.getElementById(status).classList.add('active');
                } else if (status == 6) {
                    document.getElementById(status).classList.add('entregadoStatus');
                }
                //muestro los estados disponibles para queno haya errores 
                document.getElementById('s0').classList.remove('none');
                document.getElementById('s1').classList.remove('none');
                document.getElementById('s7').classList.remove('none');
                document.getElementById('s4').classList.remove('none');
                document.getElementById('s5').classList.remove('none');
                document.getElementById('s6').classList.remove('none');
            } else if (type_send == 2) {
                document.getElementById('nacional').classList.remove('none');
                //busco el id correcpondiente al stado y lo pinto con la clase active.
                if (status != 0 && status != 6) {
                    document.getElementById('N' + status).classList.add('active');
                } else if (status == 6) {
                    document.getElementById('N' + status).classList.add('entregadoStatus');
                }
                //muestro los estados disponibles para queno haya errores 
                document.getElementById('s0').classList.remove('none');
                document.getElementById('s1').classList.remove('none');
                document.getElementById('s7').classList.remove('none');
                document.getElementById('s2').classList.remove('none');
                document.getElementById('s3').classList.remove('none');
                document.getElementById('s4').classList.remove('none');
                document.getElementById('s5').classList.remove('none');
                document.getElementById('s6').classList.remove('none');
            }
            document.querySelector('input[name="id_p"]').value = data.data.id_p;
            document.querySelector('input[name="name_client"]').value = data.data.name_client_p;
            document.querySelector('input[name="direction_client"]').value = data.data.direction_client_p;
            document.querySelector('input[name="phone_number_client"]').value = data.data.phone_number_client_p;
            document.querySelector('input[name="email_client"]').value = data.data.email_client_p;
            document.querySelector('input[name="orden_number"]').value = `${data.data.orden_p}`;
            // Obtener la fecha actual y crear un objeto Date
            var fecha = new Date(data.data.createdAt);

            // Obtener los componentes de la fecha
            var dia = fecha.getDate();
            var mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
            var anio = fecha.getFullYear();

            // Asegurarse de que los componentes de la fecha tengan dos dígitos
            if (dia < 10) {
                dia = '0' + dia;
            }
            if (mes < 10) {
                mes = '0' + mes;
            }

            // Formatear la fecha en el formato YYYY-MM-DD
            var fechaFormateada = anio + '-' + mes + '-' + dia;

            // Asignar la fecha formateada al input de tipo date
            document.querySelector('input[name="order_date"]').value = fechaFormateada;
            document.querySelector('select[name="status_p"]').value = data.data.status_p;
            document.querySelector('input[name="guide_number"]').value = data.data.guide_number_p;

            // Obtener el ID del transportista
            var idCarrier = data.data.carrier ? data.data.carrier.id_carrier : 0;
            var city = data.data.store.city.id_city;
            // Obtener el listado de transportistas disponibles (suponiendo que esté en una variable llamada transportistasDisponibles)
            obtenerCarrier(idCarrier, city);
            //continuo con los siguientes datos
            document.querySelector('select[name="type_of_shipping"]').value = data.data.with_collection_p;
            //Estructura condicional y creacion de los nodos correspondientes, si el tipo de envio del paquete es nacional se muestran las direcciones de las centrales, ciduda y departamento respectivo con el diseño mockup definido
            if (type_send === 2) {
                // Selecciona el elemento .izq .p_wpp
                var elemento1 = document.querySelector('.address .izq p:nth-child(1)');
                var elemento2 = document.querySelector('.address .izq p:nth-child(2)');
                var elemento3 = document.querySelector('.address .der p:nth-child(1)');
                var elemento4 = document.querySelector('.address .der p:nth-child(2)');
                // Crea un elemento span 1
                var span1 = document.createElement('span');
                span1.classList.add('morado');
                span1.textContent = `${data.data.store.city.central_warehouses[0].direction_cw}`;
                elemento1.textContent = '';
                elemento1.appendChild(document.createTextNode(`Dirección B.C Origen: `));
                elemento1.appendChild(span1);
                // Crea un elemento span 2
                var span2 = document.createElement('span');
                span2.classList.add('morado');
                span2.textContent = `${data.data.city.central_warehouses[0].direction_cw}`;
                elemento2.textContent = '';
                elemento2.appendChild(document.createTextNode(`Dirección B.C Destino: `));
                elemento2.appendChild(span2);
                // Crea un elemento span 3
                var span3 = document.createElement('span');
                span3.classList.add('morado');
                span3.textContent = `${data.data.store.city.name_city} - ${data.data.store.city.department.name_d}`;
                elemento3.textContent = '';
                elemento3.appendChild(document.createTextNode(`Ciudad Origen: `));
                elemento3.appendChild(span3);
                // Crea un elemento span 4
                var span4 = document.createElement('span');
                span4.classList.add('morado');
                span4.textContent = `${data.data.city.name_city} - ${data.data.city.department.name_d}`;
                elemento4.textContent = '';
                elemento4.appendChild(document.createTextNode(`Ciudad Destino: `));
                elemento4.appendChild(span4);
            }
            //recorro los productos y los guardo en un array
            data.data.package_products.forEach((product, index) => {
                id_products.push({
                    id_product: product.product.id_product,
                    Quantity: product.cuantity_pp
                })
            });
            //estructura condicional para verificar si esta entregado o cancelado
            if (status === 0) {
                // Selecciona el elemento .izq .p_wpp
                var elemento = document.querySelector('.extra');
                // Crea un elemento
                var span = document.createElement('span');
                span.classList.add('cancelado');
                span.textContent = `CANCELADO`
                elemento.appendChild(span);
            } else if (status === 6) {
                // Selecciona el elemento .izq .p_wpp
                var elemento = document.querySelector('.extra');
                // Crea un elemento
                var span = document.createElement('span');
                span.classList.add('entregado');
                span.textContent = `ENTREGADO`
                elemento.appendChild(span);
            }
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
                        // Agregar el producto a la tabla
                        const newRow = [
                            item.id_product,
                            item.name_product,
                            item.description_product,
                            item.size_product,
                            item.price_cost_product.toLocaleString('es-CO', {
                                style: 'currency',
                                currency: 'COP'
                            }),
                            item.price_sale_product.toLocaleString('es-CO', {
                                style: 'currency',
                                currency: 'COP'
                            }),
                            `<input type="checkbox" name="seleccionProductos" id="seleccionProductos_${item.id_product}" value="${item.id_product}" onchange="habilitarCantidad(this, cant${item.id_product})" data-price="${item.price_sale_product}" data-cost="${item.price_cost_product}">`,
                            `<input type="number" class="cantidad" id="cant${item.id_product}" disabled style="width: 60px;">`
                        ];
                        // Si el producto está en id_products, seleccionar el checkbox y establecer la cantidad
                        id_products.forEach(element => {
                            if (element.id_product == item.id_product) {
                                newRow[6] = newRow[6].replace('>', ' checked>'); // Marcar el checkbox
                                // Si el producto está en id_products, habilitar el input de cantidad y establecer el valor en el input de tipo número
                                newRow[7] = newRow[7].replace('disabled', ''); // Habilitar el input de cantidad
                                newRow[7] = newRow[7].replace('>', `value="${element.Quantity}">`)

                                // Si el producto está en id_products, marcar el checkbox correspondiente
                            }
                        });

                        dataTable.row.add(newRow).draw();
                    });
                })
                .catch(error => {
                    console.error('Error en la petición Fetch:', error);
                });

        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});
// edit package button click event
document.getElementById('formDataCenterPackage').addEventListener('submit', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const id_p = document.getElementById('id_p').value;
    const name_client_p = document.getElementById('name_client').value;
    const direction_client_p = document.getElementById('direction_client').value;
    const phone_number_client_p = document.getElementById('phone_number_client').value;
    const email_client_p = document.getElementById('email_client').value;
    const orden_p = document.getElementById('orden_number').value;
    const createdAt = document.getElementById('order_date').value;
    const status_p = document.getElementById('status_p').value;
    const guide_number_p = document.getElementById('guide_number').value;
    const carrierElement = document.getElementById('carrier');
    const carrier = carrierElement.value !== '0' ? carrierElement.value : null;
    const with_collection_p = document.getElementById('type_of_shipping').value;
    const checkboxesSeleccionados = document.querySelectorAll('input[name="seleccionProductos"]:checked');
    // Make the HTTP request to log in
    fetch(window.myAppConfig.production + `/dropshipper/editPackage/${id_p}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            name_client_p,
            direction_client_p,
            phone_number_client_p,
            email_client_p,
            orden_p,
            createdAt,
            status_p,
            guide_number_p,
            with_collection_p,
            fk_id_carrier_p: carrier
        })
    })
        .then(response => {
            // Check if the request was successful
            if (response.ok) {
                // Extract token from response
                return response.json();
            } else {
                throw new Error('Error: algo salio mal');
            }
        })
        .then(data => {
            console.log(data)
            if (data.result == 1) {
                let fk_id_p_pp = data.getPackage.id_p;
                //capturo los checks
                let products = [];

                checkboxesSeleccionados.forEach(function (checkbox) {
                    let cantidad = document.getElementById('cant' + checkbox.value).value;
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
                fetch(window.myAppConfig.production + '/dropshipper/editProductToPackage', {
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
                            window.location = 'detail_package.html?id_p=' + fk_id_p_pp;
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud:', error);
                        alert('Ocurrió un error al asignar los paquetes.');
                    });
            }
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de editar:', error.message);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnRegresar').addEventListener('click', function () {
    window.location = "./detail_package.html?id_p=" + id_p;
});
/*
===================================================================
                            Funciones
===================================================================
*/
// Añadir evento al botón regresar si es necesario
function regresar() {
    window.location = "./detail_package.html?id_p=" + id_p;
};
//obtener los carriers de la ciudad
function obtenerCarrier(idCarrier, city) {
    // Make the HTTP request to log in
    fetch(window.myAppConfig.production + '/dropshipper/getCarriers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            city
        })
    })
        .then(response => {
            // Check if the request was successful
            if (response.ok) {
                // Extract token from response
                return response.json();
            } else {
                // If the request was not successful, display an error message
                throw new Error('Credenciales inválidas');
            }
        })
        .then(data => {
            if (data.result == 1) {
                // Obtener el elemento select
                var selectCarrier = document.querySelector('select[name="carrier"]');
                // Obtener el listado de transportistas disponibles (suponiendo que esté en una variable llamada transportistasDisponibles)
                var transportistasDisponibles = data.data;
                // Limpiar el select
                selectCarrier.innerHTML = '';

                var option = document.createElement('option');
                option.value = '0';
                option.textContent = `-- SELECCIONAR --`;
                selectCarrier.appendChild(option);
                // Iterar sobre los transportistas disponibles y agregar opciones al select
                transportistasDisponibles.forEach(function (transportista) {
                    var option = document.createElement('option');
                    option.value = transportista.id_carrier;
                    option.textContent = `${transportista.id_carrier} - ${transportista.name_carrier} ${transportista.last_name_carrier}`;

                    // Si el ID del transportista coincide con el ID del transportista seleccionado, marcarlo como seleccionado
                    if (transportista.id_carrier === idCarrier) {
                        option.selected = true;
                    }

                    selectCarrier.appendChild(option);
                });
            }
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de obtener carrier:', error.message);
        });
}
// Escuchar eventos de clic en los checkboxes
function habilitarCantidad(checkbox, inputCantidad) {
    // Habilita o deshabilita el campo de entrada basado en el estado del checkbox
    if (checkbox.checked) {
        inputCantidad.disabled = false;
    } else {
        inputCantidad.disabled = true;
        inputCantidad.value = ''; // Limpiar el valor si deseleccionan el producto
    }
}