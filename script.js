document.addEventListener("DOMContentLoaded", function() {
    // Cambiar color al hacer clic en una categoría
    const menuLinks = document.querySelectorAll(".menu-link");

    menuLinks.forEach(link => {
    link.addEventListener("click", function() {
        menuLinks.forEach(item => item.style.color = "white"); // Restaurar color
        this.style.color = "#ffd700"; // Cambiar color del clic
    });
});
});

// Verificar si el Service Worker está disponible y registrarlo
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log("Service Worker registrado"))
        .catch(error => console.log("Error registrando SW:", error));
}

// Variables de instalación
let deferredPrompt;
const installBtn = document.getElementById("installBtn");
const iosInstructions = document.getElementById("ios-instructions");

// Función para detectar si la app ya está instalada en iPhone o Android
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Ocultar los mensajes si la app ya está instalada
function checkInstallationStatus() {
    if (isAppInstalled()) {
        installBtn.style.display = "none";
        iosInstructions.style.display = "none";
    }
}

// Ejecutar la verificación al cargar la página
document.addEventListener("DOMContentLoaded", checkInstallationStatus);

// Detectar si es iOS para mostrar instrucciones
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

if (isIOS()) {
    document.addEventListener("DOMContentLoaded", () => {
        if (!isAppInstalled()) {
            iosInstructions.style.display = "block"; // Mostrar solo si no está instalada
        }
    });
} else {
    // Solo mostrar el botón en Android cuando la app no está instalada
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredPrompt = event;
        if (!isAppInstalled()) {
            installBtn.style.display = "block";
        }
    });

    installBtn.addEventListener("click", () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice) => {
                if (choice.outcome === "accepted") {
                    console.log("App instalada");
                    installBtn.style.display = "none";
                    iosInstructions.style.display = "none"; // Ocultar mensaje en iOS también
                }
                deferredPrompt = null;
            });
        }
    });

    // También ocultar el botón y mensajes si la app se instala en Android
    window.addEventListener("appinstalled", () => {
        console.log("PWA instalada");
        installBtn.style.display = "none";
        iosInstructions.style.display = "none";
    });
}

function checkInstallationStatus() {
    setTimeout(() => {
        if (isAppInstalled()) {
            installBtn.style.display = "none";
            iosInstructions.style.display = "none";
        }
    }, 500); // Se retrasa medio segundo para no interferir con la carga del icono
}
