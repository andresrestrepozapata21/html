// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const wallet = localStorage.getItem('wallet');
const paqueteEditado = localStorage.getItem('paqueteEditado');
const productosEditado = localStorage.getItem('productosEditado');
// Obtener la URL actual
// Crear un objeto URLSearchParams
// Acceder al parámetro específico
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id_p = urlParams.get('id_p');
// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    if (paqueteEditado) {
        // Llamar a showToast
        showToast('Paquete editado correctamente.');
        localStorage.removeItem('paqueteEditado');
    } else if (productosEditado) {
        // Llamar a showToast
        showToast('Cantidad de productos editados correctamente.');
        localStorage.removeItem('productosEditado');
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
                <td>Total Neto:</td>
                <td>${(totalVenta + data.data.profit_carrier_p).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            </tr>
        `;
            // Agrega los totales al final de la tabla
            productsTable.innerHTML += footerRow;

            //Ahora el dataTable del historial
            const historyTable = document.querySelector('.history tbody');
            historyTable.innerHTML = ''; // Clear existing rows
            let fecha_de_entrega;
            data.data_history.forEach((event, index) => {
                let statusText;
                switch (event.status_sh) {
                    case 0:
                        statusText = "<span style='color: #BB2124'>CANCELADO</span>";
                        break;
                    case 1:
                        statusText = "<span style='color: #BB2124'>Bodega Comercio</span>";
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
                        fecha_de_entrega = event.createdAt
                        break;
                    case 7:
                        statusText = "<span style='color: #F0AD43'>En camino de Bodega Comercio a bodega central</span>";
                        break;
                }
                let row;
                let detail;
                if(event.details_sh == null){
                    detail = '';
                } else {
                    detail = event.details_sh;
                }
                if (event.evidence_sh == null) {
                    row = `
                 <tr>
                    <td>${event.id_sh}</td>
                    <td>${new Date(event.createdAt).toLocaleString('es-CO')}</td>
                    <td>${statusText}</td>
                    <td>${event.carrier.name_carrier} ${event.carrier.last_name_carrier}</td>
                    <td>${event.comentary_sh}</td>
                    <td>${detail}</td>
                    <td></td>
                 </tr>
             `;
                } else {
                    row = `
                     <tr>
                     <td>${event.id_sh}</td>
                     <td>${new Date(event.createdAt).toLocaleString('es-CO')}</td>
                     <td>${statusText}</td>
                     <td>${event.carrier.name_carrier} ${event.carrier.last_name_carrier}</td>
                     <td>${event.comentary_sh}</td>
                     <td>${detail}</td>
                     <td><button type="button" id="btnDetalle" class="enlaces" onClick="verEvidencia(${event.id_sh})"><i class="fa-solid fa-magnifying-glass"></i></button></td>
                 </tr>
             `;
                }
                historyTable.innerHTML += row;
            });
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
// Añadir evento al botón regresar si es necesario
document.getElementById('btnEdit').addEventListener('click', function () {
    window.location = "./edit_package.html?id_p=" + id_p;
});

// Evento que captura el clic de la X para cerrar el modal de los productos del paquete
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

// Metodo para abrir el modal de los productos del paquete
function verEvidencia(id_sh) {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/getEvidenceHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_sh
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
            const QRImg = document.getElementById('evidenceImg');
            QRImg.innerHTML = `
                <img src="${window.myAppConfig.production}/${data.data.evidence_sh}" alt="">
            `;
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
    abrirModal();
}

// Metodo para abrir el modal de los productos del paquete
function abrirModal() {
    document.getElementById('modal').style.display = 'block';
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