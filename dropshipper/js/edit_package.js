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
            } else if (type_send == 2) {
                document.getElementById('nacional').classList.remove('none');
                //busco el id correcpondiente al stado y lo pinto con la clase active.
                if (status != 0 && status != 6) {
                    document.getElementById('N' + status).classList.add('active');
                } else if (status == 6) {
                    document.getElementById('N' + status).classList.add('entregadoStatus');
                }
            }
            document.querySelector('input[name="name_client"]').value = data.data.name_client_p;
            document.querySelector('input[name="direction_client"]').value = data.data.direction_client_p;
            document.querySelector('input[name="phone_number_client"]').value = data.data.phone_number_client_p;
            document.querySelector('input[name="email_client"]').value = data.data.email_client_p;
            document.querySelector('input[name="orden_number"]').value = `Orden #${data.data.orden_p}`;
            document.querySelector('input[name="order_date"]').value = new Date(data.data.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
            document.querySelector('select[name="status_p"]').value = data.data.status_p;
            document.querySelector('input[name="guide_number"]').value = data.data.guide_number_p;
            document.querySelector('input[name="carrier_name"]').value = data.data.carrier ? `${data.data.carrier.name_carrier} ${data.data.carrier.last_name_carrier}` : 'N/A';
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
            //aqui vamos a rellenar los data product
            const productsContent = document.getElementById('component_products');

            data.data.package_products.forEach(product => {
                const row = `
                <div class="info-section">
                        <h2>Producto</h2>
                        <div class="form-row1">
                            <div class="form-group1">
                                <label>Producto</label>
                                <input type="text" id="id_product_pp" name="id_product_pp" style="cursor: not-allowed;" value="${product.product.id_product} - ${product.product.description_product} - ${product.product.size_product} - ${product.product.price_cost_product.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })} - ${product.product.price_sale_product.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}" readonly>
                            </div>
                            <div class="form-group1">
                                <label>Cantidad:</label>
                                <input type="text" id="cuantity_pp" value="${product.cuantity_pp}">
                            </div>
                        </div>
                    </div>
            `;
                productsContent.innerHTML += row;
            });
            productsContent.innerHTML += `
                <div class="form-group">
                    <button type="submit" id="btnEditar">Guardar</button>
                    <button type="button" id="btnRegresar">Recargar</button>
                </div>
            `;
            //estructura condicional para verificar si esta entregado o cancelado
            if (status === 0) {
                // Selecciona el elemento .izq .p_wpp
                var elemento = document.querySelector('.der .extra');
                // Crea un elemento
                var span = document.createElement('span');
                span.classList.add('cancelado');
                span.textContent = `CANCELADO`
                elemento.appendChild(span);
            } else if (status === 6) {
                // Selecciona el elemento .izq .p_wpp
                var elemento = document.querySelector('.der .extra');
                // Crea un elemento
                var span = document.createElement('span');
                span.classList.add('entregado');
                span.textContent = `Fecha de entrega: ${new Date(fecha_de_entrega).toLocaleString('es-CO')}`
                elemento.appendChild(span);
            }

        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});
