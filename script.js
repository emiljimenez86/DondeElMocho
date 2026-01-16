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
    navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
            console.log("Service Worker registrado");
            
            // Detectar actualizaciones del Service Worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log("Nueva versión del Service Worker detectada");
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Hay una nueva versión disponible
                        console.log("Nueva versión disponible. Recargando...");
                        // Recargar automáticamente después de un breve delay
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                });
            });
            
            // Verificar actualizaciones periódicamente
            setInterval(() => {
                registration.update();
            }, 60000); // Cada minuto
        })
        .catch(error => console.log("Error registrando SW:", error));
    
    // Escuchar cuando el Service Worker toma control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log("Service Worker tomó control. Recargando...");
        window.location.reload();
    });
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
