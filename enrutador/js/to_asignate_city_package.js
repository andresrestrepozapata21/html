document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const id_ru = localStorage.getItem('id_ru');
    const city = localStorage.getItem('city');

    // to do request router user get carriers
    fetch(window.myAppConfig.production + '/routerUser/getCarriers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            city
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
                let status = item.status_capacity;
                let textStatus;
                if(status == 'Libre'){
                    textStatus = `<span style="color: #22bb33">${status}</span>`;
                } else if(status == 'Parcial'){
                    textStatus = `<span style="color: #f0ad4e">${status}</span>`;
                } else if(status == 'Ocupado'){
                    textStatus = `<span style="color: #bb2124">${status}</span>`;
                }
                dataTable.row.add([
                    item.id_carrier,
                    item.type_document,
                    item.number_document_carrier,
                    item.name_carrier,
                    item.last_name_carrier,
                    item.phone_number_carrier,
                    item.email_carrier,
                    `<a class="view-packages" data-id="${item.id_carrier}">Ver Paquetes</a>`,
                    textStatus,
                    `<button class="asignate-packages" data-id="${item.id_carrier}">Asignar</button>`
                ]).draw();
            });

            // Agregar evento clic al botón "Ver Paquetes"
            $('.view-packages').click(function () {
                const carrierId = $(this).data('id');
                // Llamar a la función para ver los paquetes
                viewPackages(carrierId);
            });
            // Agregar evento clic al botón "Ver Paquetes"
            $('.asignate-packages').click(function () {
                const carrierId = $(this).data('id');
                // Llamar a la función para ver los paquetes
                window.location = './detail_to_asignate_city_package.html?id_carrier=' + carrierId;
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
    // Función para manejar el evento click del enlace "Ver Paquetes"
    function viewPackages(carrierId) {
        const formData = {
            id_carrier: carrierId,
        };
        // Realizar la petición Fetch al endpoint de paquetes del transportista
        // window.myAppConfig.development
        // window.myAppConfig.production
        fetch(window.myAppConfig.production + `/routerUser/getPackagesCarrier`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                // Procesar los datos y llenar la tabla de paquetes
                const packageTable = $('#packageTable').DataTable();
                packageTable.clear().draw();

                data.data.forEach(package => {
                    let statusText;
                    switch (package.status_p) {
                        case 1:
                            statusText = "<span style='color: #BB2124'>Bodega Comercio</span>";
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
                            statusText = "<span style='color: #F0AD43'>En camino de Bodega Comercio a bodega central</span>";
                            break;
                    }
                    const withCollectionText = package.with_collection_p ? 'Sí' : 'No';

                    packageTable.row.add([
                        package.id_p,
                        package.orden_p,
                        package.name_client_p,
                        package.phone_number_client_p,
                        package.guide_number_p,
                        statusText,
                        withCollectionText,
                        package.total_price_p.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP'
                        })
                    ]).draw();
                });
                // Mostrar el modal
                $('#myModal').css('display', 'block');
            })
            .catch(error => {
                console.error('Error en la petición Fetch de productos del paquete:', error);
            });
    }
    // Cerrar el modal al hacer clic en la "X"
    $('.close').click(function () {
        $('#myModal').css('display', 'none');
    });

    // Cerrar el modal al hacer clic fuera de él
    $(window).click(function (event) {
        if (event.target == $('#myModal')[0]) {
            $('#myModal').css('display', 'none');
        }
    });
});