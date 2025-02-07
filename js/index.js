document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript cargado correctamente");

    const sections = document.querySelectorAll("section"); // Selecciona todas las secciones
    const navbar = document.querySelector("nav"); // Selecciona el navbar
    let currentIndex = 0; // Índice de la sección actual
    let isScrolling = false;
    let lastScrollTime = 0;

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) { 
            isScrolling = true;
            sections[index].scrollIntoView({ behavior: "smooth" });

            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }

    // Ocultar navbar después de 2 segundos sin movimiento
    function handleScrollVisibility() {
        navbar.style.opacity = "1"; // Hace visible el navbar

        clearTimeout(lastScrollTime);
        lastScrollTime = setTimeout(() => {
            navbar.style.opacity = "0"; // Oculta si no hay scroll por 2s
        }, 2000);
    }

    // Mostrar navbar al mover el mouse sobre él
    navbar.addEventListener("mouseenter", () => {
        navbar.style.opacity = "1";
    });

    navbar.addEventListener("mouseleave", () => {
        if (!isScrolling) {
            navbar.style.opacity = "0";
        }
    });

    // Scroll automático entre secciones (incluyendo "Contacto")
    window.addEventListener("wheel", (event) => {
        if (isScrolling) return;

        if (event.deltaY > 0) {
            if (currentIndex < sections.length - 1) { 
                currentIndex++;
                scrollToSection(currentIndex);
            }
        } else {
            if (currentIndex > 0) {
                currentIndex--;
                scrollToSection(currentIndex);
            }
        }

        handleScrollVisibility();
    });

    // Funcionalidad en dispositivos móviles (touch scroll)
    window.addEventListener("touchstart", (event) => {
        this.touchStartY = event.touches[0].clientY;
        handleScrollVisibility();
    });

    window.addEventListener("touchend", (event) => {
        let touchEndY = event.changedTouches[0].clientY;
        if (isScrolling) return;

        if (touchStartY > touchEndY + 50) {
            if (currentIndex < sections.length - 1) {
                currentIndex++;
                scrollToSection(currentIndex);
            }
        } else if (touchStartY < touchEndY - 50) {
            if (currentIndex > 0) {
                currentIndex--;
                scrollToSection(currentIndex);
            }
        }

        scrollToSection(currentIndex);
        handleScrollVisibility();
    });
});
