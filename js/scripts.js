// Scroll automático entre secciones al hacer scroll
document.addEventListener('wheel', function(event) {
    if (event.deltaY > 0) {
        // Desplazar hacia abajo
        let nextSection = getNextSection();
        if (nextSection) {
            scrollToSection(nextSection);
        }
    } else {
        // Desplazar hacia arriba
        let prevSection = getPrevSection();
        if (prevSection) {
            scrollToSection(prevSection);
        }
    }
});

// Función para obtener la siguiente sección
function getNextSection() {
    let sections = document.querySelectorAll('.section');
    let currentScrollPosition = window.pageYOffset;
    for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        if (section.offsetTop > currentScrollPosition) {
            return section;
        }
    }
    return null;
}

// Función para obtener la sección anterior
function getPrevSection() {
    let sections = document.querySelectorAll('.section');
    let currentScrollPosition = window.pageYOffset;
    for (let i = sections.length - 1; i >= 0; i--) {
        let section = sections[i];
        if (section.offsetTop < currentScrollPosition) {
            return section;
        }
    }
    return null;
}

// Función para hacer scroll suave hacia la sección deseada
function scrollToSection(section) {
    window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
    });
}

// -----------------------------
// Código para el navbar que desaparece y aparece en pantallas grandes

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');
let hideNavbarTimeout;
let isScrolling = false;
let lastMouseMoveTime = 0;  // Tiempo del último movimiento del mouse
const mouseMoveDelay = 500;  // Delay para activar el evento de mousemove

// Función para ocultar el navbar
function hideNavbar() {
    navbar.style.transition = 'top 0.3s ease-in-out'; // Transición suave
    navbar.style.top = "-60px"; // Ajusta según el tamaño del navbar
}

// Función para mostrar el navbar
function showNavbar() {
    navbar.style.transition = 'top 0.3s ease-in-out'; // Transición suave
    navbar.style.top = "0";
}

// Función de debounce para evitar que el evento de scroll se ejecute demasiado rápido
function debounce(func, delay) {
    if (isScrolling) {
        return;
    }
    isScrolling = true;
    setTimeout(function () {
        func();
        isScrolling = false;
    }, delay);
}

// Escuchar el evento de scroll
window.addEventListener('scroll', function () {
    // Solo ejecutar si estamos en pantallas grandes
    if (window.innerWidth > 768) {  // Ajusta este valor según lo que consideres "pantalla grande"
        let currentScroll = window.pageYOffset;

        // Si estamos desplazándonos hacia abajo, ocultamos el navbar inmediatamente
        if (currentScroll > lastScrollTop) {
            navbar.style.top = "-60px"; // Ajusta según el tamaño del navbar
        } else {
            // Si estamos desplazándonos hacia arriba, mostramos el navbar
            showNavbar();

            // Limpiamos el temporizador y configuramos uno nuevo para ocultar el navbar después de 3 segundos sin interacción
            clearTimeout(hideNavbarTimeout);
            hideNavbarTimeout = setTimeout(hideNavbar, 3000); // 3000 ms = 3 segundos
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

        // Llamar al debounce para manejar el evento de scroll eficientemente
        debounce(function () { }, 100);  // Ajusta el delay según el rendimiento
    }
});

// Detectar eventos de movimiento del mouse para resetear el temporizador de ocultar navbar
window.addEventListener('mousemove', function (event) {
    const currentTime = new Date().getTime();
    
    // Solo restablecer el temporizador si el mouse se mueve después de un retraso y está sobre el área activa
    if (window.innerWidth > 768 && currentTime - lastMouseMoveTime > mouseMoveDelay) {
        lastMouseMoveTime = currentTime;

        // Solo activar si el mouse está cerca del navbar o sobre un área activa
        if (event.clientY < 100 || navbar.contains(event.target)) {  // Ajusta según el área que consideres relevante
            clearTimeout(hideNavbarTimeout);
            showNavbar();
            hideNavbarTimeout = setTimeout(hideNavbar, 3000);  // 3000 ms = 3 segundos
        }
    }
});
