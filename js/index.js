document.addEventListener("DOMContentLoaded", () => {
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

        if (!nombre || !apellido || !celular || !email || !provincia || !ciudad) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (!/^[0-9]{10}$/.test(celular)) {
            alert("El número de celular debe tener 10 dígitos.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Por favor, ingresa un email válido.");
            return;
        }

        // Simulación de envío exitoso
        alert("¡Formulario enviado con éxito! Nos comunicaremos contigo pronto.");
        form.reset();
    });
});
