// capturo las variables de entorno que puedo necesitar
const urlParams = new URLSearchParams(window.location.search);
const id_store = urlParams.get('id_store');
const id_dropshipper = urlParams.get('id_dropshipper');
const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
const wallet1 = localStorage.getItem('wallet1');
const wallet2 = localStorage.getItem('wallet2');
const editado = localStorage.getItem('editado');
// busco todos los campos para poder enviarlos en el formulario de registro del dropshiiper
const direccion = document.getElementById('direccion');
const ciudad = document.getElementById('ciudad');
const departamento = document.getElementById('departamento');
const telefono = document.getElementById('telefono');
const capacidad = document.getElementById('capacidad');
// Obtener el elemento select de departamento
var selectDepartamento = document.getElementById('departamentoP');
// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    //lanzo el toaster que avise al usuario de la accion realizada
    if (editado) {
        // Llamar a showToast
        showToast('Bodega editada existosamente.');
        localStorage.removeItem('editado');
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
            ciudad.value = data.data.city.name_city;
            departamento.value = data.data.city.department.name_d;
            telefono.value = data.data.phone_number_store;
            capacidad.value = data.data.capacity_store;

            // Procesar los datos y llenar la tabla
            const dataTable = $('#dataTable').DataTable();
            // ciclo para ver el estado del paquete y mostrarlo en color
            data.data.packages.forEach(item => {
                let statusText;
                switch (item.status_p) {
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
                dataTable.row.add([
                    item.id_p,
                    item.orden_p,
                    item.name_client_p,
                    item.phone_number_client_p,
                    item.direction_client_p,
                    statusText,
                    `<a href="#" class="show-modal" data-id="${item.id_p}">Ver Productos</a>`,
                    `<div class="acciones">
                        <button type="button" id="btnDetalle" class="enlaces" onClick="historial(${item.id_p})"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    `
                ]).draw();
            });
            // Agregar evento clic a los enlaces "Ver Productos"
            $('.show-modal').click(function (e) {
                e.preventDefault();
                const packageId = $(this).data('id');
                showModal(packageId);
            });
            // Cerrar el modal al hacer clic en la "X"
            $('.closeProducts').click(function () {
                $('#myModal').css('display', 'none');
            });

            // Cerrar el modal al hacer clic fuera de él
            $(window).click(function (event) {
                if (event.target == $('#myModal')[0]) {
                    $('#myModal').css('display', 'none');
                }
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

document.getElementById('btnAgregar').addEventListener('click', function () {
    window.location = 'add_package.html?id_dropshipper=' + id_dropshipper;
});

document.getElementById('btnEdit').addEventListener('click', function () {
    window.location = './edit_store.html?id_store=' + id_store;
});

// Evento que captura el clic de la X para cerrar el modal de los productos del paquete
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

// Evento que captura el clic de la X para cerrar el modal de los productos del paquete
document.querySelector('.closeEvidence').addEventListener('click', function () {
    document.getElementById('modalEvidence').style.display = 'none';
});

// Metodo para abrir el modal de los productos del paquete
function historial(id_p) {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/getHistory', {
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
            //Ahora el dataTable del historial
            const historyTable = document.querySelector('.historyModal tbody');
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
                if (event.evidence_sh == '') {
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
                } else {
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
    abrirModal();
}

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
    abrirModalEvidence();
}

// Metodo para abrir el modal de los productos del paquete
function abrirModalEvidence() {
    document.getElementById('modalEvidence').style.display = 'block';
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

// Función para mostrar el modal con la información de los productos del paquete
function showModal(packageId) {
    const formData = {
        id_p: packageId,
    };
    // Realizar la petición Fetch para obtener los productos del paquete
    fetch(window.myAppConfig.production + `/routerUser/getProductsPackage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            const productTable = $('#productTable').DataTable();
            productTable.clear().draw();

            // Procesar los datos y llenar la tabla de productos del paquete
            data.data.forEach(item => {
                item.package_products.forEach(product => {
                    let total = parseInt(product.product.price_sale_product) * parseInt(product.cuantity_pp);
                    productTable.row.add([
                        product.product.id_product,
                        product.product.name_product,
                        product.product.description_product,
                        product.product.size_product,
                        product.cuantity_pp,
                        product.product.price_sale_product.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP'
                        }),
                        total.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP'
                        })
                    ]).draw();
                });
            });

            // Mostrar el modal
            $('#myModal').css('display', 'block');
        })
        .catch(error => {
            console.error('Error en la petición Fetch de productos del paquete:', error);
        });
}