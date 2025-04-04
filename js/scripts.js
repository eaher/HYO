document.addEventListener("DOMContentLoaded", function () {
    // ==============================
    // Detectar categoría actual desde la URL
    // ==============================
  
    function detectarCategoria() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes("aluminio")) return "aluminio";
      if (path.includes("acero")) return "acero";
      if (path.includes("pvc")) return "pvc";
      return null;
    }
  
    const categoria = detectarCategoria();
    const productos = productosPorCategoria ? (productosPorCategoria[categoria] || []) : [];
  
    function obtenerProducto(id) {
      return productos.find(p => p.id == id);
    }
  
    // ==============================
    // Generar Cards dinámicamente si corresponde
    // ==============================
  
    const cardsGrid = document.querySelector(".cards-grid");
  
    if (cardsGrid && productos.length > 0) {
      productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card-tech");
  
        card.innerHTML = `
          <div class="card-image">
            <img src="${producto.imgProducto}" alt="${producto.titulo}" class="img-card" loading="lazy" data-id="${producto.id}">
            <a href="#" class="icon-lupa" data-id="${producto.id}" data-type="image">
              <i class="fa-solid fa-magnifying-glass"></i>
            </a>
          </div>
          <div class="card-content">
            <h3 class="card-title-prod">${producto.titulo}</h3>
            <p class="card-subtitle">${producto.subtitulo}</p>
            <div class="card-icon">
              <a href="#" class="icon-ficha" data-id="${producto.id}" data-type="ficha">
                <img src="img/file.png" alt="Ficha técnica icon" class="icon-ficha">
              </a>
              Ficha técnica
            </div>
          </div>
        `;
  
        cardsGrid.appendChild(card);
      });
    }
  
    // ==============================
    // Scroll automático entre secciones (solo index.html + escritorio)
    // ==============================
  
    function esIndex() {
      const path = window.location.pathname;
      return path === "/" || path.endsWith("/index.html");
    }
  
    function esEscritorio() {
      return window.innerWidth > 768;
    }
  
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
  
    function getNextSection() {
      const sections = document.querySelectorAll(".section");
      const currentScroll = window.pageYOffset;
      return Array.from(sections).find(section => section.offsetTop > currentScroll);
    }
  
    function getPrevSection() {
      const sections = document.querySelectorAll(".section");
      const currentScroll = window.pageYOffset;
      return Array.from(sections).reverse().find(section => section.offsetTop < currentScroll);
    }
  
    function scrollToSection(section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth"
      });
    }
  
    // ==============================
    // Navbar: ocultar y mostrar dinámicamente (en todas las páginas)
    // ==============================
  
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
  
      lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset;
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
        navbar.style.position = "static";
      }
    });
  
    function makeNavbarSticky() {
      navbar.style.position = "sticky";
      navbar.style.top = "0";
      navbar.style.width = "100%";
    }
  
    // ==============================
    // Modales para productos: lazy loading
    // ==============================
  
    document.addEventListener("click", function (e) {
      const target = e.target.closest("a");
      if (!target || !target.dataset.id) return;
  
      e.preventDefault();
  
      const productoId = target.dataset.id;
      const tipo = target.dataset.type;
  
      const producto = obtenerProducto(productoId);
      if (!producto) return;
  
      if (tipo === "image") {
        crearModal(producto.imgProducto, "modal-imagen");
      }
  
      if (tipo === "ficha") {
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
  