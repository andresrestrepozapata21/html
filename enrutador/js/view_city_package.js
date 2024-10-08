//capturo las variables que tengo en el sotrage
const token = localStorage.getItem('token');
const id_ru = localStorage.getItem('id_ru');
const city = localStorage.getItem('city');

// documento para cuando se carga la pantalla
document.addEventListener('DOMContentLoaded', function () {
    // Realizar la petición Fetch al endpoint
    fetch(window.myAppConfig.production + '/routerUser/getCityPackages', {
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
            console.log(data);
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
            // Recorro la tabla de datos y pinto los datos
            data.data.forEach(item => {
                let statusText;
                switch (item.status_p) {
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
                //Decloaración de la variable para el precio total
                let priceTotal = 0;
                if (item.does_shopify_p === 1) {
                    priceTotal = item.total_price_shopify_p;
                } else {
                    priceTotal = item.total_price_p;
                }
                // Agregar una fila a la tabla
                dataTable.row.add([
                    item.orden_p,
                    item.guide_number_p ? item.guide_number_p : "Sin guía",
                    item.name_client_p,
                    item.direction_client_p,
                    item.createdAt.slice(0, 19).replace("T", " "),
                    item.with_collection_p ? "Sí" : "No",
                    statusText,
                    `<a href="#" class="show-modal" onClick="showModal(${item.id_p})">Ver Productos</a>`
                ]).draw();
            });
        })
        .catch(error => {
            console.error('Error en la petición Fetch:', error);
        });
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