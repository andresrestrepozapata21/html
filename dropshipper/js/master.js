document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const id_dropshipper = localStorage.getItem('id_dropshipper');

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/master', {
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

            console.log(data)
            // i capture the wallet value dropshipper
            const wallet = data.data.wallet_dropshipper;
            // Formatear el valor como moneda
            let valorFormateado = wallet.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP'
            });
            // i select wallet component
            const walletElement = document.querySelector('.wallet');
            // To asignate wallet value
            walletElement.textContent = valorFormateado;
             // Save the token and id user router to local storage
             localStorage.setItem('wallet', valorFormateado);


        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});