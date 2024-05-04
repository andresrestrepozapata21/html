// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id_carrier');
const idVehicle = urlParams.get('id_vehicle');
// Llenar el campo ID Carrier con el valor capturado
document.getElementById('id_carrier').value = idCarrier;
document.getElementById('id_vehicle').value = idVehicle;
//capturo evento de submit del formulario
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    // evito comportamiento por defecto
    event.preventDefault();
    // Crea una instancia de FormData
    const formData = new FormData();
    //capturo los datos, documentos y armo el formData
    formData.append('documents', document.getElementById('file1').files[0]);
    formData.append('documents', document.getElementById('file2').files[0]);
    formData.append('id_vehicle', document.getElementById('id_vehicle').value);
    formData.append('id_carrier', document.getElementById('id_carrier').value);
    //Llamo el endpoint necesario
    fetch(window.myAppConfig.production + '/carrier/vehicle/loadDocuments', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(data.result === 1){
                alert('Archivos subidos con éxito.');
                window.location = './confirmation_register.html';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al subir los archivos.');
        });
});

