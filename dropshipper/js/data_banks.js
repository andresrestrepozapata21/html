// capturo las variables de entorno que puedo necesitar
const token = localStorage.getItem('token');
const id_dropshipper = localStorage.getItem('id_dropshipper');
const wallet = localStorage.getItem('wallet');
const cuenta = localStorage.getItem('cuentaCreada');
const eliminado = localStorage.getItem('eliminado');

// cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    if (cuenta) {
        // Llamar a showToast
        showToast('Cuenta creada correctamente.');
        localStorage.removeItem('cuentaCreada');
    } else if (eliminado) {
        // Llamar a showToast
        showToast('Paquete eliminado correctamente.');
        localStorage.removeItem('eliminado');
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
    fetch(window.myAppConfig.production + '/dropshipper/getBankAccount', {
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
                    item.number_dba,
                    item.type_dba,
                    item.bank_dba,
                    item.description_dba,
                    `<div class="acciones">
                        <button type="button" id="btnDelete" class="enlaces" onClick="eliminarPaquete(${item.id_dba})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    `
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});

// Fragmento de codigo para realizar el filtro en la tabla
document.getElementById("form").addEventListener('submit', function (event) {
    // I drop default form behavior
    event.preventDefault();
    // Login form data
    const numeroCuenta = document.getElementById('numeroCuenta').value;
    const tipoCuenta = document.getElementById('tipoCuenta').value;
    const banco = document.getElementById('banco').value;
    const descripcion = document.getElementById('descripcion').value;

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/addBankAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            number_dba: numeroCuenta,
            type_dba: tipoCuenta,
            bank_dba: banco,
            description_dba: descripcion,
            fk_id_dropshipper_dba: id_dropshipper
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
            } else if (data.result === 1) {
                // Save the token and id user router to local storage
                localStorage.setItem('cuentaCreada', true);
                window.location.reload();
            }
        })
        .catch(error => {
            // Handle login errors
            console.error('Error de filtro:', error.message);
        });
});

//Metodo para eliminar el paquete.
function eliminarPaquete(id_dba) {
    // confiramcion con un alert
    let result = confirm("¿Estas seguro que deseas eliminar esta cuenta?, confirmar antes de aceptar.");
    //si el resueltaod es positivo
    if (result) {
        console.log(id_dba)
        // Realizar la petición Fetch al endpoint
        fetch(window.myAppConfig.production + '/dropshipper/deleteBankAccount', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_dba
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