// capturo las variables de entorno que puedo necesitar
const urlParams = new URLSearchParams(window.location.search);
const id_product = urlParams.get('id_product');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const token = localStorage.getItem('token');
const wallet = localStorage.getItem('wallet');

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
    fetch(window.myAppConfig.production + '/manager/getDetailProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_product
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
            // Validate token Expired Redirection index.html
            if (data.result === 1) {
                document.getElementById('name_product').value = data.data.name_product;
                document.getElementById('description_product').value = data.data.description_product;
                document.getElementById('size_product').value = data.data.size_product;
                document.getElementById('price_cost_product').value = data.data.price_cost_product;
                document.getElementById('price_sale_product').value = data.data.price_sale_product;
            }
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
        fetch(window.myAppConfig.production + '/manager/editProduct/' + id_product, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name_product,
                description_product,
                size_product,
                price_cost_product,
                price_sale_product
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
                    localStorage.setItem('editado', true);
                    window.location = './products.html';
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
