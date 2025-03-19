// ==========================
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
// Integración del comportamiento del navbar
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
let hideNavbarTimeout;
let lastMouseMoveTime = 0; // Tiempo del último movimiento del mouse
const mouseMoveDelay = 500; // Tiempo de retraso para activar el evento de mousemove
const navbarHeight = navbar.offsetHeight; // Altura del navbar

// Función para verificar si estamos en la sección INICIO
function isInInicioSection() {
    const inicioSection = document.getElementById('inicio');
    const scrollPosition = window.pageYOffset;
    return (scrollPosition >= inicioSection.offsetTop && scrollPosition < (inicioSection.offsetTop + inicioSection.offsetHeight));
}

// Función para ocultar el navbar
function hideNavbar() {
    navbar.style.transition = 'top 0.3s ease-in-out';
    navbar.style.top = `-${navbarHeight}px`; // Ajusta según la altura del navbar
}

// Función para mostrar el navbar
function showNavbar() {
    navbar.style.transition = 'top 0.3s ease-in-out';
    navbar.style.top = "0";
}

// Función para manejar el mousemove
function resetNavbarTimeout() {
    const currentTime = new Date().getTime();
    if (currentTime - lastMouseMoveTime > mouseMoveDelay) {
        clearTimeout(hideNavbarTimeout);
        showNavbar();
        lastMouseMoveTime = currentTime;
        hideNavbarTimeout = setTimeout(hideNavbar, 3000); // 3000 ms = 3 segundos
    }
}

// Evento de desplazamiento (scroll)
window.addEventListener('scroll', function () {
    if (isInInicioSection()) {
        showNavbar(); // Navbar visible en INICIO
    } else {
        if (window.pageYOffset > lastScrollTop) {
            hideNavbar(); // Desaparece el navbar al hacer scroll hacia abajo fuera de INICIO
        } else {
            showNavbar(); // Aparece cuando se hace scroll hacia arriba fuera de INICIO
            clearTimeout(hideNavbarTimeout); // Resetea el temporizador de desaparición
            hideNavbarTimeout = setTimeout(hideNavbar, 3000); // 3 segundos de inactividad
        }
    }
    lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset; // No dejar que el scroll sea negativo
});

// Detectar movimiento del mouse para resetear el temporizador
window.addEventListener('mousemove', function (event) {
    if (event.clientY < 100 || navbar.contains(event.target)) {
        resetNavbarTimeout();
    }
});

// Detectar cuando la página se carga o se recarga
window.addEventListener('load', function () {
    if (isInInicioSection()) {
        showNavbar(); // Mostrar el navbar si estamos en INICIO al recargar la página
    }
});

// Detectar cambios en el tamaño de la ventana
window.addEventListener('resize', function () {
    if (isInInicioSection()) {
        showNavbar(); // Mostrar navbar si estamos en INICIO en pantallas grandes
    }
});

// ==========================
// Quitar efectos del navbar (desaparecer y aparecer)
// Hacer que el navbar sea sticky siempre en pantallas grandes

// Función para hacer que el navbar sea sticky
function makeNavbarSticky() {
    navbar.style.position = "sticky";
    navbar.style.top = "0";
    navbar.style.width = "100%";
}

// Función para verificar si estamos en una pantalla grande
function isLargeScreen() {
    return window.innerWidth > 768; // Pantalla grande: mayor a 768px
}

// Cuando la página se carga, se aplica el estilo sticky al navbar si estamos en pantallas grandes
window.addEventListener('load', function() {
    if (isLargeScreen()) {
        makeNavbarSticky();
    }
});

// También verificamos cuando el tamaño de la ventana cambia
window.addEventListener('resize', function() {
    if (isLargeScreen()) {
        makeNavbarSticky();
    } else {
        // Si estamos en pantallas pequeñas, el navbar no es sticky
        navbar.style.position = "static"; // El navbar se comporta de manera normal
    }
});
