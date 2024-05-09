const token = localStorage.getItem('token');
const id_manager = localStorage.getItem('id_manager');
document.addEventListener('DOMContentLoaded', function () {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/manager/master', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            id_manager
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

            console.log(data)
            //// i capture the wallet value dropshipper
            //const wallet1 = data.data.debt_carrier_manager;
            //const wallet2 = data.data.debt_dropshipper_manager;
            //// Formatear el valor como moneda
            //let valorFormateado1 = wallet1.toLocaleString('es-CO', {
            //    style: 'currency',
            //    currency: 'COP'
            //});
            //// Formatear el valor como moneda
            //let valorFormateado2 = wallet2.toLocaleString('es-CO', {
            //    style: 'currency',
            //    currency: 'COP'
            //});
            //// i select wallet component
            //const walletElement1 = document.querySelector('.wallet1');
            //const walletElement2 = document.querySelector('.wallet2');
            //// To asignate wallet value
            //walletElement1.textContent = valorFormateado1;
            //walletElement2.textContent = valorFormateado2;
            // Save the token and id user router to local storage
            //localStorage.setItem('wallet1', valorFormateado1);
            //localStorage.setItem('wallet2', valorFormateado2);


        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});