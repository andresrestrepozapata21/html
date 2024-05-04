// Llamar a la función para obtener los tipos de documento al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  getTypesCarrier();
  getDocumentTypes();
  getDepartments();
});

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
      number_document_carrier: document.getElementById("NumeroD").value,
      name_carrier: document.getElementById("nombres").value,
      last_name_carrier: document.getElementById("apellidos").value,
      phone_number_carrier: document.getElementById("telefono").value,
      email_carrier: document.getElementById("email").value,
      password_carrier: document.getElementById("password").value,
      fk_id_tc_carrier: document.getElementById("tipoTransportista").value,
      fk_id_city_carrier: document.getElementById("ciudades").value,
      fk_id_td_carrier: document.getElementById("tipoDocumento").value,
    };
    // window.myAppConfig.development
    // window.myAppConfig.production
    fetch(window.myAppConfig.production + "/carrier/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.result === 1) {
          alert("Registro exitoso, continua con el registro hasta el final.");
          const idCarrier = data.data.id_carrier;
          window.location =
            "./register_documents.html?id_carrier=" + idCarrier;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al registrar el usuario.");
      });
  });

// Función para obtener los departamentos desde la API
function getDepartments() {
  fetch(window.myAppConfig.production + "/utils/departments")
    .then((response) => response.json())
    .then((data) => {
      const departamentos = data.data;
      const departamentoSelects = document.querySelectorAll(
        '[id^="departamento"]'
      );
      departamentoSelects.forEach((select) => {
        departamentos.forEach((departamento) => {
          const option = document.createElement("option");
          option.value = departamento.id_d;
          option.text = departamento.name_d;
          select.appendChild(option);
        });
      });
    })
    .catch((error) =>
      console.error("Error al obtener los departamentos:", error)
    );
}

// Función para obtener las ciudades según el departamento seleccionado
function getCities(departmentId, citiesSelectId) {
  const citiesSelect = document.getElementById(citiesSelectId);
  citiesSelect.innerHTML = '<option value="">Cargando...</option>';

  const formData = {
    fk_id_d_city: departmentId,
  };
  // window.myAppConfig.development
  // window.myAppConfig.production
  fetch(window.myAppConfig.production + `/utils/cities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      const cities = data.data;
      citiesSelect.innerHTML = "";

      if (cities.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.text = "No hay ciudades disponibles";
        citiesSelect.appendChild(option);
      } else {
        cities.forEach((city) => {
          const option = document.createElement("option");
          option.value = city.id_city;
          option.text = city.name_city;
          citiesSelect.appendChild(option);
        });
      }
    })
    .catch((error) => console.error("Error al obtener las ciudades:", error));
}

// Función para obtener los tipos de documentos desde la API
function getTypesCarrier() {
  // window.myAppConfig.development
  // window.myAppConfig.production
  fetch(window.myAppConfig.production + "/utils/typesCarrier")
    .then((response) => response.json())
    .then((data) => {
      const tiposDocumento = data.data;
      const tipoDocumentoSelect = document.getElementById("tipoTransportista");
      tipoDocumentoSelect.innerHTML = "";

      const option = document.createElement("option");
      option.value = "";
      option.text = "Selecciona un tipo de transportista";
      tipoDocumentoSelect.appendChild(option);

      tiposDocumento.forEach((tipoDocumento) => {
        const option = document.createElement("option");
        option.value = tipoDocumento.id_tc;
        option.text = tipoDocumento.description_tc;
        tipoDocumentoSelect.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Error al obtener los tipos de documento:", error)
    );
}

// Función para obtener los tipos de documentos desde la API
function getDocumentTypes() {
  // window.myAppConfig.development
  // window.myAppConfig.production
  fetch(window.myAppConfig.production + "/utils/typeDocuments")
    .then((response) => response.json())
    .then((data) => {
      const tiposDocumento = data.data;
      const tipoDocumentoSelect = document.getElementById("tipoDocumento");
      tipoDocumentoSelect.innerHTML = "";

      const option = document.createElement("option");
      option.value = "";
      option.text = "Selecciona un tipo de documento";
      tipoDocumentoSelect.appendChild(option);

      tiposDocumento.forEach((tipoDocumento) => {
        const option = document.createElement("option");
        option.value = tipoDocumento.id_td;
        option.text = tipoDocumento.description_td;
        tipoDocumentoSelect.appendChild(option);
      });
    })
    .catch((error) =>
      console.error("Error al obtener los tipos de documento:", error)
    );
}
