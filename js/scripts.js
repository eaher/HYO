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

// Efecto del navbar que desaparece y aparece en pantallas grandes
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset;

    if (currentScroll > lastScrollTop) {
        // Scrolling down, hide navbar
        navbar.style.top = "-60px"; // Ajusta según el tamaño del navbar
    } else {
        // Scrolling up, show navbar
        navbar.style.top = "0";
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
