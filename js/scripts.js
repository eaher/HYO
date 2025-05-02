document.addEventListener("DOMContentLoaded", function () {

  function ajustarAlturaViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  window.addEventListener('load', ajustarAlturaViewport);
  window.addEventListener('resize', ajustarAlturaViewport);
  window.addEventListener('orientationchange', ajustarAlturaViewport);

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

  // 🔧 Corrección: Ajuste de scroll cuando hay hash (#productos)
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

  const consultaBlocks = document.querySelectorAll(".consulta-contenido");

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

  function descargarPDF(rutaPDF) {
    const link = document.createElement('a');
    link.href = rutaPDF;
    link.download = rutaPDF.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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

  function getNextSection() {
    const sections = document.querySelectorAll(".section");
    const currentScroll = window.pageYOffset;
    return Array.from(sections).find(section => section.offsetTop > currentScroll + 10);
  }

  function getPrevSection() {
    const sections = Array.from(document.querySelectorAll(".section"));
    const currentScroll = window.pageYOffset;
    const buffer = 30;
    let prevSection = null;
    for (let i = 0; i < sections.length; i++) {
      const sectionTop = sections[i].offsetTop;
      if (sectionTop + buffer < currentScroll) {
        prevSection = sections[i];
      } else {
        break;
      }
    }
    return prevSection;
  }

  function scrollToSection(section) {
    const navbar = document.querySelector(".navbar");
    const isNavbarVisible = window.getComputedStyle(navbar).top === "0px";
    const navbarHeight = navbar?.offsetHeight || 0;
    const scrollOffset = esEscritorio() && isNavbarVisible ? navbarHeight : 0;
    window.scrollTo({
      top: section.offsetTop - scrollOffset,
      behavior: "smooth"
    });
  }

  if (esIndex() && esEscritorio()) {
    let scrollTimeout;
    document.addEventListener("wheel", function (event) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const delta = event.deltaY;
        if (delta > 0) {
          const nextSection = getNextSection();
          if (nextSection) scrollToSection(nextSection);
        } else {
          const prevSection = getPrevSection();
          if (prevSection) scrollToSection(prevSection);
        }
      }, 100);
    }, { passive: true });
  }

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
    return scrollPosition >= inicioSection.offsetTop && scrollPosition < inicioSection.offsetTop + inicioSection.offsetHeight;
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

  function esIndex() {
    const path = window.location.pathname;
    return path === "/" || path.endsWith("/index.html");
  }

  function esEscritorio() {
    return window.innerWidth > 768;
  }

  // === AGREGADO: descarga desde imágenes con .descarga-pdf ===
  document.querySelectorAll(".descarga-pdf").forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      const rutaPDF = img.dataset.pdf;
      if (!rutaPDF) return;

      const link = document.createElement("a");
      link.href = rutaPDF;
      link.download = rutaPDF.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

});
