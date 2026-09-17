/**
 * Todo List - La màgia d'en Godot
 * Vanilla JS - Single Source of Truth Architecture
 * Gestión de Tareas, Estado del Espectáculo y Patio de Butacas Multilingüe
 */

// --- 1. DATOS POR DEFECTO (TAREAS INICIALES SINCRONIZADAS) ---
const defaultTasksCA = [
    "Tauleta mag, paperera i biombo",
    "Mocador volador: Posar pila, encendre botó, comprovar comandament (butxaca Pol) i col·locar en escena",
    "Jaqueta: Ficar got i mocador llarg",
    "Carpeta Pol",
    "Mocador cassola",
    "Rosa",
    "Papers Aina",
    "Streamer boca",
    "Bossa Ampolla: Enganxar moneda amb celo",
    "Varetes al maletí",
    "Cub Rubik: Desplegar, aguantar-ho amb una pinça i ficar tros de xocolata",
    "Mòbil Aina i Pol",
    "Comprovar àudios",
    "Comprovar Assistant's",
    "Desitjar molta merda i resar que els trucs surtin bé 🎭"
];

const defaultTasksES = [
    "Mesita mago, papelera y biombo",
    "Pañuelo volador: Poner pila, encender botón, comprobar mando (bolsillo Pol) y colocar en escena",
    "Chaqueta: Meter vaso y pañuelo largo",
    "Carpeta Pol",
    "Pañuelo cazuela",
    "Rosa",
    "Papeles Aina",
    "Streamer boca",
    "Bolsa Botella: Pegar moneda con celo",
    "Varitas al maletín",
    "Cubo Rubik: Desplegar, aguantarlo con una pinza y meter trozo de chocolate",
    "Móvil Aina y Pol",
    "Comprobar audios",
    "Comprobar Assistant's",
    "Desear mucha mierda y rezar que los trucos salgan bien 🎭"
];

const defaultTasksEN = [
    "Magician's table, bin and folding screen",
    "Flying handkerchief: Insert battery, turn on button, check remote (Pol's pocket) and place on stage",
    "Jacket: Put glass and long handkerchief inside",
    "Pol's folder",
    "Pan handkerchief",
    "Rose",
    "Aina's papers",
    "Mouth streamer",
    "Bottle bag: Stick coin with tape",
    "Wands in the briefcase",
    "Rubik's Cube: Unfold, hold with a clip and insert piece of chocolate",
    "Aina & Pol's mobile",
    "Check audios",
    "Check Assistant's",
    "Break a leg and pray the tricks go well 🎭"
];

// --- 2. DICCIONARIOS MULTILINGÜES DE INTERFAZ DINÁMICA ---
const showStatusDictionary = {
    ca: {
        prefix: "Estat de l'espectacle:",
        prep: "En preparació",
        cancelled: "Cancel·lat",
        ready: "Preparats!"
    },
    es: {
        prefix: "Estado del espectáculo:",
        prep: "En preparación",
        cancelled: "Cancelado",
        ready: "¡Preparados!"
    },
    en: {
        prefix: "Show status:",
        prep: "In preparation",
        cancelled: "Cancelled",
        ready: "Ready!"
    }
};

const seatingDictionary = {
    ca: {
        seatsUnit: "butaques",
        sold: "Venudes",
        free: "Lliures",
        row: "Fila",
        seat: "Seient",
        accessible: "(PMR)",
        technical: "(Control Tècnic)"
    },
    es: {
        seatsUnit: "butacas",
        sold: "Vendidas",
        free: "Libres",
        row: "Fila",
        seat: "Asiento",
        accessible: "(PMR)",
        technical: "(Control Técnico)"
    },
    en: {
        seatsUnit: "seats",
        sold: "Sold",
        free: "Available",
        row: "Row",
        seat: "Seat",
        accessible: "(PMR / Accessible)",
        technical: "(Technical Booth)"
    }
};

// --- 3. SINGLE SOURCE OF TRUTH (ESTADO DE LA APLICACIÓN) ---
let tasks = [];
let showStatus = 'prep'; // 'prep' | 'cancelled' | 'ready'
let seats = [];

// Idioma actual detectado mediante la etiqueta <html lang="...">
const currentLang = document.documentElement.lang || 'ca';

// --- 4. SELECTORES DEL DOM ---
const taskListEl = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const newTaskInput = document.getElementById('new-task');
const btnClearCompleted = document.getElementById('btn-clear-completed');
const btnClearAll = document.getElementById('btn-clear-all');

const showStatusContainer = document.querySelector('.footer__show-status');
const showSelectorForm = document.querySelector('.show-selector-inline');
const showSelectorSelect = document.getElementById('show-select');

// Modal patio de butacas
const seatingModal = document.getElementById('seating-modal');
const btnOpenSeating = document.getElementById('btn-open-seating');
const btnCloseSeating = document.getElementById('btn-close-seating');
const seatingGrid = document.getElementById('seating-grid');

// --- 5. INICIALIZACIÓN ---
async function init() {
    loadState();
    setupEventListeners();
    
    // Renderizados iniciales desde el estado
    renderTasks();
    renderShowStatus();
    renderSeating();
    updateSeatingSummary();

    startCountdown();
    
    // Comprobar si hay tareas añadidas que necesiten traducción asíncrona
    await ensureTranslations();
}

function loadState() {
    // A) Cargar tareas
    const savedTasks = localStorage.getItem('godot_tasks');
    if (savedTasks) {
        try {
            const parsed = JSON.parse(savedTasks);
            tasks = parsed.map((item, index) => {
                if (item.translations) return item;
                return {
                    id: item.id || Date.now() + index,
                    completed: Boolean(item.completed),
                    sourceLang: currentLang,
                    translations: {
                        [currentLang]: item.text || ''
                    }
                };
            });
        } catch (e) {
            tasks = buildDefaultTasks();
            saveTasks();
        }
    } else {
        tasks = buildDefaultTasks();
        saveTasks();
    }

    // B) Cargar estado del espectáculo
    const savedStatus = localStorage.getItem('godot_show_status');
    if (savedStatus && ['prep', 'cancelled', 'ready'].includes(savedStatus)) {
        showStatus = savedStatus;
    } else {
        showStatus = 'prep';
        saveShowStatus();
    }

    // C) Cargar estado de butacas
    const savedSeats = localStorage.getItem('godot_seats');
    if (savedSeats) {
        try {
            seats = JSON.parse(savedSeats);
        } catch (e) {
            seats = buildDefaultSeats();
            saveSeats();
        }
    } else {
        seats = buildDefaultSeats();
        saveSeats();
    }
}

function buildDefaultTasks() {
    return defaultTasksCA.map((textCA, index) => ({
        id: Date.now() + index,
        completed: index < 2, // Primeras dos marcadas por defecto
        sourceLang: 'ca',
        translations: {
            ca: textCA,
            es: defaultTasksES[index] || textCA,
            en: defaultTasksEN[index] || textCA
        }
    }));
}

function buildDefaultSeats() {
    // 50 butacas en total: 5 filas x 10 asientos
    // - Asientos 49 y 50: PMR (Accesibles)
    // - Asientos 25 y 26: Inhabilitados por cabina de sonido/técnica
    // - 42 vendidas de inicio para mantener el 84% inicial
    return Array.from({ length: 50 }, (_, i) => {
        const seatNum = i + 1;
        let type = 'standard';
        if (seatNum >= 49) type = 'accessible';
        if (seatNum === 25 || seatNum === 26) type = 'blocked';

        const isSold = type !== 'blocked' && i < 44;

        return {
            id: seatNum,
            row: Math.ceil(seatNum / 10),
            number: ((seatNum - 1) % 10) + 1,
            type: type,
            sold: isSold
        };
    });
}

function saveTasks() {
    localStorage.setItem('godot_tasks', JSON.stringify(tasks));
}

function saveShowStatus() {
    localStorage.setItem('godot_show_status', showStatus);
}

function saveSeats() {
    localStorage.setItem('godot_seats', JSON.stringify(seats));
}

// --- 6. SERVICIO DE TRADUCCIÓN ASÍNCRONA (MyMemory API) ---
async function fetchTranslation(text, fromLang, toLang) {
    if (!text || fromLang === toLang) return text;
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        }
        return text;
    } catch (error) {
        console.warn('Error en la traducción automática:', error);
        return text;
    }
}

async function ensureTranslations() {
    let hasChanges = false;
    for (const task of tasks) {
        if (!task.translations[currentLang]) {
            const availableLang = Object.keys(task.translations).find(k => Boolean(task.translations[k])) || task.sourceLang || 'ca';
            const baseText = task.translations[availableLang];
            if (baseText) {
                const translated = await fetchTranslation(baseText, availableLang, currentLang);
                task.translations[currentLang] = translated;
                hasChanges = true;
            }
        }
    }
    if (hasChanges) {
        saveTasks();
        renderTasks();
    }
}

// --- 7. FUNCIONES CENTRALIZADAS DE RENDERIZADO ---

// Renderizar tareas
function renderTasks() {
    taskListEl.innerHTML = '';
    
    let delLabel = 'Eliminar tasca';
    if (currentLang === 'es') delLabel = 'Eliminar tarea';
    if (currentLang === 'en') delLabel = 'Delete task';
    
    const fragment = document.createDocumentFragment();
    
    tasks.forEach(task => {
        const displayText = task.translations[currentLang] 
            || task.translations[task.sourceLang] 
            || Object.values(task.translations)[0] 
            || '';

        const li = document.createElement('li');
        li.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        checkbox.className = 'task-item__checkbox';
        checkbox.checked = task.completed;
        
        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.className = 'task-item__label';
        label.textContent = displayText;
        
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'task-item__delete-btn';
        delBtn.dataset.id = task.id;
        delBtn.setAttribute('aria-label', delLabel);
        delBtn.innerHTML = '&times;';
        
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(delBtn);
        fragment.appendChild(li);
    });
    
    taskListEl.appendChild(fragment);
}

// Renderizar estado del espectáculo
function renderShowStatus() {
    if (!showStatusContainer) return;

    const statusObj = showStatusDictionary[currentLang] || showStatusDictionary['ca'];
    const statusText = statusObj[showStatus] || statusObj['prep'];

    showStatusContainer.innerHTML = `
        <p>${statusObj.prefix} <span class="status-indicator status-indicator--${showStatus}"></span> <strong>${statusText}</strong></p>
    `;

    if (showSelectorSelect) {
        showSelectorSelect.value = showStatus;
    }
}

// Renderizar mapa interactivo de butacas
function renderSeating() {
    if (!seatingGrid) return;

    seatingGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const t = seatingDictionary[currentLang] || seatingDictionary['ca'];

    seats.forEach(seat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `seat seat--${seat.sold ? 'sold' : 'free'}`;
        
        if (seat.type === 'accessible') {
            btn.classList.add('seat--accessible');
            btn.title = `${t.row} ${seat.row} - ${t.seat} ${seat.number} ${t.accessible}`;
            btn.innerHTML = '♿';
        } else if (seat.type === 'blocked') {
            btn.classList.add('seat--blocked');
            btn.title = `${t.row} ${seat.row} - ${t.seat} ${seat.number} ${t.technical}`;
            btn.innerHTML = '✕';
        } else {
            btn.title = `${t.row} ${seat.row} - ${t.seat} ${seat.number}`;
            btn.textContent = `${seat.number}`;
        }

        btn.dataset.id = seat.id;
        fragment.appendChild(btn);
    });

    seatingGrid.appendChild(fragment);
}

// Sincronizar barra de aforo del footer respetando el idioma
function updateSeatingSummary() {
    const total = seats.length;
    const sold = seats.filter(s => s.sold && s.type !== 'blocked').length;
    const free = seats.filter(s => !s.sold && s.type !== 'blocked').length;
    const percent = Math.round((sold / total) * 100);

    const t = seatingDictionary[currentLang] || seatingDictionary['ca'];

    const countEl = document.querySelector('.seating-status__count');
    const barFill = document.querySelector('.seating-status__bar-fill');
    const legendSold = document.querySelector('.legend-dot--sold')?.parentElement;
    const legendFree = document.querySelector('.legend-dot--free')?.parentElement;

    if (countEl) countEl.innerHTML = `<strong>${sold}</strong> / ${total} ${t.seatsUnit} (${percent}%)`;
    if (barFill) barFill.style.width = `${percent}%`;
    if (legendSold) legendSold.innerHTML = `<span class="legend-dot legend-dot--sold"></span> ${t.sold} (${sold})`;
    if (legendFree) legendFree.innerHTML = `<span class="legend-dot legend-dot--free"></span> ${t.free} (${free})`;
}

// --- 8. GESTIÓN DE EVENTOS (EVENT LISTENERS) ---
function setupEventListeners() {
    
    // A) Añadir tarea
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newTaskInput.value.trim();
        if (text !== '') {
            tasks.push({
                id: Date.now(),
                completed: false,
                sourceLang: currentLang,
                translations: {
                    [currentLang]: text
                }
            });
            newTaskInput.value = '';
            saveTasks();
            renderTasks();
        }
    });
    
    // B) Delegación de eventos para tareas (Checkbox & Eliminar individual)
    taskListEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('task-item__checkbox')) {
            const taskId = parseInt(e.target.id.replace('task-', ''), 10);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = e.target.checked;
                saveTasks();
                renderTasks();
            }
        }
        
        if (e.target.classList.contains('task-item__delete-btn')) {
            const taskId = parseInt(e.target.dataset.id, 10);
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasks();
            renderTasks();
        }
    });
    
    // C) Eliminar tareas completadas
    btnClearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });
    
    // D) Eliminar todas las tareas
    btnClearAll.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        renderTasks();
    });

    // E) Cambiar estado del espectáculo (formulario y select)
    if (showSelectorForm) {
        showSelectorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (showSelectorSelect) {
                showStatus = showSelectorSelect.value;
                saveShowStatus();
                renderShowStatus();
            }
        });
    }

    if (showSelectorSelect) {
        showSelectorSelect.addEventListener('change', (e) => {
            showStatus = e.target.value;
            saveShowStatus();
            renderShowStatus();
        });
    }

    // F) Eventos del Patio de Butacas (Modal y Reserva)
    if (btnOpenSeating && seatingModal) {
        btnOpenSeating.addEventListener('click', () => {
            seatingModal.showModal();
            renderSeating();
        });
    }

    if (btnCloseSeating && seatingModal) {
        btnCloseSeating.addEventListener('click', () => {
            seatingModal.close();
        });
    }

    if (seatingModal) {
        seatingModal.addEventListener('click', (e) => {
            if (e.target === seatingModal) seatingModal.close();
        });
    }

    if (seatingGrid) {
        seatingGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.seat');
            if (!btn) return;
            const seatId = parseInt(btn.dataset.id, 10);
            const seat = seats.find(s => s.id === seatId);

            // Las butacas bloqueadas por motivos técnicos no se pueden alternar
            if (seat && seat.type !== 'blocked') {
                seat.sold = !seat.sold;
                saveSeats();
                renderSeating();
                updateSeatingSummary();
            }
        });
    }
}

// --- 9. CONTADOR DINÁMICO DE PRÓXIMA FUNCIÓN ---
// --- 9. CONTADOR DINÁMICO DE PRÓXIMA FUNCIÓN (MULTIFECHA) ---
const countdownTimerEl = document.querySelector('.show-countdown__timer');

function startCountdown() {
    if (!countdownTimerEl) return;

    // Configuración de fechas y pases
    // Nota: en JavaScript los meses van de 0 a 11 (8 = Septiembre, 9 = Octubre)
    const showDates = [
        { date: new Date(2026, 8, 27, 18, 0, 0), totalSlots: 4 }, // 27 Septiembre: 18:00 a 19:00 (4 pases de 15 min)
        { date: new Date(2026, 9, 18, 18, 0, 0), totalSlots: 4 }  // 18 Octubre: 18:00 a 19:00 (4 pases de 15 min)
    ];
    const slotDurationMs = 15 * 60 * 1000; // 15 minutos en ms

    function getNextTargetDate(now) {
        for (const show of showDates) {
            const startTime = show.date.getTime();
            const endTime = startTime + (show.totalSlots * slotDurationMs);

            // Si aún no ha terminado la tanda de pases de este día
            if (now.getTime() < endTime) {
                // Si aún no ha empezado el primer pase de las 18:00
                if (now.getTime() < startTime) {
                    return { target: show.date, isLive: false };
                }

                // Si está dentro de la franja de pases, calcular el siguiente pase de 15 min
                const elapsed = now.getTime() - startTime;
                const slotsPassed = Math.floor(elapsed / slotDurationMs);
                const nextSlotTime = new Date(startTime + (slotsPassed + 1) * slotDurationMs);
                return { target: nextSlotTime, isLive: false };
            }
        }
        return null; // Si ya finalizaron todas las fechas programadas
    }

    function updateTimer() {
        const now = new Date();
        const nextShow = getNextTargetDate(now);

        if (!nextShow) {
            countdownTimerEl.innerHTML = `<span><strong>TEMPORADA FINALITZADA</strong></span>`;
            return;
        }

        const diff = nextShow.target - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const pad = (n) => String(n).padStart(2, '0');

        if (days > 0) {
            countdownTimerEl.innerHTML = `
                <span class="timer-unit"><strong>${pad(days)}</strong>d</span>
                <span class="timer-divider">:</span>
                <span class="timer-unit"><strong>${pad(hours)}</strong>h</span>
                <span class="timer-divider">:</span>
                <span class="timer-unit"><strong>${pad(minutes)}</strong>m</span>
                <span class="timer-divider">:</span>
                <span class="timer-unit"><strong>${pad(seconds)}</strong>s</span>
            `;
        } else {
            countdownTimerEl.innerHTML = `
                <span class="timer-unit"><strong>${pad(hours)}</strong>h</span>
                <span class="timer-divider">:</span>
                <span class="timer-unit"><strong>${pad(minutes)}</strong>m</span>
                <span class="timer-divider">:</span>
                <span class="timer-unit"><strong>${pad(seconds)}</strong>s</span>
            `;
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', init);