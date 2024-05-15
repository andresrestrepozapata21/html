// capturo las variables de entorno que puedo necesitar
const urlParams = new URLSearchParams(window.location.search);
const id_dropshipper = localStorage.getItem('id_dropshipper');
const token = localStorage.getItem('token');
const wallet = localStorage.getItem('wallet');
const agregado = localStorage.getItem('agregado');
const eliminado = localStorage.getItem('eliminado');
const editado = localStorage.getItem('editado');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    if (agregado) {
        // Llamar a showToast
        showToast('Producto agregado correctamente.');
        localStorage.removeItem('agregado');
    } else if(eliminado){
        // Llamar a showToast
        showToast('Producto eliminado correctamente.');
        localStorage.removeItem('eliminado');
    } else if(editado){
        // Llamar a showToast
        showToast('Producto editado correctamente.');
        localStorage.removeItem('editado');
    }
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
                    item.price_cost_product.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    }),
                    item.price_sale_product.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP'
                    }),
                    `<div class="acciones">
                        <button type="button" id="btnEdit" class="enlaces" onClick="editarProduct(${item.id_product})"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button type="button" id="btnDelete" class="enlaces" onClick="eliminarProduct(${item.id_product})"><i class="fa-solid fa-trash"></i></button>
                    </div>`
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    let name_product = document.getElementById('name_product').value;
    let description_product = document.getElementById('description_product').value;
    let size_product = document.getElementById('size_product').value;
    let price_cost_product = document.getElementById('price_cost_product').value;
    let price_sale_product = document.getElementById('price_sale_product').value;
    // valido que todo este lleno
    if (name_product && description_product && size_product && price_cost_product && price_sale_product) {
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name_product,
                description_product,
                size_product,
                price_cost_product,
                price_sale_product,
                fk_id_dropshipper_product: id_dropshipper
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
                    localStorage.setItem('agregado', true);
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error en la petición Fetch:', error);
            });
    }
});

//Metodo para eliminar el paquete.
function eliminarProduct(id_product) {
    // alert confirm para que el usuario confirme si efecrtivamente quiere eliminar el paquete
    let result = confirm("¿Estas seguro que deseas eliminar este producto?, confirmar antes de aceptar.");
    // Si la confirmacion es positiva
    if (result) {
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/manager/deleteProduct', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_product
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
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
                    localStorage.setItem('eliminado', true);
                    window.location.reload();
                }
            })
            .catch(error => {
                // Handle login errors
                console.error('Error de filtro:', error.message);
            });
    } else {
        checkboxesSeleccionados[0].checked = false;
    }
}

//Metodo para editar el paquete.
function editarProduct(id_product) {
    window.location = './edit_product.html?id_product=' + id_product;
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
