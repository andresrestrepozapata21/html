// config.js
(function () {
    // Define tus URLs aquí
    const config = {
        development: "http://localhost:3000",
        production: "http://18.219.18.26:3000"
    };

    // Asigna el objeto de configuración a una variable global
    window.myAppConfig = config;
})();

// window.myAppConfig.development
// window.myAppConfig.production