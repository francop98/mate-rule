'use strict';

/* =========================================================
   carrito.js — mate-rule
   Módulo de carrito de compras. Maneja el estado del carrito,
   la renderización del drawer y el flujo de checkout simulado.
   Requiere: SweetAlert2
   ========================================================= */


// ── Estado del carrito (array de objetos) ────────────────────────────────────

let carrito = [];


// ── Renderizar el drawer del carrito ─────────────────────────────────────────

function renderizarCarrito() {
  const lista   = document.getElementById('carrito-lista');
  const total   = document.getElementById('carrito-total');
  const contador = document.getElementById('carrito-contador');

  if (!lista || !total) return;

  lista.innerHTML = '';

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    total.textContent = '$0';
    if (contador) {
      contador.textContent = '0';
      contador.style.display = 'none';
    }
    return;
  }

  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'carrito-item';
    li.innerHTML = `
      <div class="carrito-item__info">
        <span class="carrito-item__nombre">${item.nombre}</span>
        <span class="carrito-item__precio">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
      </div>
      <div class="carrito-item__controles">
        <button class="carrito-btn-cantidad" data-index="${index}" data-accion="restar">−</button>
        <span class="carrito-item__cantidad">${item.cantidad}</span>
        <button class="carrito-btn-cantidad" data-index="${index}" data-accion="sumar">+</button>
        <button class="carrito-btn-eliminar" data-index="${index}" aria-label="Eliminar ${item.nombre}">🗑</button>
      </div>
    `;
    lista.appendChild(li);
  });

  const totalValor = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  total.textContent = `$${totalValor.toLocaleString('es-AR')}`;

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  if (contador) {
    contador.textContent = cantidadTotal;
    contador.style.display = cantidadTotal > 0 ? 'flex' : 'none';
  }

  // Eventos de los botones de cantidad y eliminar
  lista.querySelectorAll('.carrito-btn-cantidad').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx    = parseInt(btn.dataset.index);
      const accion = btn.dataset.accion;

      if (accion === 'sumar') {
        carrito[idx].cantidad++;
      } else if (accion === 'restar') {
        carrito[idx].cantidad--;
        if (carrito[idx].cantidad <= 0) {
          carrito.splice(idx, 1);
        }
      }
      renderizarCarrito();
    });
  });

  lista.querySelectorAll('.carrito-btn-eliminar').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      carrito.splice(idx, 1);
      renderizarCarrito();
    });
  });
}


// ── Agregar producto al carrito ───────────────────────────────────────────────

function agregarAlCarrito(producto) {
  const existente = carrito.find((item) => item.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  renderizarCarrito();

  Swal.fire({
    toast: true,
    position: 'bottom-end',
    icon: 'success',
    title: `${producto.nombre} agregado al carrito`,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    customClass: { popup: 'swal-toast-mate' },
  });
}


// ── Checkout simulado ─────────────────────────────────────────────────────────

function iniciarCheckout() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'Agregá productos antes de continuar.',
      confirmButtonColor: '#896941',
    });
    return;
  }

  const resumen = carrito
    .map((i) => `• ${i.nombre} x${i.cantidad} — $${(i.precio * i.cantidad).toLocaleString('es-AR')}`)
    .join('\n');

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  Swal.fire({
    title: 'Confirmar pedido',
    html: `
      <div style="text-align:left;font-size:.9rem;color:#5c3d1e;">
        <pre style="font-family:'Lato',sans-serif;white-space:pre-wrap;margin-bottom:12px;">${resumen}</pre>
        <hr style="border-color:#ede3d4;">
        <p style="margin-top:12px;font-size:1.1rem;font-weight:700;color:#896941;">
          Total: $${total.toLocaleString('es-AR')}
        </p>
        <p style="margin-top:8px;color:#7a6a5a;font-size:.82rem;">
          Al confirmar, te contactaremos por email para coordinar el pago y el envío.
        </p>
      </div>`,
    showCancelButton: true,
    confirmButtonText: 'Confirmar pedido',
    cancelButtonText: 'Seguir comprando',
    confirmButtonColor: '#896941',
    cancelButtonColor: '#7a6a5a',
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      renderizarCarrito();
      cerrarCarrito();

      Swal.fire({
        icon: 'success',
        title: '¡Pedido confirmado!',
        html: `
          <p style="color:#7a6a5a;">
            Recibimos tu solicitud. En breve nos comunicamos con vos para coordinar el pago y el envío.<br><br>
            ¡Gracias por elegirnos! 🧉
          </p>`,
        confirmButtonColor: '#896941',
        confirmButtonText: '¡Genial!',
      });
    }
  });
}


// ── Drawer del carrito (abrir / cerrar) ───────────────────────────────────────

function abrirCarrito() {
  const drawer = document.getElementById('carrito-drawer');
  const overlay = document.getElementById('carrito-overlay');
  if (drawer)  drawer.classList.add('carrito-drawer--abierto');
  if (overlay) overlay.classList.add('carrito-overlay--visible');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  const drawer  = document.getElementById('carrito-drawer');
  const overlay = document.getElementById('carrito-overlay');
  if (drawer)  drawer.classList.remove('carrito-drawer--abierto');
  if (overlay) overlay.classList.remove('carrito-overlay--visible');
  document.body.style.overflow = '';
}


// ── Inicialización del módulo ─────────────────────────────────────────────────

(function initCarrito() {
  const btnAbrir    = document.getElementById('btn-carrito');
  const btnCerrar   = document.getElementById('carrito-cerrar');
  const btnCheckout = document.getElementById('carrito-checkout');
  const overlay     = document.getElementById('carrito-overlay');

  if (btnAbrir)    btnAbrir.addEventListener('click', abrirCarrito);
  if (btnCerrar)   btnCerrar.addEventListener('click', cerrarCarrito);
  if (btnCheckout) btnCheckout.addEventListener('click', iniciarCheckout);
  if (overlay)     overlay.addEventListener('click', cerrarCarrito);

  renderizarCarrito();
})();


// ── Exportar para uso desde otros módulos ────────────────────────────────────

window.MateRule = window.MateRule || {};
window.MateRule.agregarAlCarrito = agregarAlCarrito;