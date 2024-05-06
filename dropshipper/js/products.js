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
                    `<div class="acciones">
                        <button type="button" id="btnEdit" class="enlaces" onClick="editarStore(${item.id_store})"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button type="button" id="btnDelete" class="enlaces" onClick="eliminarStore(${item.id_store})"><i class="fa-solid fa-trash"></i></button>
                    </div>`
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

document.getElementById('btnAgregar').addEventListener('click', function (e) {
    e.preventDefault();
    let name_product = document.getElementById('name_product').value;
    let description_product = document.getElementById('description_product').value;
    let size_product = document.getElementById('size_product').value;
    let price_cost_product = document.getElementById('price_cost_product').value;
    let price_sale_product = document.getElementById('price_sale_product').value;
    // valido que todo este lleno
    if (name_product && description_product && size_product && price_cost_product && price_sale_product) {
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
