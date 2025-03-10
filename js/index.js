let lastScrollTop = 0;
let navbarTimeout;  // Variable para el temporizador
const navbar = document.querySelector('.navbar');

// Función para manejar la desaparición/recuperación del navbar al hacer scroll
window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScrollTop) {
        navbar.style.top = "-80px";  // Se oculta el navbar al hacer scroll hacia abajo
    } else {
        navbar.style.top = "0";  // Se muestra el navbar al hacer scroll hacia arriba
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;  // Para evitar valores negativos

    // Si el usuario hace scroll, reiniciar el temporizador
    clearTimeout(navbarTimeout);
    navbarTimeout = setTimeout(hideNavbar, 1000); // Ocultar navbar después de 1 segundo de inactividad
});

// Función para mostrar el navbar si el cursor se mueve hacia arriba
let isScrollingUp = false;
window.addEventListener('mousemove', function(event) {
    if (event.clientY < 10) {
        isScrollingUp = true;
    } else {
        isScrollingUp = false;
    }

    if (isScrollingUp) {
        navbar.style.top = "0";  // Mostrar navbar si el mouse se mueve hacia arriba
    }
});

// Función para ocultar el navbar después de 1 segundo de inactividad
function hideNavbar() {
    navbar.style.top = "-80px";  // Se oculta el navbar después de 1 segundo de inactividad
}
