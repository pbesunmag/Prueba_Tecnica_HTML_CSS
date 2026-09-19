# 🎭 Preparación Escena – La magia de Godot (Todo List Dinámica)

Aplicación web interactiva desarrollada con **JavaScript Vanilla**, **HTML5 semántico** y **CSS3**. Evolución de la interfaz estática original hacia una solución dinámica orientada al patrón **Single Source of Truth (SoT)**, reactividad de estado y persistencia de datos.

El proyecto está ambientado en el checklist técnico real entre bambalinas de la producción teatral y de magia *La màgia d'en Godot*.

---

## 🎩 Trasfondo y Conexión Personal

> *"La magia sobre el escenario parece espontánea, pero cada milagro visual es el resultado de un rigor meticuloso detrás del telón."*

Esta Todo List reproduce el listado de comprobación técnica utilizado antes de abrir puertas en *La màgia d'en Godot*: preparación de cargas, revisión de ilusiones de escena (*Assistant's Revenge*), comprobación de pistas de sonido y disposición de atrezo antes de comenzar la función.

---

## 🚀 Funcionalidades Principales

* **Gestión dinámica y edición avanzada de tareas**:
  * Adición de tareas mediante formulario interactivo (botón de acción o pulsando la tecla `Enter`).
  * Conmutación de estado completado con actualización visual inmediata (tachado y atenuación cromática).
  * **Edición inline (doble clic)**: Permite modificar el texto de cualquier tarea directamente en la lista sin necesidad de eliminarla y volverla a crear, confirmando con `Enter` o descartando con `Escape`.
  * **Reordenación por arrastre (HTML5 Drag & Drop)**: Sistema nativo para mover y ordenar las tareas arrastrando desde el tirador (`⋮⋮`), reestructurando el orden de la secuencia técnica directamente en el estado.
  * Eliminación individualizada de tareas por identificador único.
  * Vaciado selectivo de completadas y reseteo total con ventana nativa de confirmación de seguridad (`window.confirm`).
* **Barra de progreso de escena y filtros reactivos**:
  * Indicador visual de progreso con cálculo porcentual automático y recuento en vivo de tareas listas frente al total.
  * Sistema de filtrado instantáneo (*Todas*, *Pendientes*, *Completadas*) que actúa únicamente en la capa de renderizado sin alterar el array de estado global.
* **Copia de seguridad y portabilidad (Exportar / Importar JSON)**:
  * Descarga instantánea del estado completo (tareas, patio de butacas y estado del show) en un archivo `godot-checklist.json` para facilitar la migración entre dispositivos o navegadores.
  * Selector de importación de archivos `.json` con validación de estructura para restaurar montajes y configuraciones técnicas previas.
* **Persistencia total (`localStorage`)**:
  * Almacenamiento automático de tareas, orden de la lista, estado del show y patio de butacas.
  * Recuperación íntegra de la sesión tras recargar la página, con migración limpia de esquemas de datos anteriores.
* **Internacionalización y traducción dinámica**:
  * Interfaz multilingüe nativa (Català, Castellano, English).
  * Las 15 tareas base cargan su terminología técnica teatral verificada en los tres idiomas.
  * Traducción asíncrona automática para tareas nuevas añadidas por el usuario mediante la API pública de **MyMemory**.
* **Control interactivo del espectáculo**:
  * Selector reactivo de estado (*En preparación*, *Cancelado*, *¡Preparados!*) que actualiza en tiempo real el indicador luminoso intermitente y sincroniza su persistencia al cambiar de opción.
* **Simulación interactiva de patio de butacas**:
  * Modal accesible (`<dialog>`) con el plano de la sala (50 localidades).
  * Tipología de asientos: estándar, PMR (accesibles) y técnicos/bloqueados.
  * Reserva y liberación de butacas en tiempo real con recálculo automático de la barra de aforo del pie de página.
* **Cuenta atrás multifecha y navegación GPS**:
  * Temporizador dinámico sincronizado hacia la fecha de la próxima función [27 de septiembre(Fecha real de estreno. ¡Deseadme mucha mierda!) y 18 de octubre a las 18:00h] con gestión secuencial de pases de 15 minutos.
  * Disparador táctil y accesible integrado en el propio cronómetro para abrir el modal informativo de la función.
  * Enlace oficial configurado con la API universal de Google Maps (`dir/?api=1&destination=Els+Carlins...`) para iniciar navegación GPS paso a paso hacia el teatro *Els Carlins* de Manresa.

---

## 🛠️ Arquitectura Técnica y Buenas Prácticas

* **Single Source of Truth (SoT)**: El DOM actúa únicamente como reflejo visual del estado. Todos los datos residen centralizados en memoria JavaScript (`tasks`, `showStatus`, `seats`, `currentFilter`).
* **Renderizado centralizado**: Funciones modulares dedicadas (`renderTasks()`, `renderShowStatus()`, `renderSeating()`, `updateSeatingSummary()`) encargadas de reconstruir los nodos necesarios a partir del estado, evitando mutaciones directas y dispersas en los eventos.
* **Vanilla JavaScript estricto**: Sin dependencias, librerías pesadas ni frameworks externos. Manipulación limpia mediante:
  * `document.createElement`, `appendChild`, `classList`, `dataset` e `innerHTML`.
  * `querySelector`, `querySelectorAll` y `getElementById`.
  * Delegación de eventos eficiente con `addEventListener`.
  * API nativa HTML5 Drag and Drop (`dragstart`, `dragover`, `dragleave`, `drop`, `dragend`).
  * API nativa HTML5 Dialog (`showModal()`, `close()`) y FileReader para la ingesta de JSON.
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
│   └── app.js           # Lógica central, estado SoT, eventos, Drag&Drop y cálculo temporal
└── README.md            # Documentación técnica del proyecto
