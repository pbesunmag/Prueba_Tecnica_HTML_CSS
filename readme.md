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
  * Recuperación íntegra del estado de la sesión tras recargar la página.
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
* **Cuenta atrás de funciones en vivo**:
  * Contador dinámico sincronizado hacia la fecha y hora de la próxima función (y sus pases sucesivos).

---

## 🛠️ Arquitectura Técnica y Buenas Prácticas

* **Single Source of Truth (SoT)**: El DOM nunca actúa como almacén de datos. El estado de la aplicación reside exclusivamente en estructuras de datos en JavaScript (`tasks`, `showStatus`, `seats`).
* **Renderizado centralizado**: Funciones de renderizado dedicadas (`renderTasks()`, `renderShowStatus()`, `renderSeating()`) que transforman el estado en nodos del DOM, evitando mutaciones directas dispersas en los controladores de eventos.
* **Vanilla JavaScript estricto**: Sin frameworks, sin jQuery y sin librerías externas. Manipulación pura del DOM mediante:
  * `document.createElement`, `appendChild`, `classList` y `innerHTML`.
  * `querySelector` y `getElementById`.
  * Delegación de eventos eficiente con `addEventListener`.
* **Accesibilidad (a11y)**: Roles ARIA, avisos dinámicos en vivo (`aria-live="polite"`), clases de soporte visual (`.sr-only`) y foco en modales nativos.

---

## 📁 Estructura del Proyecto

```text
/todo-list-godot
├── base_cartel.jpg      # Cartel oficial de la obra (fondo visual)
├── index.html           # Versión en Catalán (por defecto)
├── index-es.html        # Versión en Castellano
├── index-en.html        # Versión en Inglés
├── style.css            # Estilos globales, variables CSS y diseño responsive
├── js/
│   └── app.js           # Lógica de la aplicación, estado global y eventos del DOM
└── README.md            # Documentación técnica del proyecto