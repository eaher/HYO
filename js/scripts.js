document.addEventListener("DOMContentLoaded", function () {
  function iniciarApp() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes("bachas")) {
      generarCardsPorCategoria("bachas_marmol", "#cards-bachas-marmol");
      generarCardsPorCategoria("bachas_simil_piedra", "#cards-bachas-simil-piedra");
    } else {
      const categoria = detectarCategoria();
      if (!categoria) {
        console.warn("No se detectó categoría válida.");
        return;
      }
      generarCardsPorCategoria(categoria, ".cards-grid");
    }
  }

  function esperarDataProductos() {
    const intervalo = setInterval(() => {
      if (typeof productosPorCategoria !== "undefined") {
        clearInterval(intervalo);
        iniciarApp();
      }
    }, 50);

    setTimeout(() => clearInterval(intervalo), 5000);
  }

  esperarDataProductos();

  function detectarCategoria() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("aluminio")) return "aluminio";
    if (path.includes("acero")) return "acero";
    if (path.includes("pvc")) return "pvc";
    if (path.includes("bachas-marmol")) return "bachas_marmol";
    if (path.includes("bachas-simil-piedra")) return "bachas_simil_piedra";
    return null;
  }

  function generarCardsPorCategoria(categoria, contenedorSelector) {
    const contenedor = document.querySelector(contenedorSelector);
    if (!contenedor) {
      console.warn(`Contenedor no encontrado: ${contenedorSelector}`);
      return;
    }

    const productos = productosPorCategoria[categoria] || [];
    if (!productos.length) {
      console.warn(`No se encontraron productos para la categoría: ${categoria}`);
      return;
    }

    productos.sort((a, b) => a.id - b.id);

    productos.forEach(producto => {
      let card;

      if (categoria.includes('bachas')) {
        card = document.createElement("div");
        card.classList.add("bachas-card");
      
        card.innerHTML = `
          <img src="${producto.imgProducto}" alt="${producto.titulo}" loading="lazy" data-id="${producto.id}" data-categoria="${categoria}">
          <a href="#" class="bachas-icon-lupa" data-id="${producto.id}" data-categoria="${categoria}" data-type="image">
            <i class="fa-solid fa-magnifying-glass"></i>
          </a>
          <div class="bachas-card-content">
            <h3 class="bachas-title">${producto.titulo}</h3>
            <p class="bachas-description">${producto.subtitulo}</p>
          </div>
        `;
      }
       else {
        card = document.createElement("div");
        card.classList.add("card-tech");

        card.innerHTML = `
          <div class="card-image">
            <img src="${producto.imgProducto}" alt="${producto.titulo}" class="img-card" loading="lazy" data-id="${producto.id}" data-categoria="${categoria}">
            <a href="#" class="icon-lupa" data-id="${producto.id}" data-categoria="${categoria}" data-type="image">
              <i class="fa-solid fa-magnifying-glass"></i>
            </a>
          </div>
          <div class="card-content">
            <h3 class="card-title-prod">${producto.titulo}</h3>
            <p class="card-subtitle">${producto.subtitulo}</p>
            <div class="card-icon">
              <a href="#" class="icon-ficha" data-id="${producto.id}" data-categoria="${categoria}" data-type="ficha">
                <img src="img/file.png" alt="Ficha técnica icon" class="icon-ficha">
              </a>
              Ficha técnica
            </div>
          </div>
        `;
      }

      contenedor.appendChild(card);
    });
  }

  document.addEventListener("click", function (e) {
    const target = e.target.closest("a");
    if (!target || !target.dataset.id || !target.dataset.categoria) return;

    e.preventDefault();

    const { id, categoria, type } = target.dataset;
    const productos = productosPorCategoria[categoria] || [];
    const producto = productos.find(p => p.id == id);
    if (!producto) return;

    if (type === "image") {
      crearModal(producto.imgProducto, "modal-imagen");
    }

    if (type === "ficha") {
      crearModal(producto.imgFicha, "modal-ficha");
    }
  });

  function crearModal(imagen, modalClass) {
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal", "fade", modalClass);
    modalContainer.tabIndex = -1;
    modalContainer.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <img src="${imagen}" class="img-fluid" alt="Modal Content">
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    const modal = new bootstrap.Modal(modalContainer);
    modal.show();

    modalContainer.addEventListener("hidden.bs.modal", () => {
      modalContainer.remove();
    });
  }
});
