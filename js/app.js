/* global document, window, localStorage, fetch, console, Blob, URL, FileReader, alert, setInterval */
/**
 * Todo List - La màgia d'en Godot
 * Vanilla JS - Single Source of Truth Architecture
 * Tareas, Patio de Butacas, Ubicación, Drag&Drop, Edición Inline y Backup JSON
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

const countdownDictionary = {
    ca: { finished: "TEMPORADA FINALITZADA" },
    es: { finished: "TEMPORADA FINALIZADA" },
    en: { finished: "SEASON CONCLUDED" }
};

// --- 3. SINGLE SOURCE OF TRUTH (ESTADO DE LA APLICACIÓN) ---
let tasks = [];
let showStatus = 'prep';
let seats = [];
let currentFilter = 'all';

let draggedTaskId = null;

const currentLang = document.documentElement.lang || 'ca';

// --- 4. SELECTORES DEL DOM ---
const taskListEl = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const newTaskInput = document.getElementById('new-task');
const btnClearCompleted = document.getElementById('btn-clear-completed');
const btnClearAll = document.getElementById('btn-clear-all');

const progressCountEl = document.getElementById('task-progress-count');
const progressFillEl = document.getElementById('task-progress-fill');
const filterBtns = document.querySelectorAll('.btn-filter');

const btnExportJson = document.getElementById('btn-export-json');
const inputImportJson = document.getElementById('input-import-json');

const showStatusContainer = document.querySelector('.footer__show-status');
const showSelectorSelect = document.getElementById('show-select');

const seatingModal = document.getElementById('seating-modal');
const btnOpenSeating = document.getElementById('btn-open-seating');
const btnCloseSeating = document.getElementById('btn-close-seating');
const seatingGrid = document.getElementById('seating-grid');

const detailsModal = document.getElementById('details-modal');
const btnShowDetails = document.getElementById('btn-show-details');
const btnCloseDetails = document.getElementById('btn-close-details');

const countdownTimerEl = document.querySelector('.show-countdown__timer');

// --- 5. INICIALIZACIÓN ---
async function init() {
    loadState();
    setupEventListeners();
    
    renderTasks();
    renderShowStatus();
    renderSeating();
    updateSeatingSummary();
    startCountdown();
    
    await ensureTranslations();
}

function loadState() {
    const savedTasks = localStorage.getItem('godot_tasks');
    if (savedTasks) {
        try {
            const parsed = JSON.parse(savedTasks);
            const isLegacy = parsed.some(item => !item.translations || !item.translations.es || !item.translations.en);
            
            if (isLegacy) {
                tasks = buildDefaultTasks();
                saveTasks();
            } else {
                tasks = parsed;
            }
        } catch {
            tasks = buildDefaultTasks();
            saveTasks();
        }
    } else {
        tasks = buildDefaultTasks();
        saveTasks();
    }

    const savedStatus = localStorage.getItem('godot_show_status');
    if (savedStatus && ['prep', 'cancelled', 'ready'].includes(savedStatus)) {
        showStatus = savedStatus;
    } else {
        showStatus = 'prep';
        saveShowStatus();
    }

    const savedSeats = localStorage.getItem('godot_seats');
    if (savedSeats) {
        try {
            seats = JSON.parse(savedSeats);
        } catch {
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
        completed: index < 2,
        sourceLang: 'ca',
        translations: {
            ca: textCA,
            es: defaultTasksES[index] || textCA,
            en: defaultTasksEN[index] || textCA
        }
    }));
}

function buildDefaultSeats() {
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
function renderTasks() {
    taskListEl.innerHTML = '';
    
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    if (progressCountEl) {
        let taskLabel = 'tasques';
        if (currentLang === 'es') taskLabel = 'tareas';
        if (currentLang === 'en') taskLabel = 'tasks';
        progressCountEl.innerHTML = `<strong>${completedCount}</strong> / ${total} ${taskLabel} (${percent}%)`;
    }
    if (progressFillEl) {
        progressFillEl.style.width = `${percent}%`;
    }

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    let delLabel = 'Eliminar tasca';
    if (currentLang === 'es') delLabel = 'Eliminar tarea';
    if (currentLang === 'en') delLabel = 'Delete task';

    let editHint = 'Doble clic per editar';
    if (currentLang === 'es') editHint = 'Doble clic para editar';
    if (currentLang === 'en') editHint = 'Double click to edit';
    
    const fragment = document.createDocumentFragment();
    
    filteredTasks.forEach(task => {
        const displayText = task.translations[currentLang] 
            || task.translations[task.sourceLang] 
            || Object.values(task.translations)[0] 
            || '';

        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        li.draggable = true;

        const handle = document.createElement('span');
        handle.className = 'task-item__handle';
        handle.innerHTML = '&#8942;&#8942;';
        handle.title = 'Arrastra per reordenar';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${task.id}`;
        checkbox.className = 'task-item__checkbox';
        checkbox.checked = task.completed;
        
        const label = document.createElement('label');
        label.htmlFor = `task-${task.id}`;
        label.className = 'task-item__label';
        label.textContent = displayText;
        label.title = editHint;
        
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'task-item__delete-btn';
        delBtn.dataset.id = task.id;
        delBtn.setAttribute('aria-label', delLabel);
        delBtn.innerHTML = '&times;';
        
        li.appendChild(handle);
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(delBtn);
        fragment.appendChild(li);
    });
    
    taskListEl.appendChild(fragment);
}

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
    
    // B) Checkbox & Eliminar individual
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

    // C) Edición en línea (Doble clic)
    taskListEl.addEventListener('dblclick', (e) => {
        const label = e.target.closest('.task-item__label');
        if (!label) return;

        const li = label.closest('.task-item');
        const taskId = parseInt(li.dataset.id, 10);
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const currentText = label.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-item__edit-input';
        input.value = currentText;

        li.replaceChild(input, label);
        input.focus();
        input.select();

        let isFinished = false;
        const finishEdit = () => {
            if (isFinished) return;
            isFinished = true;

            const newText = input.value.trim();
            if (newText !== '') {
                task.translations[currentLang] = newText;
                task.sourceLang = currentLang;
                saveTasks();
            }
            renderTasks();
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter') finishEdit();
            if (evt.key === 'Escape') {
                isFinished = true;
                renderTasks();
            }
        });
    });

    // D) Reordenación mediante Drag and Drop
    taskListEl.addEventListener('dragstart', (e) => {
        const li = e.target.closest('.task-item');
        if (!li) return;
        draggedTaskId = parseInt(li.dataset.id, 10);
        li.classList.add('task-item--dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    taskListEl.addEventListener('dragend', (e) => {
        const li = e.target.closest('.task-item');
        if (li) li.classList.remove('task-item--dragging');
        document.querySelectorAll('.task-item--dragover').forEach(el => el.classList.remove('task-item--dragover'));
    });

    taskListEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        const overLi = e.target.closest('.task-item');
        if (!overLi) return;
        overLi.classList.add('task-item--dragover');
    });

    taskListEl.addEventListener('dragleave', (e) => {
        const overLi = e.target.closest('.task-item');
        if (overLi) overLi.classList.remove('task-item--dragover');
    });

    taskListEl.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetLi = e.target.closest('.task-item');
        if (!targetLi) return;

        const targetTaskId = parseInt(targetLi.dataset.id, 10);
        if (draggedTaskId === null || draggedTaskId === targetTaskId) return;

        const fromIndex = tasks.findIndex(t => t.id === draggedTaskId);
        const toIndex = tasks.findIndex(t => t.id === targetTaskId);

        if (fromIndex !== -1 && toIndex !== -1) {
            const [movedItem] = tasks.splice(fromIndex, 1);
            tasks.splice(toIndex, 0, movedItem);
            saveTasks();
            renderTasks();
        }
    });
    
    // E) Eliminar completadas
    btnClearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    });
    
    // F) Eliminar todas las tareas
    btnClearAll.addEventListener('click', () => {
        let confirmText = 'Segur que vols eliminar totes les tasques de preparació?';
        if (currentLang === 'es') confirmText = '¿Seguro que quieres eliminar todas las tareas de preparación?';
        if (currentLang === 'en') confirmText = 'Are you sure you want to delete all preparation tasks?';

        if (window.confirm(confirmText)) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    // G) Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('btn-filter--active'));
            btn.classList.add('btn-filter--active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // H) Exportar estado completo a JSON
    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            const dataToExport = {
                version: "2.0",
                exportedAt: new Date().toISOString(),
                showStatus: showStatus,
                seats: seats,
                tasks: tasks
            };
            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `godot-checklist-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // I) Importar estado desde JSON
    if (inputImportJson) {
        inputImportJson.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (Array.isArray(data.tasks)) {
                        tasks = data.tasks;
                        saveTasks();
                    }
                    if (Array.isArray(data.seats)) {
                        seats = data.seats;
                        saveSeats();
                    }
                    if (data.showStatus && ['prep', 'cancelled', 'ready'].includes(data.showStatus)) {
                        showStatus = data.showStatus;
                        saveShowStatus();
                    }
                    renderTasks();
                    renderShowStatus();
                    renderSeating();
                    updateSeatingSummary();

                    let successMsg = 'Dades importades correctament!';
                    if (currentLang === 'es') successMsg = '¡Datos importados correctamente!';
                    if (currentLang === 'en') successMsg = 'Data imported successfully!';
                    alert(successMsg);
                } catch {
                    let errMsg = 'El fitxer JSON no té un format vàlid.';
                    if (currentLang === 'es') errMsg = 'El archivo JSON no tiene un formato válido.';
                    if (currentLang === 'en') errMsg = 'The JSON file format is invalid.';
                    alert(errMsg);
                }
            };
            reader.readAsText(file);
            inputImportJson.value = '';
        });
    }

    // J) Cambiar estado en tiempo real
    if (showSelectorSelect) {
        showSelectorSelect.addEventListener('change', (e) => {
            showStatus = e.target.value;
            saveShowStatus();
            renderShowStatus();
        });
    }

    // K) Patio de Butacas
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

            if (seat && seat.type !== 'blocked') {
                seat.sold = !seat.sold;
                saveSeats();
                renderSeating();
                updateSeatingSummary();
            }
        });
    }

    // L) Modal de Ubicación
    if (btnShowDetails && detailsModal) {
        btnShowDetails.addEventListener('click', () => {
            detailsModal.showModal();
        });
    }

    if (btnCloseDetails && detailsModal) {
        btnCloseDetails.addEventListener('click', () => {
            detailsModal.close();
        });
    }

    if (detailsModal) {
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) detailsModal.close();
        });
    }
}

// --- 9. CONTADOR DINÁMICO DE PRÓXIMA FUNCIÓN (MULTIFECHA) ---
function startCountdown() {
    if (!countdownTimerEl) return;

    const showDates = [
        { date: new Date(2026, 8, 27, 18, 0, 0), totalSlots: 4 },
        { date: new Date(2026, 9, 18, 18, 0, 0), totalSlots: 4 }
    ];
    const slotDurationMs = 15 * 60 * 1000;

    function getNextTargetDate(now) {
        for (const show of showDates) {
            const startTime = show.date.getTime();
            const endTime = startTime + (show.totalSlots * slotDurationMs);

            if (now.getTime() < endTime) {
                if (now.getTime() < startTime) {
                    return { target: show.date, isLive: false };
                }

                const elapsed = now.getTime() - startTime;
                const slotsPassed = Math.floor(elapsed / slotDurationMs);
                const nextSlotTime = new Date(startTime + (slotsPassed + 1) * slotDurationMs);
                return { target: nextSlotTime, isLive: false };
            }
        }
        return null;
    }

    function updateTimer() {
        const now = new Date();
        const nextShow = getNextTargetDate(now);

        if (!nextShow) {
            const finishedMsg = (countdownDictionary[currentLang] || countdownDictionary['ca']).finished;
            countdownTimerEl.innerHTML = `<span><strong>${finishedMsg}</strong></span>`;
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

document.addEventListener('DOMContentLoaded', init);