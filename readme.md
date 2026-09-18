# 🎭 Preparació Escena – La màgia d'en Godot (Todo List Dinámica)

Aplicación web interactiva desarrollada con **JavaScript Vanilla**, **HTML5 semántico** y **CSS3**. Evolución de la interfaz estática original hacia una solución dinámica orientada al patrón **Single Source of Truth (SoT)** y persistencia de datos.

El proyecto está ambientado en el checklist técnico real entre bambalinas de la producción teatral y de magia *La màgia d'en Godot*.

---

## 🎩 Trasfondo y Conexión Personal

> *"La magia sobre el escenario parece espontánea, pero cada milagro visual es el resultado de un rigor meticuloso detrás del telón."*

Esta Todo List reproduce el listado de comprobación técnica que se utiliza entre bastidores antes de abrir puertas en *La màgia d'en Godot*: preparación de cargas, revisión de ilusiones de escena (*Assistant's Revenge*), comprobación de pistas sonoras y orden de atrezo antes de comenzar la función.

---

## 🚀 Funcionalidades Principales

* **Gestión dinámica de tareas**:
  * Adición de tareas mediante formulario interactivo (pulsando botón o mediante tecla `Enter`).
  * Conmutación de tareas completadas con actualización visual en tiempo real (tachado y atenuación).
  * Eliminación individual de tareas por identificador.
  * Borrado masivo de tareas completadas y opción de reset total de la lista.
* **Persistencia total (`localStorage`)**:
  * Guardado automático en el navegador de tareas, estado del show y localidades.
  * Recuperación íntegra del estado de la sesión tras recargar la página con sanitización de esquemas heredados.
* **Internacionalización y traducción dinámica**:
  * Interfaz multilingüe nativa (Català, Castellano, English).
  * Las tareas iniciales cargan su traducción técnica verificada en los tres idiomas.
  * Traducción automática asíncrona de tareas añadidas por el usuario al alternar de idioma mediante la API pública de **MyMemory**.
* **Control interactivo del espectáculo**:
  * Selector reactivo de estado del show (*En preparación*, *Cancelado*, *¡Preparados!*) con indicador luminoso sincronizado y persistente.
* **Simulación interactiva de patio de butacas**:
  * Modal accesible (`<dialog>`) con el plano de la sala (50 localidades).
  * Tipología de butacas: estándar, PMR (accesibles) y bloqueadas por necesidades técnicas.
  * Conmutación de reservas en tiempo real con recálculo automático de la barra de aforo y estadísticas del footer.
* **Cuenta atrás multifecha y navegación interactiva**:
  * Contador dinámico sincronizado hacia la fecha y hora de la próxima función (27 de septiembre y 18 de octubre a las 18:00h) con soporte automático para pases secuenciales cada 15 minutos.
  * Disparador táctil/accesible integrado en el propio cronómetro para consultar la información del bolo.
  * Modal de espacio escénico con calendario de pases, ubicación física del teatro (*Els Carlins*) y enlace directo configurado con la API universal de Google Maps (`dir/?api=1&destination=...`) para iniciar navegación GPS paso a paso en terminales móviles y navegadores de escritorio.

---

## 🛠️ Arquitectura Técnica y Buenas Prácticas

* **Single Source of Truth (SoT)**: El DOM nunca actúa como almacén de datos. El estado de la aplicación reside exclusivamente en estructuras de datos en JavaScript (`tasks`, `showStatus`, `seats`).
* **Renderizado centralizado**: Funciones de renderizado dedicadas (`renderTasks()`, `renderShowStatus()`, `renderSeating()`, `updateSeatingSummary()`) que transforman el estado en nodos del DOM, evitando mutaciones directas dispersas en los controladores de eventos.
* **Vanilla JavaScript estricto**: Sin frameworks, sin jQuery y sin dependencias externas. Manipulación limpia mediante:
  * `document.createElement`, `appendChild`, `classList` e `innerHTML`.
  * `querySelector` y `getElementById`.
  * Delegación de eventos eficiente con `addEventListener`.
  * Gestión nativa de ventanas emergentes con la API HTML5 Dialog (`showModal()`, `close()`).
* **Accesibilidad (a11y)**: Roles ARIA, regiones reactivas anunciadas en vivo (`aria-live="polite"`), clases de soporte visual (`.sr-only`), foco contenido en modales nativos y enlaces con atributos de seguridad `rel="noopener noreferrer"`.

---

## 📁 Estructura del Proyecto

```text
/todo-list-godot
├── base_cartel.jpg      # Cartel oficial de la obra (fondo visual)
├── index.html           # Versión en Catalán (por defecto)
├── index-es.html        # Versión en Castellano
├── index-en.html        # Versión en Inglés
├── style.css            # Estilos globales, variables CSS, modales y diseño responsive
├── js/
│   └── app.js           # Lógica central, estado SoT, eventos y cálculo temporal
└── README.md            # Documentación técnica del proyecto