// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id_carrier');
// Llenar el campo ID Carrier con el valor capturado
document.getElementById('id_carrier').value = idCarrier;
//capturo el evento submit del formulario
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    // evito el comportamiento por defecto del formulario
    event.preventDefault();
    // Crea una instancia de FormData
    const formData = new FormData();
    // capturo los datos necesarios y los guardo en el formdata que envio en el servicio
    formData.append('id_carrier', document.getElementById('id_carrier').value);
    formData.append('description_vehicle', document.getElementById('descripcion').value);
    formData.append('class_vehicle', document.getElementById('clase').value);
    formData.append('plate_vehicle', document.getElementById('placa').value);
    formData.append('color_vehicle', document.getElementById('color').value);
    formData.append('brand_vehicle', document.getElementById('marca').value);
    formData.append('line_vehicle', document.getElementById('linea').value);
    formData.append('model_vehicle', document.getElementById('modelo').value);
    formData.append('cylinder_capacity_vehicle', document.getElementById('cilindraje').value);
    formData.append('capacity_vehicle', 10);
    formData.append('image_vehicle', document.getElementById('photo').files[0]);
    // consumo el endpoint para registrar el vehiculo
    fetch(window.myAppConfig.production + '/carrier/vehicle/register', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(data.result === 1){
                alert('Vehiculo registrado éxitosamente.');
                const idVehicle = data.data.id_vehicle;
                window.location = './register_documents_vehicle.html?id_vehicle=' + idVehicle + '&id_carrier=' + idCarrier;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al subir los archivos.');
        });
});

