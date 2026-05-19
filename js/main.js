'use strict';


(function initScrollAnimations() {
  const elementos = document.querySelectorAll(
    '.tarjeta-mate, .paso, .tarjeta-curar, .producto-detalle'
  );

  if (!elementos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elementos.forEach((el) => observer.observe(el));
})();


(function initFormulario() {
  const form = document.getElementById('formContacto');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre  = document.getElementById('nombre');
    const email   = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');

    let valido = true;

    document.querySelectorAll('.error-msg').forEach((el) => el.remove());
    document.querySelectorAll('.campo-error').forEach((el) =>
      el.classList.remove('campo-error')
    );

    if (!nombre.value.trim() || nombre.value.trim().length < 2) {
      mostrarError(nombre, 'Ingresá tu nombre completo.');
      valido = false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.value.trim())) {
      mostrarError(email, 'Ingresá un correo electrónico válido.');
      valido = false;
    }

    if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
      mostrarError(mensaje, 'El mensaje debe tener al menos 10 caracteres.');
      valido = false;
    }

    if (valido) {
      mostrarExito(form);
    }
  });

  function mostrarError(campo, texto) {
    campo.classList.add('campo-error');
    const msg = document.createElement('p');
    msg.className = 'error-msg';
    msg.textContent = texto;
    msg.style.cssText = 'color:#c0392b;font-size:.82rem;margin-top:4px;';
    campo.parentNode.appendChild(msg);
    campo.focus();
  }

  function mostrarExito(form) {
    form.innerHTML = `
      <div style="text-align:center;padding:40px 20px;">
        <p style="font-size:3rem;margin-bottom:16px;">✅</p>
        <h3 style="font-family:'Playfair Display',serif;color:#5c3d1e;">¡Mensaje enviado!</h3>
        <p style="color:#7a6a5a;margin-top:8px;">Te respondemos a la brevedad. ¡Gracias por escribirnos!</p>
      </div>`;
  }
})();

(function initBusqueda() {
  document.querySelectorAll('form[role="search"]').forEach((form) => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="search"]');
      const query = input ? input.value.trim() : '';
      if (query.length > 1) {
        
        console.info(`Búsqueda solicitada: "${query}"`);
      }
      if (input) input.value = '';
    });
  });
})();

(function setActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href').split('/').pop();
    if (href && href === path && !link.classList.contains('dropdown-toggle')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
