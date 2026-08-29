# 🎭 Preparación Escena – La magia de Godot (Todo List Estática)

Aplicación web estática tipo **Todo List** desarrollada como prueba técnica de maquetación con **HTML5 semántico** y **CSS3 puro**. El proyecto está ambientado en la preparación técnica entre bambalinas de la producción teatral y de magia *La màgia d'en Godot*.

---

## 🎩 Trasfondo y Conexión Personal

> *"La magia sobre el escenario parece espontánea, pero cada milagro visual es el resultado de un rigor meticuloso detrás del telón."*

Esta Todo List no es un simple listado de tareas genéricas; es el reflejo fiel del *checklist* real que utilizamos entre bastidores antes de abrir puertas en cada función de **La màgia d'en Godot**. Desde la revisión del pañuelo volador y las cargas de vestuario hasta la comprobación técnica de la gran ilusión (*Assistant's Revenge*) y la sincronización de las pistas de sonido, cada detalle cuenta para que la ilusión funcione sin fisuras.

El diseño visual traslada la atmósfera del teatro a la pantalla: tonos oscuros y sobrios inspirados en el backstage, destellos dorados que evocan la esencia del ilusionismo, el cartel oficial de la obra integrado en el fondo y una estructura ordenada pensada para mantener la calma y el control bajo la presión del directo antes de desear *"mucha mierda"*.

---

## ✨ Características

* **100% HTML5 & CSS3 puro**: Sin dependencias externas, frameworks JavaScript ni librerías pesadas.
* **Semántica web estricta**: Estructura limpia mediante `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<form>`, `<label>`, `<button>`, `<ul>` y `<footer>`.
* **Diseño responsive avanzado**: Adaptación fluida mediante Flexbox y Media Queries para dispositivos móviles, tablets y pantallas de escritorio.
* **Sistema multilingüe estático**: Navegación nativa entre 3 idiomas (Catalán, Castellano e Inglés) compartiendo una única hoja de estilos centralizada.
* **Temática teatral integrada**:
  * Cartel original de la obra (`base_cartel.jpg`) integrado con efecto *overlay* y fijación en scroll.
  * Contador estático de tiempo restante para la próxima función (`<aside>`).
  * Simulación visual del aforo de la sala con barra de progreso.
  * Selector simulado de estado del espectáculo con desplegable estilizado.
* **Accesibilidad (a11y)**: Clases para lectores de pantalla (`.sr-only`), vinculación correcta de atributos `for`/`id` en etiquetas `<label>` y roles ARIA.

---

## 📁 Estructura del Proyecto

```text
/prueba_tecnica_HTML_CSS
├── base_cartel.jpg       # Cartel oficial de la obra (fondo visual)
├── index.html            # Versión en Catalán (por defecto)
├── index-es.html         # Versión en Castellano
├── index-en.html         # Versión en Inglés
├── style.css             # Hoja de estilos centralizada y variables temáticas
└── README.md             # Documentación del proyecto