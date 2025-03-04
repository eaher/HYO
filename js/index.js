document.addEventListener("DOMContentLoaded", () => {

    // Funcionalidad para el desplazamiento suave al hacer clic en los enlaces del navbar
    const enlaces = document.querySelectorAll('a[href^="#"]');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto de los enlaces
            const destino = document.querySelector(this.getAttribute('href')); // Obtener el destino
            
            // Desplazamiento suave
            window.scrollTo({
                top: destino.offsetTop - 80, // Ajustar la posición para que la sección no quede oculta bajo la navbar
                behavior: 'smooth'  // Desplazamiento suave
            });
        });
    });

    // Formulario de contacto
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // Validaciones básicas en tiempo real
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const email = document.getElementById("email").value.trim();
        const provincia = document.getElementById("provincia").value;
        const ciudad = document.getElementById("ciudad").value.trim();

        // Validación: Todos los campos son obligatorios
        if (!nombre || !apellido || !celular || !email || !provincia || !ciudad) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Validación: Número de celular
        if (!/^[0-9]{10}$/.test(celular)) {
            alert("El número de celular debe tener 10 dígitos.");
            return;
        }

        // Validación: Formato de correo electrónico
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Por favor, ingresa un email válido.");
            return;
        }

        // Simulación de envío exitoso
        alert("¡Formulario enviado con éxito! Nos comunicaremos contigo pronto.");
        form.reset();
    });

});
