// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id_carrier');

// Llenar el campo ID Carrier con el valor capturado
document.getElementById('id_carrier').value = idCarrier;

document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        number_cba: document.getElementById('numeroCuenta').value,
        type_cba: document.getElementById('tipoCuenta').value,
        bank_cba: document.getElementById('banco').value,
        description_cba: document.getElementById('descripcion').value,
        fk_id_carrier_cba: document.getElementById('id_carrier').value,
    };
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.production + '/carrier/registerCarrierBankAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(data.result === 1){
                alert('Registro completado con éxito.');
                const idCarrier = data.data.fk_id_carrier_cba;
                window.location = './register_vehicle.html?id_carrier=' + idCarrier;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al registrar el usuario.');
        });
});