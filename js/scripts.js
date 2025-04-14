// ==========================
// Corrección de altura de viewport móvil + espacio fantasma
// ==========================
function ajustarAlturaViewport() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('load', ajustarAlturaViewport);
window.addEventListener('resize', ajustarAlturaViewport);
window.addEventListener('orientationchange', ajustarAlturaViewport);

// Corrección espacio fantasma inicial en móviles
window.addEventListener("load", () => {
  setTimeout(() => {
    ajustarAlturaViewport();
    window.scrollTo(0, 0);
  }, 100);
});


document.addEventListener("DOMContentLoaded", function () {
  // =========================
  // Inicio generación de cards
  // =========================

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

  esperarDataProductos();

// =========================
// Consulta catálogo dinámico (Carrusel o PDF)
// =========================

const consultaBlocks = document.querySelectorAll(".consulta-contenido");

const catalogData = {
  'contenedor-piscinas': {
      images: [
          'img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-01.png',
          'img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-02.png',
          'img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-03.png',
          'img/CERAMICAS/PRODUCTOS + FICHAS/PISCINAS/CARRUSELPISCINAS/catalogo-hojas-piscinas-04.png',
      ],
      pdf: 'pdf/catalogo-piscinas.pdf'
  },
  'contenedor-revestimientos': {
      images: [
          'img/CERAMICAS/CARRUSEL-REVESTIMIENTOS/imagen1.jpg',
          'img/CERAMICAS/CARRUSEL-REVESTIMIENTOS/imagen2.jpg'
      ],
      pdf: 'pdf/catalogo-revestimientos.pdf'
  },
  'contenedor-pisos': {
      images: [
          'img/CERAMICAS/CARRUSEL-PISOS/imagen1.jpg',
          'img/CERAMICAS/CARRUSEL-PISOS/imagen2.jpg'
      ],
      pdf: 'pdf/catalogo-pisos.pdf'
  },
  'contenedor-decorativos': {
      images: [
          'img/CERAMICAS/CARRUSEL-DECORATIVOS/imagen1.jpg',
          'img/CERAMICAS/CARRUSEL-DECORATIVOS/imagen2.jpg'
      ],
      pdf: 'pdf/catalogo-decorativos.pdf'
  }
};

consultaBlocks.forEach(block => {
  block.addEventListener("click", function () {
      const containerSection = block.closest("section");
      const sectionId = containerSection ? containerSection.id : null;
      const isMobile = window.innerWidth < 768;

      console.log(`Se hizo clic en: ${sectionId}, esMobile: ${isMobile}`);

      if (!sectionId || !catalogData[sectionId]) {
          console.warn(`No se encontró configuración para: ${sectionId}`);
          return;
      }

      if (isMobile) {
        console.log(`Descargando PDF: ${catalogData[sectionId].pdf}`);
        const link = document.createElement('a');
        link.href = catalogData[sectionId].pdf;
        link.download = catalogData[sectionId].nombreArchivo || catalogData[sectionId].pdf.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log(`Abriendo carrusel para: ${sectionId}`);
        abrirCarruselCatalogo(catalogData[sectionId].images);
      }
      
  });
});


function abrirCarruselCatalogo(images) {
  console.log("Rutas de imágenes que recibe el carrusel:", images);

  const carouselInner = document.querySelector("#carouselInner");
  if (!carouselInner) {
    console.error("No se encontró el carrusel en el DOM.");
    return;
  }

  carouselInner.innerHTML = ''; // Limpiar carrusel

  images.forEach((imgSrc, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item${index === 0 ? ' active' : ''}`;
    carouselItem.innerHTML = `<img src="${imgSrc}" class="d-block w-100" alt="Imagen carrusel" loading="lazy">`;
    carouselInner.appendChild(carouselItem);
  });

  const myModal = new bootstrap.Modal(document.getElementById('carouselModal'));
  myModal.show();
}


// =========================
// Modal imágenes / fichas técnicas
// =========================



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

  // =========================
  // Modal imágenes / fichas técnicas
  // =========================

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

// =========================
// Scroll automático
// =========================

function esIndex() {
  const path = window.location.pathname;
  return path === "/" || path.endsWith("/index.html");
}

function esEscritorio() {
  return window.innerWidth > 768;
}

function getNextSection() {
  const sections = document.querySelectorAll(".section");
  const currentScroll = window.pageYOffset;
  return Array.from(sections).find(section => section.offsetTop > currentScroll + 10);
}

function getPrevSection() {
  const sections = document.querySelectorAll(".section");
  const currentScroll = window.pageYOffset;
  return Array.from(sections).reverse().find(section => section.offsetTop < currentScroll - 10);
}

function scrollToSection(section) {
  window.scrollTo({
    top: section.offsetTop,
    behavior: "smooth"
  });
}

// ✅ Scroll automático SIEMPRE ACTIVO en index.html escritorio
if (esIndex() && esEscritorio()) {
  document.addEventListener("wheel", function (event) {
    const delta = event.deltaY;

    if (delta > 0) {
      const nextSection = getNextSection();
      if (nextSection) {
        event.preventDefault();
        scrollToSection(nextSection);
      }
    } else {
      const prevSection = getPrevSection();
      if (prevSection) {
        event.preventDefault();
        scrollToSection(prevSection);
      }
    }
  }, { passive: false });
}


   // =========================
  // Navbar dinámico mejorado
  // =========================

  const navbar = document.querySelector(".navbar");
  let lastScrollTop = 0;
  let hideNavbarTimeout;
  let lastMouseMoveTime = 0;
  const mouseMoveDelay = 500;
  const navbarHeight = navbar.offsetHeight;

  function isInInicioSection() {
    const inicioSection = document.getElementById("inicio");
    if (!inicioSection) return false;
    const scrollPosition = window.pageYOffset;
    return scrollPosition >= inicioSection.offsetTop && scrollPosition < (inicioSection.offsetTop + inicioSection.offsetHeight);
  }

  function hideNavbar() {
    if (!esEscritorio()) return;
    navbar.style.transition = "top 0.3s ease-in-out";
    navbar.style.top = `-${navbarHeight}px`;
  }

  function showNavbar() {
    navbar.style.transition = "top 0.3s ease-in-out";
    navbar.style.top = "0";
  }

  function resetNavbarTimeout() {
    if (!esEscritorio()) return;
    const currentTime = new Date().getTime();
    if (currentTime - lastMouseMoveTime > mouseMoveDelay) {
      clearTimeout(hideNavbarTimeout);
      showNavbar();
      lastMouseMoveTime = currentTime;
      hideNavbarTimeout = setTimeout(hideNavbar, 3000);
    }
  }

  window.addEventListener("scroll", function () {
    if (!esEscritorio()) {
      showNavbar();
      return;
    }

    if (isInInicioSection()) {
      showNavbar();
    } else {
      if (window.pageYOffset > lastScrollTop) {
        hideNavbar();
      } else {
        showNavbar();
        clearTimeout(hideNavbarTimeout);
        hideNavbarTimeout = setTimeout(hideNavbar, 3000);
      }
    }

    lastScrollTop = Math.max(0, window.pageYOffset);
  });

  window.addEventListener("mousemove", function (event) {
    if (event.clientY < 100 || navbar.contains(event.target)) {
      resetNavbarTimeout();
    }
  });

  window.addEventListener("load", function () {
    if (esEscritorio()) {
      makeNavbarSticky();
      if (isInInicioSection()) showNavbar();
    }
  });

  window.addEventListener("resize", function () {
    if (esEscritorio()) {
      makeNavbarSticky();
      if (isInInicioSection()) showNavbar();
    } else {
      navbar.style.position = "fixed";
      navbar.style.top = "0";
    }
  });

  function makeNavbarSticky() {
    navbar.style.position = "sticky";
    navbar.style.top = "0";
    navbar.style.width = "100%";
  }

});