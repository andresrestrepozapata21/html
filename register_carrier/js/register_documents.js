// Capturar los parámetros de consulta de la URL
const urlParams = new URLSearchParams(window.location.search);
const idCarrier = urlParams.get('id_carrier');

// Llenar el campo ID Carrier con el valor capturado
document.getElementById('id_carrier').value = idCarrier;

//=============================================================================
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Crea una instancia de FormData
    const formData = new FormData();
    // capturo los documentos que se necesitan
    formData.append('documents', document.getElementById('file1').files[0]);
    formData.append('documents', document.getElementById('file2').files[0]);
    formData.append('id_carrier', document.getElementById('id_carrier').value);
    // Consumo el endpoitn para cargar los documentos de usuario
    fetch(window.myAppConfig.production + '/carrier/loadDocuments', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.result === 1) {
                alert('Archivos subidos con éxito.');
                window.location = './register_bank_acount_carrier.html?id_carrier=' + idCarrier;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error al subir los archivos.');
        });
});

