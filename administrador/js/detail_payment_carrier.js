// capturo las variables de entorno que puedo necesitar
const urlParams = new URLSearchParams(window.location.search);
const id_cpr = urlParams.get('id_cpr');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const wallet1 = localStorage.getItem('wallet1');
const wallet2 = localStorage.getItem('wallet2');
const pagado = localStorage.getItem('pagado');

// Inicializo la pagina
document.addEventListener('DOMContentLoaded', function () {
    //estrutura condicional para mostrar los toast correspondientes
    if (pagado) {
        // Llamar a showToast
        showToast('Transportista pagado existosamente.');
        localStorage.removeItem('pagado');
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
    fetch(window.myAppConfig.production + '/manager/detailPaymentRequestCarrier', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_cpr: id_cpr
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
            let transportista = data.data[0];
            console.log(transportista)
            // Obtener el elemento div
            const divTransportista = document.getElementById('transportista-component');
            // busco los div de cada uno
            const tipoDocumentoTransportistaInput = divTransportista.querySelector('#tipoDocumento');
            const numeroDocumentoTransportistaInput = divTransportista.querySelector('#numeroDocumento');
            const nombreTransportistaInput = divTransportista.querySelector('#nombreTransportista');
            const apellidoTransportistaInput = divTransportista.querySelector('#apellidoTransportista');
            const telefonoTransportistaInput = divTransportista.querySelector('#telefonoTransportista');
            //Info carrier
            tipoDocumentoTransportistaInput.value = transportista.carrier_bank_account.carrier.types_document.description_td;
            numeroDocumentoTransportistaInput.value = transportista.carrier_bank_account.carrier.number_document_carrier;
            nombreTransportistaInput.value = transportista.carrier_bank_account.carrier.name_carrier;
            apellidoTransportistaInput.value = transportista.carrier_bank_account.carrier.last_name_carrier;
            telefonoTransportistaInput.value = transportista.carrier_bank_account.carrier.phone_number_carrier;
            //Cuentas
            const banco = divTransportista.querySelector('#banco');
            const nequi = divTransportista.querySelector('#nequi');
            const daviplata = divTransportista.querySelector('#daviplata');
            const tipocuenta = divTransportista.querySelector('#tipocuenta');
            const numeroCuenta = divTransportista.querySelector('#numeroCuenta');
            const QRImg = divTransportista.querySelector('#QRImg');
            const montoSolicitado = divTransportista.querySelector('#montoSolicitado');
            banco.textContent = `Banco: ${transportista.carrier_bank_account.bank_cba}`;
            tipocuenta.textContent = `Tipo Cuenta: ${transportista.carrier_bank_account.type_cba}`;
            numeroCuenta.textContent = `# Cuenta: ${transportista.carrier_bank_account.number_cba}`;
            nequi.textContent = `Nequi: ${transportista.carrier_bank_account.carrier.nequi_carrier}`;
            daviplata.textContent = `Daviplata: ${transportista.carrier_bank_account.carrier.daviplata_carrier}`;
            QRImg.innerHTML = `
                <img src="${window.myAppConfig.production}/${transportista.carrier_bank_account.carrier.url_QR_carrier}" alt="">
            `;
            let cantidad = transportista.quantity_requested_cpr.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP'
            });
            montoSolicitado.textContent = `Monto Solicitado: ${cantidad}`;

            //Coloco los documentos del transportista
            /*
            const divDocumentsTransportista = document.getElementById('carrierDocuments');
            divDocumentsTransportista.innerHTML = '';
            transportista.carrier_documents.forEach(document => {
                const row = `
                    <img src="${window.myAppConfig.production}/${document.url_cd}" alt="">
                `;
                divDocumentsTransportista.innerHTML += row;
            });
*/
            //Ahora el dataTable del historial
            const historyTable = document.querySelector('.history tbody');
            historyTable.innerHTML = ''; // Clear existing rows
            data.data_history.forEach((event, index) => {
                let statusText;
                switch (event.status_sh) {
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
                let row;
                if(event.evidence_sh == ''){
                    row = `
                 <tr>
                     <td>${event.id_sh}</td>
                     <td>${event.package.orden_p}</td>
                     <td>${statusText}</td>
                     <td>${event.package.name_client_p}</td>
                     <td>${event.package.phone_number_client_p}</td>
                     <td>${event.package.direction_client_p}</td>
                     <td></td>
                 </tr>
             `;
                } else{
                    row = `
                 <tr>
                     <td>${event.id_sh}</td>
                     <td>${event.package.orden_p}</td>
                     <td>${statusText}</td>
                     <td>${event.package.name_client_p}</td>
                     <td>${event.package.phone_number_client_p}</td>
                     <td>${event.package.direction_client_p}</td>
                     <td><button type="button" id="btnDetalle" class="enlaces" onClick="verEvidencia(${event.id_sh})"><i class="fa-solid fa-magnifying-glass"></i></button></td>
                 </tr>
             `;
                }
                historyTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Añadir evento al botón regresar si es necesario
document.getElementById('btnEdit').addEventListener('click', function () {
    window.location = './edit_carrier.html?id_carrier=' + id_carrier;
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