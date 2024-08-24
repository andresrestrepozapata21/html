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
            console.log(data);
            // i select the container to show the data
            const container1 = document.getElementById("content1");
            const header = document.getElementById("header");
            // i show the data in the container
            header.innerHTML = `
                    <h2>Bienvenido <span class="span">${data.data.name_dropshipper} ${data.data.last_name_dropshipper}</span></h2>
                    <h2>Tienes <span class="span">${data.data.total_city_package}</span> paquetes en total por tus <span class="span">${data.data.total_stores_drop}</span> bodegas.</h2>
            `;
            // i create a counter to show the data in the container
            let contador = 1;
            // i show the data in the container
            for (const bodega of data.data_by_store) {
                container1.innerHTML += `
                    <div class="stadystics">
                        <div class="titulo1">
                            <h2>Bodega: <span class="span">${bodega.id_store}</span></h2>
                            <h2>Dirección: <span class="span">${bodega.direction_store}</span> - <span class="span">${bodega.city_store}</span> - <span class="span">${bodega.department_store}</span></span></h2>
                            <h2>Cantidad de paquetes locales: <span class="span">${bodega.total_cuantity_cityPackages}</span> paquetes</span></h2>
                        </div>
                        <div class="inStore">
                            <div class="text">
                                <h3>En Bodega Comercio</h3>
                                <h6>Paquetes que no han sido iniciados</h6>
                            </div>
                            <div class="quantity">
                                <h2 class="number" id="inStore">${bodega.cityPackage_inStoreDrop}</h2>
                            </div>
                        </div>
                        <div class="onWayToCentral">
                            <div class="text">
                                <h3>En Camino a bodega central</h3>
                                <h6>Paquetes que estan en camino a central</h6>
                            </div>
                            <div class="quantity">
                                <h2 class="number" id="onWayToCentral">${bodega.total_cuantity_intercityPackages}</h2>
                            </div>
                        </div>
                        <div class="inCentral">
                            <div class="text">
                                <h3>En bodega Central</h3>
                                <h6>Paquetes que estan en bodega central</h6>
                            </div>
                            <div class="quantity">
                                <h2 class="number" id="inCentral">${bodega.cityPackage_inCentralStore}</h2>
                            </div>
                        </div>
                        <div class="onWayToClient">
                            <div class="text">
                                <h3>En Camino</h3>
                                <h6>Paquetes que estan en reparto</h6>
                            </div>
                            <div class="quantity">
                                <h2 class="number" id="onWayToClient">${bodega.cityPackage_inWayClient}</h2>
                            </div>
                        </div>
                        <div class="delivered">
                            <div class="text">
                                <h3>Entregados</h3>
                                <h6>Paquetes que estan entregados</h6>
                            </div>
                            <div class="quantity">
                                <h2 class="number" id="delivered">${bodega.cityPackage_Delived}</h2>
                            </div>
                        </div>
                    </div>
                `;
                // i capture the data to show in the container
                container1.innerHTML += `
                    <div class="graphics">
                        <div class="table-wrapper">
                            <table id="dataTable${contador}" class="display">
                                <thead>
                                    <tr>
                                        <th>Orden</th>
                                        <th>Fecha de creación</th>
                                        <th>Nombre Cliente</th>
                                        <th>Dirección Cliente</th>
                                        <th>Tipo Paquete</th>
                                        <th>Estado del paquete</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody${contador}">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <br>
                    <hr>
                `;
                // i capture the data to show in the container
                const tableBody = document.getElementById(`tableBody${contador}`);
                // i show the data in the container
                for (const row of bodega.pkg) {
                    if (row.fk_id_tp_p === 1) {
                        let statusText;
                        switch (row.status_p) {
                            case 0:
                                statusText = "<span style='color: #BB2124'>CANCELADO</span>";
                                break;
                            case 1:
                                statusText = "<span style='color: #BB2124'>En Bodega Comercio</span>";
                                break;
                            case 2:
                                statusText = "<span style='color: #5BC0DE'>En bodega central origen</span>";
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
                                statusText = "<span style='color: #F0AD43'>En camino de Bodega Comercio a bodega central</span>";
                                break;
                        }
                        tableBody.innerHTML += `
                            <tr>
                                <td>${row.orden_p}</td>
                                <td>${row.createdAt.slice(0, 19).replace("T", " ")}</td>
                                <td>${row.name_client_p}</td>
                                <td>${row.direction_client_p}</td>
                                <td>${row.fk_id_tp_p}</td>
                                <td>${statusText}</td>
                                <td>${row.total_price_p}</td>
                            </tr>
                        `;
                    }
                }
                // Inicializa DataTable para esta tabla específica
                $(`#dataTable${contador}`).DataTable({
                    language: {
                        sProcessing: "Procesando...",
                        sLengthMenu: "Mostrar _MENU_ registros",
                        sZeroRecords: "No se encontraron resultados",
                        sEmptyTable: "Ningún dato disponible en esta tabla",
                        sInfo:
                            "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                        sInfoEmpty:
                            "Mostrando registros del 0 al 0 de un total de 0 registros",
                        sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                        sSearch: "Buscar:",
                        oPaginate: {
                            sFirst: "Primero",
                            sLast: "Último",
                            sNext: "Siguiente",
                            sPrevious: "Anterior",
                        },
                        oAria: {
                            sSortAscending:
                                ": Activar para ordenar la columna de manera ascendente",
                            sSortDescending:
                                ": Activar para ordenar la columna de manera descendente",
                        },
                    },
                    order: [[1, "desc"]],
                    pageLength: 10,
                });
                // i capture the data to show in the container
                contador++;
            }
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