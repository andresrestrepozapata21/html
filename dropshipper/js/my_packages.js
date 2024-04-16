document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const id_dropshipper = localStorage.getItem('id_dropshipper');
    const city = localStorage.getItem('city');

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/dropshipper/getpackages', {
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

            data.data.forEach(item => {
                let statusText;
                switch (item.status_p) {
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
                let transportista;
                if (item.fk_id_carrier_p) {
                    transportista = item.carrier.name_carrier + ' ' + item.carrier.last_name_carrier;
                }else{
                    transportista = 'N/A'
                }
                dataTable.row.add([
                    item.id_p,
                    item.orden_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.name_client_p + " - " + item.direction_client_p,
                    item.types_package.description_tp,
                    statusText,
                    transportista,
                    `<a href="#" class="" data-id="${item.id_p}">Ver Productos</a>`
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
});