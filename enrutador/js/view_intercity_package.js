document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const id_ru = localStorage.getItem('id_ru');
    const city = localStorage.getItem('city');

    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/routerUser/getInterCityPackages', {
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

                dataTable.row.add([
                    item.id_p,
                    item.orden_p,
                    item.guide_number_p,
                    item.direction_client_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.with_collection_p ? "Sí" : "No",
                    item.profit_carrier_p,
                    item.total_price_p,
                    statusText,
                    `<a href="#" class="show-modal" data-id="${item.id_p}">Ver Productos</a>`
                ]).draw();
            });

            // Agregar evento clic a los enlaces "Ver Productos"
            $('.show-modal').click(function (e) {
                e.preventDefault();
                const packageId = $(this).data('id');
                showModal(packageId);
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
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
                        productTable.row.add([
                            product.product.id_product,
                            product.product.name_product,
                            product.product.description_product,
                            product.cuantity_pp,
                            product.product.price_sale_product,
                            product.product.price_cost_product,
                            product.product.size_product
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