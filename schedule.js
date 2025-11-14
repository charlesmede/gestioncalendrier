// Module de Gestion du Calendrier Hebdomadaire
// Career Academy Institute

let currentWeekStart = new Date('2025-11-10'); // Lundi 10 novembre 2025
let selectedCourse = null;
let draggedCourse = null;
let activeFilters = {
    levels: [],
    programs: [],
    teachers: []
};

// Horaires de l'université
const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const FULL_DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Données exemple pour le calendrier
let weeklySchedule = {
    'Lun-08:00': { courseId: 'web101', duration: 2 },
    'Lun-10:00': { courseId: 'math201', duration: 1 },
    'Lun-14:00': { courseId: 'db301', duration: 2 },
    'Mar-09:00': { courseId: 'web101', duration: 2 },
    'Mar-13:00': { courseId: 'math201', duration: 2 },
    'Mer-08:00': { courseId: 'db301', duration: 3 },
    'Jeu-10:00': { courseId: 'web101', duration: 2 },
    'Ven-14:00': { courseId: 'math201', duration: 1 }
};

// Initialisation du calendrier
document.addEventListener('DOMContentLoaded', function() {
    initializeSchedule();
    setupEventListeners();
    loadFilters();
    renderCalendar();
    renderCourseList();
    updateStatistics();
    
    // Exposer les fonctions globalement
    window.scheduleModule = {
        filterByLevel,
        clearWeeklySchedule,
        autoFillSchedule,
        refreshCourseList,
        setView
    };
});

function initializeSchedule() {
    // Charger les données depuis le localStorage
    const savedSchedule = localStorage.getItem('weeklySchedule');
    if (savedSchedule) {
        weeklySchedule = JSON.parse(savedSchedule);
    }
    
    updateWeekDisplay();
}

function setupEventListeners() {
    // Navigation semaine
    document.getElementById('prevWeek').addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateWeekDisplay();
        renderCalendar();
        updateStatistics();
    });
    
    document.getElementById('nextWeek').addEventListener('click', () => {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateWeekDisplay();
        renderCalendar();
        updateStatistics();
    });
    
    // Recherche de cours
    document.getElementById('courseSearch').addEventListener('input', filterCourses);
    
    // Gestion du drag & drop
    setupDragAndDrop();
}

function updateWeekDisplay() {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const startStr = currentWeekStart.toLocaleDateString('fr-FR', options);
    
    document.getElementById('currentWeek').textContent = `Semaine du ${startStr}`;
}

function renderCalendar() {
    const calendar = document.getElementById('weeklyCalendar');
    calendar.innerHTML = '';
    
    // En-tête des jours
    calendar.appendChild(createCell('', 'header', 'Horaires'));
    DAYS.forEach(day => {
        calendar.appendChild(createCell(day, 'header', FULL_DAYS[DAYS.indexOf(day)]));
    });
    
    // Créer les lignes horaires
    TIME_SLOTS.forEach(time => {
        // Cellule de temps
        calendar.appendChild(createCell(time, 'time-slot', time));
        
        // Cellules des jours
        DAYS.forEach(day => {
            const cellKey = `${day}-${time}`;
            const cell = createCell('', 'day-cell', cellKey);
            
            // Vérifier s'il y a un cours programmé
            if (weeklySchedule[cellKey]) {
                const courseData = weeklySchedule[cellKey];
                const course = getCourseById(courseData.courseId);
                if (course && !isFilteredOut(course)) {
                    const courseElement = createCourseElement(course, courseData.duration);
                    cell.appendChild(courseElement);
                    
                    // Marquer les cellules suivantes comme occupées si le cours dure plus d'une heure
                    if (courseData.duration > 1) {
                        cell.classList.add('occupied');
                    }
                }
            }
            
            calendar.appendChild(cell);
        });
    });
}

function createCell(content, className, dataKey = '') {
    const cell = document.createElement('div');
    cell.className = `calendar-cell ${className}`;
    cell.textContent = content;
    if (dataKey) {
        cell.dataset.key = dataKey;
    }
    return cell;
}

function createCourseElement(course, duration) {
    const element = document.createElement('div');
    element.className = 'course-item';
    element.draggable = true;
    element.dataset.courseId = course.id;
    element.dataset.duration = duration;
    
    element.innerHTML = `
        <div class="font-semibold">${course.name}</div>
        <div class="text-xs opacity-90">${course.teacher}</div>
        <div class="text-xs opacity-75">${duration}h</div>
    `;
    
    // Ajouter les écouteurs d'événements
    element.addEventListener('click', () => showCourseDetails(course));
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
    
    return element;
}

function renderCourseList() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    
    if (!window.universityApp || !window.universityApp.appData) {
        courseList.innerHTML = '<p class="text-gray-500 text-sm">Aucun cours disponible</p>';
        return;
    }
    
    const courses = window.universityApp.appData.courses;
    
    courses.forEach(course => {
        if (!isFilteredOut(course)) {
            const listItem = createCourseListItem(course);
            courseList.appendChild(listItem);
        }
    });
}

function createCourseListItem(course) {
    const item = document.createElement('div');
    item.className = 'course-list-item';
    item.draggable = true;
    item.dataset.courseId = course.id;
    item.dataset.duration = Math.ceil(course.duration / 60); // Convertir minutes en heures
    
    const level = getLevelById(course.level_id);
    const program = getProgramById(course.program_id);
    
    item.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <span class="font-semibold text-gray-800">${course.name}</span>
            <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">${course.duration}min</span>
        </div>
        <div class="text-sm text-gray-600 mb-1">${course.teacher}</div>
        <div class="text-xs text-gray-500">${level ? level.name : ''} - ${program ? program.name : ''}</div>
    `;
    
    // Écouteurs d'événements
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('click', () => showCourseDetails(course));
    
    return item;
}

function setupDragAndDrop() {
    // Gestion du drag & drop sur les cellules du calendrier
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        
        const targetCell = e.target.closest('.calendar-cell');
        if (targetCell && targetCell.classList.contains('day-cell') && !targetCell.classList.contains('occupied')) {
            handleDrop(targetCell, e);
        }
    });
}

function handleDragStart(e) {
    draggedCourse = {
        id: e.target.dataset.courseId,
        duration: parseInt(e.target.dataset.duration)
    };
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedCourse = null;
}

function handleDrop(targetCell, e) {
    if (!draggedCourse) return;
    
    const cellKey = targetCell.dataset.key;
    
    // Vérifier les conflits
    if (hasTimeConflict(cellKey, draggedCourse.duration)) {
        showNotification('Conflit d\'horaire détecté !', 'error');
        return;
    }
    
    // Ajouter le cours au planning
    weeklySchedule[cellKey] = {
        courseId: draggedCourse.id,
        duration: draggedCourse.duration
    };
    
    // Sauvegarder et rafraîchir
    saveSchedule();
    renderCalendar();
    updateStatistics();
    
    showNotification('Cours programmé avec succès', 'success');
}

function hasTimeConflict(cellKey, duration) {
    const [day, time] = cellKey.split('-');
    const timeIndex = TIME_SLOTS.indexOf(time);
    
    // Vérifier les conflits pour chaque heure du cours
    for (let i = 0; i < duration; i++) {
        const checkTime = TIME_SLOTS[timeIndex + i];
        if (!checkTime) continue;
        
        const checkKey = `${day}-${checkTime}`;
        if (weeklySchedule[checkKey]) {
            return true;
        }
    }
    
    return false;
}

function showCourseDetails(course) {
    selectedCourse = course;
    
    const modal = document.getElementById('courseDetailModal');
    const content = document.getElementById('courseDetailContent');
    
    const level = getLevelById(course.level_id);
    const program = getProgramById(course.program_id);
    
    content.innerHTML = `
        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-800">${course.name}</h4>
                <p class="text-sm text-gray-600">${course.code}</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p class="text-sm text-gray-600">${course.description || 'Aucune description'}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Enseignant</label>
                    <p class="text-sm text-gray-600">${course.teacher}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                    <p class="text-sm text-gray-600">${course.duration} minutes</p>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <p class="text-sm text-gray-600">${level ? level.name : 'Non défini'}</p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Parcours</label>
                    <p class="text-sm text-gray-600">${program ? program.name : 'Non défini'}</p>
                </div>
            </div>
        </div>
    `;
    
    openModal('courseDetailModal');
}

function editCourse() {
    if (selectedCourse) {
        window.location.href = `courses.html?edit=${selectedCourse.id}`;
    }
}

function removeFromSchedule() {
    if (!selectedCourse) return;
    
    // Retirer toutes les occurrences du cours du planning
    Object.keys(weeklySchedule).forEach(key => {
        if (weeklySchedule[key].courseId === selectedCourse.id) {
            delete weeklySchedule[key];
        }
    });
    
    saveSchedule();
    renderCalendar();
    updateStatistics();
    closeModal('courseDetailModal');
    
    showNotification('Cours retiré du planning', 'success');
}

function filterCourses() {
    const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
    const courseItems = document.querySelectorAll('.course-list-item');
    
    courseItems.forEach(item => {
        const courseName = item.querySelector('.font-semibold').textContent.toLowerCase();
        const teacherName = item.querySelector('.text-gray-600').textContent.toLowerCase();
        
        if (courseName.includes(searchTerm) || teacherName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterByLevel(levelId) {
    if (levelId) {
        activeFilters.levels = [levelId];
    } else {
        activeFilters.levels = [];
    }
    
    renderCalendar();
    updateStatistics();
}

function clearWeeklySchedule() {
    weeklySchedule = {};
    saveSchedule();
    renderCalendar();
    updateStatistics();
    showNotification('Planning vidé avec succès', 'success');
}

function autoFillSchedule() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const courses = window.universityApp.appData.courses;
    let addedCourses = 0;
    
    // Pour chaque cours, essayer de le placer dans un créneau disponible
    courses.forEach(course => {
        if (isFilteredOut(course)) return;
        
        let placed = false;
        
        for (let day of DAYS) {
            for (let time of TIME_SLOTS) {
                const cellKey = `${day}-${time}`;
                const duration = Math.ceil(course.duration / 60); // Convertir en heures
                
                if (!weeklySchedule[cellKey] && !hasTimeConflict(cellKey, duration)) {
                    weeklySchedule[cellKey] = {
                        courseId: course.id,
                        duration: duration
                    };
                    placed = true;
                    addedCourses++;
                    break;
                }
            }
            if (placed) break;
        }
    });
    
    saveSchedule();
    renderCalendar();
    updateStatistics();
    
    showNotification(`${addedCourses} cours ont été ajoutés automatiquement`, 'success');
}

function refreshCourseList() {
    renderCourseList();
}

function setView(view) {
    // Pour l'instant, ne changer que l'affichage des boutons
    // La logique de vue pourrait être étendue ici
    console.log('Vue changée:', view);
}

function isFilteredOut(course) {
    // Filtre par niveau
    if (activeFilters.levels.length > 0 && !activeFilters.levels.includes(course.level_id)) {
        return true;
    }
    
    // Filtre par parcours
    if (activeFilters.programs.length > 0 && !activeFilters.programs.includes(course.program_id)) {
        return true;
    }
    
    // Filtre par enseignant
    if (activeFilters.teachers.length > 0 && !activeFilters.teachers.includes(course.teacher)) {
        return true;
    }
    
    return false;
}

function updateStatistics() {
    let courseCount = 0;
    let totalHours = 0;
    let conflicts = 0;
    
    Object.values(weeklySchedule).forEach(scheduleItem => {
        const course = getCourseById(scheduleItem.courseId);
        if (course && !isFilteredOut(course)) {
            courseCount++;
            totalHours += scheduleItem.duration;
        }
    });
    
    // Compter les conflits
    conflicts = detectConflicts();
    
    document.getElementById('weekCourseCount').textContent = courseCount;
    document.getElementById('weekHourCount').textContent = `${totalHours}h`;
    document.getElementById('conflictCount').textContent = conflicts;
    
    // Changer la couleur selon les conflits
    const conflictElement = document.getElementById('conflictCount');
    if (conflicts > 0) {
        conflictElement.parentElement.parentElement.querySelector('.w-12').className = 'w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center';
        conflictElement.parentElement.parentElement.querySelector('span').className = 'text-red-600 text-xl';
    } else {
        conflictElement.parentElement.parentElement.querySelector('.w-12').className = 'w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center';
        conflictElement.parentElement.parentElement.querySelector('span').className = 'text-orange-600 text-xl';
    }
}

function detectConflicts() {
    let conflicts = 0;
    
    Object.keys(weeklySchedule).forEach(key => {
        const [day, time] = key.split('-');
        const timeIndex = TIME_SLOTS.indexOf(time);
        const scheduleItem = weeklySchedule[key];
        
        // Vérifier les conflits pour chaque heure du cours
        for (let i = 1; i < scheduleItem.duration; i++) {
            const checkTime = TIME_SLOTS[timeIndex + i];
            if (checkTime) {
                const checkKey = `${day}-${checkTime}`;
                if (weeklySchedule[checkKey]) {
                    conflicts++;
                }
            }
        }
    });
    
    return conflicts;
}

function goToToday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - daysToMonday);
    
    updateWeekDisplay();
    renderCalendar();
    updateStatistics();
}

function exportToPDF() {
    if (window.universityApp && window.universityApp.generateSchedulePDF) {
        const level = { name: 'Tous niveaux' };
        const program = { name: 'Tous parcours', code: 'ALL' };
        const weekStart = currentWeekStart.toLocaleDateString('fr-FR');
        
        window.universityApp.generateSchedulePDF(level, program, weekStart)
            .then(pdfData => {
                // Créer un lien de téléchargement
                const link = document.createElement('a');
                link.href = URL.createObjectURL(new Blob([pdfData.content], { type: 'application/pdf' }));
                link.download = pdfData.filename;
                link.click();
            })
            .catch(error => {
                console.error('Erreur lors de l\'export PDF:', error);
                showNotification('Erreur lors de l\'export PDF', 'error');
            });
    } else {
        showNotification('Fonctionnalité PDF non disponible', 'error');
    }
}

function sendByEmail() {
    openModal('emailModal');
}

function confirmSendEmail() {
    const students = document.getElementById('emailStudents').checked;
    const teachers = document.getElementById('emailTeachers').checked;
    const admin = document.getElementById('emailAdmin').checked;
    const message = document.getElementById('emailMessage').value;
    const level = document.getElementById('emailLevel').value;
    
    if (!students && !teachers && !admin) {
        alert('Veuillez sélectionner au moins un destinataire');
        return;
    }
    
    // Simuler l'envoi d'email
    showNotification('Préparation de l\'envoi d\'email...', 'info');
    
    setTimeout(() => {
        showNotification('Email envoyé avec succès', 'success');
        closeModal('emailModal');
    }, 2000);
}

function saveSchedule() {
    localStorage.setItem('weeklySchedule', JSON.stringify(weeklySchedule));
}

// Fonctions utilitaires
function getCourseById(id) {
    if (!window.universityApp || !window.universityApp.appData) return null;
    return window.universityApp.appData.courses.find(course => course.id === id);
}

function getLevelById(id) {
    if (!window.universityApp || !window.universityApp.appData) return null;
    return window.universityApp.appData.levels.find(level => level.id === id);
}

function getProgramById(id) {
    if (!window.universityApp || !window.universityApp.appData) return null;
    return window.universityApp.appData.programs.find(program => program.id === id);
}

function showNotification(message, type) {
    if (window.universityApp && window.universityApp.showNotification) {
        window.universityApp.showNotification(message, type);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuart',
            complete: () => {
                modal.classList.add('hidden');
            }
        });
    }
}

console.log('Module de calendrier hebdomadaire amélioré chargé');