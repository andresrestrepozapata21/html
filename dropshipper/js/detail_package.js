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
            //capturo el status del paquete, el estado y el id de circulo tienen el mismo numero, por eso
            let status = data.data.status_p;
            //busco el id correcpondiente al stado y lo pinto con la clase active.
            document.getElementById(status).classList.add('active');
            //pongo los datos del cliente en la parte izquierda
            document.querySelector('.izq p:nth-child(2)').textContent = data.data.name_client_p;
            document.querySelector('.izq p:nth-child(3)').textContent = data.data.direction_client_p;
            // Selecciona el elemento .izq .p_wpp
            var elementoWpp = document.querySelector('.izq .p_wpp');
            // Crea un elemento <i> para el icono de WhatsApp
            var iconoWpp = document.createElement('i');
            iconoWpp.classList.add('fab', 'fa-whatsapp'); // Agrega las clases necesarias para el icono de WhatsApp
            // Crea un espacio de texto para separar el icono del número de teléfono
            var espacioDeTexto = document.createTextNode(' ');
            // Borra el contenido actual del elemento .p_wpp
            elementoWpp.textContent = '';
            // Agrega el número de teléfono seguido del icono de WhatsApp al elemento .p_wpp
            elementoWpp.appendChild(document.createTextNode(`Tel: ${data.data.phone_number_client_p}`));
            elementoWpp.appendChild(espacioDeTexto); // Agrega el espacio de texto
            elementoWpp.appendChild(iconoWpp); // Agrega el icono de WhatsApp
            // Agrega un evento de clic al icono de WhatsApp
            iconoWpp.addEventListener('click', function () {
                // Reemplaza '123456789' con el número de teléfono deseado
                var numeroTelefono = data.data.phone_number_client_p;
                // Crea el enlace para iniciar un chat de WhatsApp con el número de teléfono
                var enlaceWhatsapp = `https://wa.me/${numeroTelefono}`;
                // Abre el enlace en una nueva pestaña
                window.open(enlaceWhatsapp);
            });
            //sigo colocando los datos faciles como el email
            document.querySelector('.izq p:nth-child(5)').textContent = `Email: ${data.data.email_client_p}`;
            document.querySelector('.der .orden').textContent = `Orden #${data.data.orden_p}`;
            document.querySelector('.der p:nth-child(2)').textContent = `Fecha de la orden: ${new Date(data.data.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`;
            //estructura para validar el estado del paquete y mostrar algo bonito
            let statusText;
            switch (data.data.status_p) {
                case 1:
                    statusText = "Bodega dropshipper";
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
                    statusText = "En camino de bodega dropshipper a bodega central";
                    break;
            }
            document.querySelector('.der p:nth-child(3)').textContent = `Estado: ${statusText}`;
            //continuo colocando datos faciles
            document.querySelector('.der p:nth-child(4)').textContent = `Número de guia: ${data.data.guide_number_p}`;
            document.querySelector('.der p:nth-child(5)').textContent = `Transportista: ${data.data.carrier.name_carrier} ${data.data.carrier.last_name_carrier}`;
            document.querySelector('.der p:nth-child(6)').textContent = `Tipo de envio: ${data.data.with_collection_p === 1 ? "CON RECAUDO" : "SIN RECAUDO"}`;
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
            <td>${product.product.price_cost_product.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            <td>${product.product.price_sale_product.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            <td>${product.cuantity_pp}</td>
            <td>${(product.product.price_sale_product * product.cuantity_pp).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
        </tr>
    `;
                productsTable.innerHTML += row;
                totalVenta += product.product.price_sale_product * product.cuantity_pp;
                totalCosto += product.product.price_cost_product * product.cuantity_pp;
            });

            // Agrega los totales al final de la tabla
            const footerRow = `
    <tr>
        <td colspan="6"></td>
        <td>Costo de Envio:</td>
        <td>${data.data.profit_carrier_p.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
    </tr>
    <tr>
        <td colspan="6"></td>
        <td>Ganancia:</td>
        <td>${data.data.profit_dropshipper_p.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
    </tr>
    <tr>
        <td colspan="6"></td>
        <td>Total Costo:</td>
        <td>${totalCosto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
    </tr>
    <tr>
        <td colspan="6"></td>
        <td>Total Neto:</td>
        <td>${(totalVenta + data.data.profit_carrier_p).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
    </tr>
`;

            // Agrega los totales al final de la tabla
            productsTable.innerHTML += footerRow;
            //Ahora el dataTable del historial
            const historyTable = document.querySelector('.history tbody');
            historyTable.innerHTML = ''; // Clear existing rows

            data.data_history.forEach((event, index) => {
                let statusText;
                switch (event.status_sh) {
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
                const row = `
        <tr>
            <td>${index + 1}</td>
            <td>${new Date(event.createdAt).toLocaleString('es-CO')}</td>
            <td>${statusText}</td>
            <td>${event.carrier.name_carrier} ${event.carrier.last_name_carrier}</td>
            <td>${event.comentary_sh}</td>
        </tr>
    `;
                historyTable.innerHTML += row;
            });

        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});


