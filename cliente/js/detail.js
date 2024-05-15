// Obtener la URL actual
// Crear un objeto URLSearchParams
// Acceder al parámetro específico
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const guia = urlParams.get('guia');
// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/client/getPackageGuide', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            guide_number_p: guia,
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
            //pongo los datos del cliente en la parte izquierda
            document.querySelector('.izq p:nth-child(2)').textContent = data.data.name_client_p;
            document.querySelector('.izq p:nth-child(3)').textContent = data.data.direction_client_p;
            // Selecciona el elemento .izq .p_wpp
            var elementoWpp = document.querySelector('.izq .p_wpp');
            // Crea un espacio de texto para separar el icono del número de teléfono
            var espacioDeTexto = document.createTextNode(' ');
            // Borra el contenido actual del elemento .p_wpp
            elementoWpp.textContent = '';
            // Agrega el número de teléfono seguido del icono de WhatsApp al elemento .p_wpp
            elementoWpp.appendChild(document.createTextNode(`Tel: ${data.data.phone_number_client_p}`));
            elementoWpp.appendChild(espacioDeTexto); // Agrega el espacio de texto
    
            //sigo colocando los datos faciles como el email
            document.querySelector('.izq p:nth-child(5)').textContent = `Email: ${data.data.email_client_p}`;
            document.querySelector('.der .orden').textContent = `Orden #${data.data.orden_p}`;
            document.querySelector('.der p:nth-child(2)').textContent = `Fecha de la orden: ${new Date(data.data.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`;
            //estructura para validar el estado del paquete y mostrar algo bonito
            let statusText;
            switch (data.data.status_p) {
                case 0:
                    statusText = "CANCELADO";
                    break;
                case 1:
                    statusText = "Bodega Comercio";
                    break;
                case 2:
                    statusText = "Bodega central origen";
                    break;
                case 3:
                    statusText = "En camino entre bodegas centrales";
                    break;
                case 4:
                    statusText = "En bodega central destino";
                    break;
                case 5:
                    statusText = "En camino a entrega final";
                    break;
                case 6:
                    statusText = "Entregado";
                    break;
                case 7:
                    statusText = "En camino de Bodega Comercio a bodega central";
                    break;
            }
            document.querySelector('.der p:nth-child(3)').textContent = `Estado: ${statusText}`;
            //continuo colocando datos faciles
            document.querySelector('.der p:nth-child(4)').textContent = `Número de guia: ${data.data.guide_number_p}`;
            //Estrucuta condicional por si no tiene transporitsta asignado
            if (data.data.carrier != null) {
                document.querySelector('.der p:nth-child(5)').textContent = `Transportista: ${data.data.carrier.name_carrier} ${data.data.carrier.last_name_carrier}`;
            } else {
                document.querySelector('.der p:nth-child(5)').textContent = `Transportista: N/A`;
            }
            // expongo eltipó de envio
            document.querySelector('.der p:nth-child(6)').textContent = `Tipo de envio: ${data.data.with_collection_p === 1 ? "CON RECAUDO" : "SIN RECAUDO"}`;
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
            //aqui vamos a rellenar los data tables
            const productsTable = document.querySelector('.table-wrapper table tbody');
            productsTable.innerHTML = ''; // Clear existing rows
            // Calcula los totales
            let totalVenta = 0;
            let totalCosto = 0;
            data.data.package_products.forEach(product => {
                const row = `
                <tr>
                    <td>${product.product.id_product}</td>
                    <td>${product.product.name_product}</td>
                    <td>${product.product.description_product}</td>
                    <td>${product.product.size_product}</td>
                    <td>${product.cuantity_pp}</td>
                </tr>
            `;
                productsTable.innerHTML += row;
                totalVenta += product.product.price_sale_product * product.cuantity_pp;
            });

            // Agrega los totales al final de la tabla
            const footerRow = `
            <tr>
                <td colspan="3"></td>
                <td>Total Neto:</td>
                <td>${(totalVenta + data.data.profit_carrier_p).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            </tr>
        `;

            // Agrega los totales al final de la tabla
            productsTable.innerHTML += footerRow;
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});