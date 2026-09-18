# 🎭 Preparació Escena – La màgia d'en Godot (Todo List Dinàmica)

Aplicació web interactiva desenvolupada amb **JavaScript Vanilla**, **HTML5 semàntic** i **CSS3**. Evolució de la interfície estàtica original cap a una solució dinàmica orientada al patró **Single Source of Truth (SoT)**, reactivitat d'estat i persistència de dades.

El projecte està ambientat en el checklist tècnic real entre bambolines de la producció teatral i d'il·lusionisme *La màgia d'en Godot*.

---

## 🎩 Rerefons i Connexió Personal

> *"La màgia sobre l'escenari sembla espontània, però cada miracle visual és el resultat d'un rigor meticulós darrere del teló."*

Aquesta Todo List reprodueix el llistat de comprovació tècnica utilitzat abans d'obrir portes a *La màgia d'en Godot*: preparació de càrregues, revisió de grans il·lusions en escena (*Assistant's Revenge*), comprovació de pistes de so a taula i disposició d'atrezzo abans de començar el xou.

---

## 🚀 Funcionalitats Principals

* **Gestió dinàmica de tasques**:
  * Inserció de tasques mitjançant formulari interactiu (botó d'acció o tecla `Enter`).
  * Commutació d'estat completat amb actualització visual en temps real (ratllat i atenuació cromàtica).
  * Eliminació individualitzada de tasques per identificador únic.
  * Neteja massiva de tasques completades i opció de restabliment total de la llista amb diàleg natiu de confirmació de seguretat (`window.confirm`) per evitar errors durant el directe.
* **Barra de progrés d'escena i filtres reactius**:
  * Indicador visual de progrés amb càlcul percentual automàtic i comptador dinàmic de tasques llestes sobre el total.
  * Sistema de filtratge instantani (*Totes*, *Pendents*, *Completades*) que no altera l'estat global, només la capa de presentació.
* **Persistència total (`localStorage`)**:
  * Emmagatzematge automàtic al navegador de tasques, estat del xou i pati de butaques.
  * Recuperació íntegra de la sessió en recarregar la pàgina amb neteja i migració d'esquemes heretats.
* **Internacionalització i traducció dinàmica**:
  * Interfície multilingüe nativa (Català, Castellano, English).
  * Les 15 tasques base carreguen la seva terminologia tècnica teatral verificada en els tres idiomes.
  * Traducció asíncrona automàtica de tasques noves mitjançant la invocació a la API pública de **MyMemory**.
* **Control d'estat de l'espectacle**:
  * Selector reactiu d'estat (*En preparació*, *Cancel·lat*, *Preparats!*) amb indicador lluminós polsant i persistència associada.
* **Simulació de pati de butaques**:
  * Modal accessible (`<dialog>`) amb el mapa interactiu de la sala (50 localitats).
  * Tipologia de seients: estàndard, PMR (accessibles) i tècnica/bloquejada.
  * Reserva i alliberament de butaques en temps real amb sincronització immediata de la barra d'aforament del footer.
* **Comptador dinàmic multidata i navegació GPS**:
  * Rellotge sincronitzat amb la propera funció (27 de setembre i 18 d'octubre a les 18:00h) amb gestió seqüencial de passis cada 15 minuts.
  * Disparador interactiu integrat al mateix comptador per obrir el modal informatiu de l'espai escènic.
  * Enllaç oficial integrat amb la API universal de Google Maps (`dir/?api=1&destination=Els+Carlins...`) per iniciar navegació GPS pas a pas cap al teatre *Els Carlins* de Manresa.

---

## 🛠️ Arquitectura Tècnica i Bones Pràctiques

* **Single Source of Truth (SoT)**: El DOM actua exclusivament com a reflex de les dades. L'estat resideix centralitzat en memòria JavaScript (`tasks`, `showStatus`, `seats`, `currentFilter`).
* **Renderitzat centralitzat**: Funcions modulars (`renderTasks()`, `renderShowStatus()`, `renderSeating()`, `updateSeatingSummary()`) que netegen i reconstrueixen els nodes a partir de l'estat, evitant la manipulació dispersa del DOM.
* **Vanilla JavaScript estricte**: Sense frameworks ni llibreries auxiliars. Ús de mètodes nadius:
  * `document.createElement`, `appendChild`, `classList`, `dataset` i `innerHTML`.
  * `querySelector`, `querySelectorAll` i `getElementById`.
  * Delegació d'esdeveniments eficient amb `addEventListener`.
  * API nativa HTML5 Dialog (`showModal()`, `close()`).
* **Accessibilitat (a11y)**: Rols ARIA, anuncis en viu per a lectors de pantalla (`aria-live="polite"`), classes per a contingut visual amagat (`.sr-only`), enfocament contingut en modales i enllaços externs segurs (`rel="noopener noreferrer"`).

---

## 📁 Estructura del Projecte

```text
/todo-list-godot
├── base_cartel.jpg      # Cartell oficial de l'obra (fons visual)
├── index.html           # Versió en Català (per defecte)
├── index-es.html        # Versió en Castellà
├── index-en.html        # Versió en Anglès
├── style.css            # Estils globals, variables CSS, modales i disseny responsive
├── js/
│   └── app.js           # Lògica d'estat central, renderitzat, esdeveniments i càlcul temporal
└── README.md            # Documentació tècnica del projecte