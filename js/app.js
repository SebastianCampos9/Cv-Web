/* ==================================================
   CARRUSEL DE CERTIFICADOS
================================================== */

const escenarioCarrusel = document.querySelector(".escenario-carrusel");
const certificados = document.querySelectorAll(".certificado");
const indicadores = document.querySelectorAll(".indicador");

let posicionActual = 0;
let posicionInicial = 0;
let desplazamiento = 0;
let arrastrando = false;

function actualizarCarrusel() {
  const cantidadCertificados = certificados.length;
  const posicionAnterior =
    (posicionActual - 1 + cantidadCertificados) % cantidadCertificados;
  const posicionSiguiente = (posicionActual + 1) % cantidadCertificados;

  certificados.forEach((certificado, posicion) => {
    certificado.classList.remove("activo", "anterior", "siguiente", "oculto");

    certificado.style.setProperty("--arrastre", "0px");

    if (posicion === posicionActual) {
      certificado.classList.add("activo");
    } else if (posicion === posicionAnterior) {
      certificado.classList.add("anterior");
    } else if (posicion === posicionSiguiente) {
      certificado.classList.add("siguiente");
    } else {
      certificado.classList.add("oculto");
    }
  });

  indicadores.forEach((indicador, posicion) => {
    indicador.classList.toggle("activo", posicion === posicionActual);
  });
}

function comenzarArrastre(evento) {
  arrastrando = true;
  posicionInicial = evento.clientX;
  desplazamiento = 0;

  escenarioCarrusel.classList.add("arrastrando");
  escenarioCarrusel.setPointerCapture(evento.pointerId);
}

function moverCarrusel(evento) {
  if (!arrastrando) {
    return;
  }

  desplazamiento = evento.clientX - posicionInicial;

  certificados.forEach((certificado) => {
    certificado.style.setProperty("--arrastre", `${desplazamiento}px`);
  });
}

function finalizarArrastre() {
  if (!arrastrando) {
    return;
  }

  arrastrando = false;
  escenarioCarrusel.classList.remove("arrastrando");

  const distanciaMinima = 70;

  if (desplazamiento < -distanciaMinima) {
    posicionActual = (posicionActual + 1) % certificados.length;
  } else if (desplazamiento > distanciaMinima) {
    posicionActual =
      (posicionActual - 1 + certificados.length) % certificados.length;
  }

  actualizarCarrusel();
}

escenarioCarrusel.addEventListener("pointerdown", comenzarArrastre);
escenarioCarrusel.addEventListener("pointermove", moverCarrusel);
escenarioCarrusel.addEventListener("pointerup", finalizarArrastre);
escenarioCarrusel.addEventListener("pointercancel", finalizarArrastre);

indicadores.forEach((indicador) => {
  indicador.addEventListener("click", () => {
    posicionActual = Number(indicador.dataset.posicion);
    actualizarCarrusel();
  });
});

/* ==================================================
   MENÚ PARA CELULARES
================================================== */

const botonMenu = document.querySelector(".boton-menu");
const menu = document.querySelector(".menu");
const enlacesMenu = document.querySelectorAll(".menu a");

function alternarMenu() {
  const menuAbierto = menu.classList.toggle("abierto");

  botonMenu.classList.toggle("abierto", menuAbierto);
  botonMenu.setAttribute("aria-expanded", menuAbierto);
  botonMenu.setAttribute(
    "aria-label",
    menuAbierto ? "Cerrar menú" : "Abrir menú",
  );
}

function cerrarMenu() {
  menu.classList.remove("abierto");
  botonMenu.classList.remove("abierto");
  botonMenu.setAttribute("aria-expanded", "false");
  botonMenu.setAttribute("aria-label", "Abrir menú");
}

botonMenu.addEventListener("click", alternarMenu);

enlacesMenu.forEach((enlace) => {
  enlace.addEventListener("click", cerrarMenu);
});

/* ==================================================
   ANIMACIONES AL HACER SCROLL
================================================== */

const elementosAnimados = document.querySelectorAll(`
  .encabezado-seccion,
  .sobre-mi-contenido,
  .experiencia,
  .tarjeta-estudio,
  .grupo-habilidades,
  .carrusel-certificados,
  .proyecto,
  .contacto-contenido
`);

elementosAnimados.forEach((elemento, posicion) => {
  elemento.classList.add("elemento-animado");

  const demora = (posicion % 4) * 80;
  elemento.style.transitionDelay = `${demora}ms`;
});

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  },
  {
    threshold: 0.15,
  },
);

elementosAnimados.forEach((elemento) => {
  observador.observe(elemento);
});

/* ==================================================
   SECCIÓN ACTIVA EN EL MENÚ
================================================== */

const seccionesPagina = document.querySelectorAll("main section[id]");
const enlacesNavegacion = document.querySelectorAll('.menu a[href^="#"]');

function actualizarEnlaceActivo() {
  const posicionScroll = window.scrollY + 180;

  seccionesPagina.forEach((seccion) => {
    const inicioSeccion = seccion.offsetTop;
    const finalSeccion = inicioSeccion + seccion.offsetHeight;
    const idSeccion = seccion.getAttribute("id");

    if (posicionScroll >= inicioSeccion && posicionScroll < finalSeccion) {
      enlacesNavegacion.forEach((enlace) => {
        const correspondeASeccion =
          enlace.getAttribute("href") === `#${idSeccion}`;

        enlace.classList.toggle("enlace-activo", correspondeASeccion);

        if (correspondeASeccion) {
          enlace.setAttribute("aria-current", "page");
        } else {
          enlace.removeAttribute("aria-current");
        }
      });
    }
  });
}

/* ==================================================
   BOTÓN VOLVER ARRIBA
================================================== */

const botonVolverArriba = document.querySelector(".volver-arriba");

function controlarBotonVolverArriba() {
  botonVolverArriba.classList.toggle("visible", window.scrollY > 500);
}

botonVolverArriba.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  actualizarEnlaceActivo();
  controlarBotonVolverArriba();
});

/* ==================================================
   INICIALIZACIÓN
================================================== */

actualizarCarrusel();
actualizarEnlaceActivo();
controlarBotonVolverArriba();
