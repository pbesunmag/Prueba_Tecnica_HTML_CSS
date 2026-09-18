# 🎭 Preparación Escena – La magia de Godot (Todo List Dinámica)

Aplicación web interactiva desarrollada con **JavaScript Vanilla**, **HTML5 semántico** y **CSS3**. Evolución de la interfaz estática original hacia una solución dinámica orientada al patrón **Single Source of Truth (SoT)**, reactividad de estado y persistencia de datos.

El proyecto está ambientado en el checklist técnico real entre bambalinas de la producción teatral y de magia *La màgia d'en Godot*.

---

## 🎩 Trasfondo y Conexión Personal

> *"La magia sobre el escenario parece espontánea, pero cada milagro visual es el resultado de un rigor meticuloso detrás del telón."*

Esta Todo List reproduce el listado de comprobación técnica utilizado antes de abrir puertas en *La màgia d'en Godot*: preparación de cargas, revisión de ilusiones de escena (*Assistant's Revenge*), comprobación de pistas de sonido y disposición de atrezo antes de comenzar la función.

---

## 🚀 Funcionalidades Principales

* **Gestión dinámica de tareas**:
  * Adición de tareas mediante formulario interactivo (botón de acción o pulsando la tecla `Enter`).
  * Conmutación de estado completado con actualización visual en tiempo real (tachado y atenuación cromática).
  * Eliminación individualizada de tareas por identificador único.
  * Vaciado masivo de tareas completadas y opción de reseteo total de la lista con diálogo nativo de confirmación de seguridad (`window.confirm`) para prevenir errores durante el directo.
* **Barra de progreso de escena y filtros reactivos**:
  * Indicador visual de progreso con cálculo porcentual automático y recuento en vivo de tareas listas frente al total.
  * Sistema de filtrado instantáneo (*Todas*, *Pendientes*, *Completadas*) que no altera el array de estado global, únicamente la capa de renderizado.
* **Persistencia total (`localStorage`)**:
  * Almacenamiento automático en el navegador de tareas, estado del show y patio de butacas.
  * Recuperación íntegra de la sesión tras recargar la página, con verificación y migración limpia de esquemas de datos anteriores.
* **Internacionalización y traducción dinámica**:
  * Interfaz multilingüe nativa (Català, Castellano, English).
  * Las 15 tareas base cargan su terminología técnica teatral verificada en los tres idiomas.
  * Traducción asíncrona automática para tareas nuevas añadidas por el usuario mediante la API pública de **MyMemory**.
* **Control interactivo del espectáculo**:
  * Selector reactivo de estado (*En preparación*, *Cancelado*, *¡Preparados!*) con indicador luminoso intermitente y persistencia asociada.
* **Simulación interactiva de patio de butacas**:
  * Modal accesible (`<dialog>`) con el plano de la sala (50 localidades).
  * Tipología de asientos: estándar, PMR (accesibles) y técnicos/bloqueados.
  * Reserva y liberación de butacas en tiempo real con recálculo automático de la barra de aforo del pie de página.
* **Cuenta atrás multifecha y navegación GPS**:
  * Temporizador dinámico sincronizado hacia la fecha de la próxima función [27 de septiembre(Fecha real del estreno de mi obra. ¡Deseadme mucha mierda!) y 18 de octubre a las 18:00h] con gestión secuencial de pases de 15 minutos.
  * Disparador táctil y accesible integrado en el propio cronómetro para abrir el modal informativo de la función.
  * Enlace oficial configurado con la API universal de Google Maps (`dir/?api=1&destination=Els+Carlins...`) para iniciar navegación GPS paso a paso hacia el teatro *Els Carlins* de Manresa.

---

## 🛠️ Arquitectura Técnica y Buenas Prácticas

* **Single Source of Truth (SoT)**: El DOM actúa únicamente como reflejo visual del estado. Todos los datos residen exclusivamente en memoria JavaScript (`tasks`, `showStatus`, `seats`, `currentFilter`).
* **Renderizado centralizado**: Funciones modulares dedicadas (`renderTasks()`, `renderShowStatus()`, `renderSeating()`, `updateSeatingSummary()`) encargadas de limpiar y reconstruir los nodos necesarios a partir del estado, evitando mutaciones dispersas del DOM.
* **Vanilla JavaScript estricto**: Sin dependencias, jQuery ni frameworks externos. Manipulación limpia mediante:
  * `document.createElement`, `appendChild`, `classList`, `dataset` e `innerHTML`.
  * `querySelector`, `querySelectorAll` y `getElementById`.
  * Delegación de eventos eficiente con `addEventListener`.
  * Gestión nativa de ventanas modales con la API HTML5 Dialog (`showModal()`, `close()`).
* **Accesibilidad (a11y)**: Roles ARIA, regiones reactivas anunciadas en vivo (`aria-live="polite"`), clases de soporte visual (`.sr-only`), foco retenido en modales nativos y enlaces con atributos seguros `rel="noopener noreferrer"`.

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