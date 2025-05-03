document.addEventListener("DOMContentLoaded", function () {

  // 1) viewport unit hack
  function ajustarAlturaViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  window.addEventListener('load', ajustarAlturaViewport);
  window.addEventListener('resize', ajustarAlturaViewport);
  window.addEventListener('orientationchange', ajustarAlturaViewport);

  // 2) scroll restoration manual
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.addEventListener("pageshow", (event) => {
    if (esIndex() && esEscritorio() && !window.location.hash) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      });
    }
  });
  window.addEventListener("load", () => {
    if (window.location.hash && esIndex() && esEscritorio()) {
      const hash = window.location.hash;
      const target = document.querySelector(hash);
      const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
      if (target) {
        setTimeout(() => {
          const offsetTop = target.offsetTop - navbarHeight;
          window.scrollTo({ top: offsetTop, behavior: "instant" });
        }, 50);
      }
    }
  });

  // 3) inicializar cards dinámicas
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
      generarCardsPorCategoria(categoria, ".cards-grid-prod");
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

  // 4) Datos de catálogo para Piscinas, Revestimientos, Pisos y Decorativos
  const catalogData = {
    "contenedor-piscinas": {
      images: [
        "img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-01.png",
        "img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-02.png",
        "img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-03.png",
        "img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-04.png"
      ],
      pdf: "pdf/catalogo-piscinas.pdf"
    },
    "contenedor-revestimientos": {
      images: [
        "img/CERAMICAS/PRODUCTOS + FICHAS/REVESTIMIENTOS/CARRUSELREVESTIMIENTOS/CATALOGO - HOJAS REVESTIMIENTOS-01.png",
        "img/CERAMICAS/PRODUCTOS + FICHAS/REVESTIMIENTOS/CARRUSELREVESTIMIENTOS/CATALOGO - HOJAS REVESTIMIENTOS-02.png",
        "img/CERAMICAS/PRODUCTOS + FICHAS/REVESTIMIENTOS/CARRUSELREVESTIMIENTOS/CATALOGO - HOJAS REVESTIMIENTOS-03png",
        "img/CERAMICAS/PRODUCTOS + FICHAS/REVESTIMIENTOS/CARRUSELREVESTIMIENTOS/CATALOGO - HOJAS REVESTIMIENTOS-04.png",
        "img/CERAMICAS/PRODUCTOS + FICHAS/REVESTIMIENTOS/CARRUSELREVESTIMIENTOS/CATALOGO - HOJAS REVESTIMIENTOS-05.png"
      ],
      pdf: "pdf/catalogo-piscinas.pdf"
    },
    "contenedor-pisos-general": {
      images: [
        "img/CERAMICAS/CATALOGOS/PISOS/CARRUSEL-PISOS/CATALOGO - HOJAS PISOS-01.png",
        "img/CERAMICAS/CATALOGOS/PISOS/CARRUSEL-PISOS/CATALOGO - HOJAS PISOS-02.png",
        "img/CERAMICAS/CATALOGOS/PISOS/CARRUSEL-PISOS/CATALOGO - HOJAS PISOS-03.png",
        "img/CERAMICAS/CATALOGOS/PISOS/CARRUSEL-PISOS/CATALOGO - HOJAS PISOS-04.png",
        "img/CERAMICAS/CATALOGOS/PISOS/CARRUSEL-PISOS/CATALOGO - HOJAS PISOS-05.png",
        "img/CERAMICAS/CATALOGOS/PISOS/CARRUSEL-PISOS/CATALOGO - HOJAS PISOS-06.png"
      ],
      pdf: "pdf/catalogo-piscinas.pdf"
    },
    "contenedor-decorativos": {
      images: [
        "img/CERAMICAS/CATALOGOS/DECORATIVOS/CARRUSEL-DECORATIVOS/CATALOGO - HOJAS DECO-01.png",
        "img/CERAMICAS/CATALOGOS/DECORATIVOS/CARRUSEL-DECORATIVOS/CATALOGO - HOJAS DECO-02.png",
        "img/CERAMICAS/CATALOGOS/DECORATIVOS/CARRUSEL-DECORATIVOS/CATALOGO - HOJAS DECO-03.png",
        "img/CERAMICAS/CATALOGOS/DECORATIVOS/CARRUSEL-DECORATIVOS/CATALOGO - HOJAS DECO-04.png",
      ],
      pdf: "pdf/catalogo-piscinas.pdf"
    }
  };

  // 5) Listeners para "Consulta Catálogo"
  const consultaBlocks = document.querySelectorAll(".consulta-contenido");

  // 5a) Mantenimiento del comportamiento actual para bachas
  consultaBlocks.forEach(block => {
    block.addEventListener("click", function () {
      const containerSection = block.closest("section");
      if (!containerSection) return;
      const isBachasMarmol = containerSection.querySelector("#cards-bachas-marmol");
      const isBachasSimilPiedra = containerSection.querySelector("#cards-bachas-simil-piedra");
      if (isBachasMarmol) {
        descargarPDF('pdf/catalogo-bachas-marmol.pdf');
      } else if (isBachasSimilPiedra) {
        descargarPDF('pdf/catalogo-bachas-simil-piedra.pdf');
      }
    });
  });

  // 5b) Nuevo listener para Piscinas / Revestimientos / Pisos / Decorativos
  consultaBlocks.forEach(block => {
    block.addEventListener("click", () => {
      const section = block.closest("section");
      if (!section) return;
      const data = catalogData[section.id];
      if (!data) return; // no es una sección de catálogo dinámico

      // a) Construir el carrusel
      const carouselInner = document.getElementById("carouselInner");
      carouselInner.innerHTML = "";
      data.images.forEach((src, i) => {
        const item = document.createElement("div");
        item.className = "carousel-item" + (i === 0 ? " active" : "");
        item.innerHTML = `<img src="${src}" class="d-block w-100" alt="Página ${i+1}">`;
        carouselInner.appendChild(item);
      });

      // b) Actualizar botón de descarga
      const btnPdf = document.getElementById("btn-descargar-pdf");
      btnPdf.href = data.pdf;
      btnPdf.download = data.pdf.split("/").pop();

      // c) Mostrar el modal
      new bootstrap.Modal(document.getElementById("carouselModal")).show();
    });
  });

  // 6) Función genérica de descarga de PDF
  function descargarPDF(rutaPDF) {
    const link = document.createElement('a');
    link.href = rutaPDF;
    link.download = rutaPDF.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 7) Resto del script original: generación de cards, modales de imagen/ficha, scroll automático, navbar, etc.

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
    if (!contenedor) return;
    const productos = productosPorCategoria[categoria] || [];
    if (!productos.length) return;
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
            <p class="bachas-medida">Medida: ${producto.subtitulo}</p>
            <p class="bachas-codigo">Código: ${producto.descripcion}</p>
          </div>`;
      } else {
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
            <p class="card-description">${producto.descripcion}</p>
            <div class="card-icon">
              <a href="#" class="icon-ficha-link" data-id="${producto.id}" data-categoria="${categoria}" data-type="ficha">
                <img src="img/file.png" alt="Ficha técnica icon" class="icon-ficha">
                <span class="text-ficha">Ficha técnica</span>
              </a>
            </div>
          </div>`;
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
      crearModal(producto.imgFicha, "modal-ficha", producto.descripcion);
    }
  });

  function crearModal(imagen, modalClass, descripcion = "ficha") {
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal", "fade", modalClass);
    modalContainer.tabIndex = -1;
    const esFicha = modalClass === "modal-ficha";
    modalContainer.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body p-0">
            <button type="button" class="btn-close btn-close-white modal-close-btn" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            <img src="${imagen}" class="modal-img-full" alt="Ficha técnica">
          </div>
          ${esFicha ? `
            <div class="modal-footer justify-content-center">
              <a href="${imagen}" download="${descripcion}-ficha.png" class="btn btn-primary d-flex align-items-center gap-2">
                <i class="fa-solid fa-download"></i> Descargar ficha
              </a>
            </div>` : ``}
        </div>
      </div>`;
    document.body.appendChild(modalContainer);
    const modal = new bootstrap.Modal(modalContainer);
    modal.show();
    modalContainer.addEventListener("hidden.bs.modal", () => {
      modalContainer.remove();
    });
  }

  // Helpers de scroll automático y navbar …
  function getNextSection() {
    const sections = document.querySelectorAll(".section");
    const currentScroll = window.pageYOffset;
    return Array.from(sections).find(s => s.offsetTop > currentScroll + 10);
  }
  function getPrevSection() {
    const sections = Array.from(document.querySelectorAll(".section"));
    const currentScroll = window.pageYOffset;
    let prev = null;
    for (let s of sections) {
      if (s.offsetTop + 30 < currentScroll) prev = s;
      else break;
    }
    return prev;
  }
  function scrollToSection(section) {
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    window.scrollTo({ top: section.offsetTop - (esEscritorio() ? navbarHeight : 0), behavior: "smooth" });
  }
  if (esIndex() && esEscritorio()) {
    let timeout;
    document.addEventListener("wheel", e => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const delta = e.deltaY;
        const sec = delta > 0 ? getNextSection() : getPrevSection();
        if (sec) scrollToSection(sec);
      }, 100);
    }, { passive: true });
  }
  const navbar = document.querySelector(".navbar");
  let lastY = 0, hideTimeout, lastMove = 0;
  function isInInicio() {
    const inicio = document.getElementById("inicio");
    if (!inicio) return false;
    const y = window.pageYOffset;
    return y >= inicio.offsetTop && y < inicio.offsetTop + inicio.offsetHeight;
  }
  function hideNav() {
    if (!esEscritorio()) return;
    navbar.style.transition = "top 0.3s"; navbar.style.top = `-${navbar.offsetHeight}px`;
  }
  function showNav() {
    navbar.style.transition = "top 0.3s"; navbar.style.top = "0";
  }
  window.addEventListener("scroll", () => {
    if (!esEscritorio()) { showNav(); return; }
    if (isInInicio()) { showNav(); }
    else {
      if (window.pageYOffset > lastY) hideNav();
      else { showNav(); clearTimeout(hideTimeout); hideTimeout = setTimeout(hideNav, 3000); }
    }
    lastY = Math.max(0, window.pageYOffset);
  });
  window.addEventListener("mousemove", e => {
    if (e.clientY < 100 || navbar.contains(e.target)) {
      const now = Date.now();
      if (now - lastMove > 500) {
        clearTimeout(hideTimeout); showNav(); lastMove = now;
        hideTimeout = setTimeout(hideNav, 3000);
      }
    }
  });
  window.addEventListener("load", () => {
    if (esEscritorio()) { navbar.style.position = "sticky"; showNav(); }
  });
  window.addEventListener("resize", () => {
    if (esEscritorio()) { navbar.style.position = "sticky"; showNav(); }
    else { navbar.style.position = "fixed"; showNav(); }
  });

  function esIndex() {
    const p = window.location.pathname;
    return p === "/" || p.endsWith("/index.html");
  }
  function esEscritorio() {
    return window.innerWidth > 768;
  }

  // Descarga desde imágenes con .descarga-pdf
  document.querySelectorAll(".descarga-pdf").forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      const rutaPDF = img.dataset.pdf;
      if (!rutaPDF) return;
      const a = document.createElement("a");
      a.href = rutaPDF;
      a.download = rutaPDF.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });

});
