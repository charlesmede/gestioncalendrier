// Module de Gestion des Cours
// Career Academy Institute

let currentView = 'list';
let currentEditingCourse = null;
let courseToDelete = null;
let filteredCourses = [];

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeCoursesPage();
    setupEventListeners();
    loadFilters();
    renderCourses();
    updateStatistics();
    initializeCharts();
});

function initializeCoursesPage() {
    // Vérifier si on est en mode édition
    const urlParams = new URLSearchParams(window.location.search);
    const editCourseId = urlParams.get('edit');
    
    if (editCourseId) {
        editCourseById(editCourseId);
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function setupEventListeners() {
    // Recherche
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filtres
    document.getElementById('levelFilter').addEventListener('change', applyFilters);
    document.getElementById('programFilter').addEventListener('change', applyFilters);
    document.getElementById('teacherFilter').addEventListener('change', applyFilters);
    
    // Formulaire de cours
    document.getElementById('courseForm').addEventListener('submit', handleCourseSubmit);
    
    // Mise à jour dynamique des sélecteurs
    document.getElementById('courseLevel').addEventListener('change', updateProgramSelect);
    
    // Vues
    document.getElementById('gridView').addEventListener('click', () => setView('grid'));
    document.getElementById('listView').addEventListener('click', () => setView('list'));
}

function loadFilters() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const data = window.universityApp.appData;
    
    // Charger les niveaux
    const levelFilter = document.getElementById('levelFilter');
    const courseLevelSelect = document.getElementById('courseLevel');
    
    [levelFilter, courseLevelSelect].forEach(select => {
        select.innerHTML = '<option value="">Sélectionner un niveau</option>';
        data.levels.forEach(level => {
            select.innerHTML += `<option value="${level.id}">${level.name}</option>`;
        });
    });
    
    // Charger les parcours
    const programFilter = document.getElementById('programFilter');
    const courseProgramSelect = document.getElementById('courseProgram');
    
    [programFilter, courseProgramSelect].forEach(select => {
        select.innerHTML = '<option value="">Sélectionner un parcours</option>';
        data.programs.forEach(program => {
            select.innerHTML += `<option value="${program.id}" data-level="${program.level_id}">${program.name}</option>`;
        });
    });
    
    // Charger les enseignants
    const teacherFilter = document.getElementById('teacherFilter');
    const teachers = [...new Set(data.courses.map(course => course.teacher))];
    
    teacherFilter.innerHTML = '<option value="">Tous les enseignants</option>';
    teachers.forEach(teacher => {
        teacherFilter.innerHTML += `<option value="${teacher}">${teacher}</option>`;
    });
    
    // Charger les enseignants dans le formulaire (pour l'autocomplétion)
    const teacherInput = document.getElementById('courseTeacher');
    if (teacherInput) {
        teacherInput.setAttribute('list', 'teacherList');
        const datalist = document.createElement('datalist');
        datalist.id = 'teacherList';
        teachers.forEach(teacher => {
            datalist.innerHTML += `<option value="${teacher}">`;
        });
        document.body.appendChild(datalist);
    }
}

function updateProgramSelect() {
    const levelId = this.event.target.value;
    const programSelect = document.getElementById('courseProgram');
    
    if (levelId) {
        // Filtrer les parcours par niveau
        const options = programSelect.querySelectorAll('option');
        options.forEach(option => {
            if (option.value === '' || option.dataset.level === levelId) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    } else {
        // Afficher tous les parcours
        const options = programSelect.querySelectorAll('option');
        options.forEach(option => {
            option.style.display = '';
        });
    }
    
    // Réinitialiser la sélection
    programSelect.value = '';
}

function renderCourses() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const courses = window.universityApp.appData.courses;
    const container = document.getElementById('coursesContainer');
    const noMessage = document.getElementById('noCoursesMessage');
    
    // Appliquer les filtres
    applyFilters();
    
    if (filteredCourses.length === 0) {
        container.innerHTML = '';
        noMessage.classList.remove('hidden');
        return;
    }
    
    noMessage.classList.add('hidden');
    
    if (currentView === 'grid') {
        renderGridView(container, filteredCourses);
    } else {
        renderListView(container, filteredCourses);
    }
}

function renderGridView(container, courses) {
    container.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
    container.innerHTML = '';
    
    courses.forEach(course => {
        const card = createCourseCard(course);
        container.appendChild(card);
    });
}

function renderListView(container, courses) {
    container.className = 'space-y-4';
    container.innerHTML = '';
    
    courses.forEach(course => {
        const row = createCourseRow(course);
        container.appendChild(row);
    });
}

function createCourseCard(course) {
    const level = getLevelById(course.level_id);
    const program = getProgramById(course.program_id);
    
    const card = document.createElement('div');
    card.className = 'course-card p-6 rounded-xl cursor-pointer';
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800 mb-1">${course.name}</h4>
                <p class="text-sm text-gray-600">${course.code}</p>
            </div>
            <div class="flex space-x-2">
                <button onclick="editCourseById('${course.id}')" class="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <span class="text-sm">✏️</span>
                </button>
                <button onclick="confirmDeleteCourse('${course.id}')" class="p-1 text-red-600 hover:text-red-800 transition-colors">
                    <span class="text-sm">🗑️</span>
                </button>
            </div>
        </div>
        
        <div class="space-y-2">
            <div class="flex items-center text-sm text-gray-600">
                <span class="mr-2">👨‍🏫</span>
                <span>${course.teacher}</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <span class="mr-2">⏱️</span>
                <span>${course.duration} minutes</span>
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <span class="mr-2">🎓</span>
                <span>${level ? level.name : ''} - ${program ? program.name : ''}</span>
            </div>
        </div>
        
        ${course.description ? `
            <div class="mt-4">
                <p class="text-sm text-gray-600 line-clamp-2">${course.description}</p>
            </div>
        ` : ''}
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            showCourseDetails(course);
        }
    });
    
    return card;
}

function createCourseRow(course) {
    const level = getLevelById(course.level_id);
    const program = getProgramById(course.program_id);
    
    const row = document.createElement('div');
    row.className = 'course-card p-4 rounded-xl flex items-center justify-between';
    
    row.innerHTML = `
        <div class="flex-1">
            <div class="flex items-center space-x-4">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${course.name}</h4>
                    <p class="text-sm text-gray-600">${course.code} • ${course.teacher}</p>
                </div>
                <div class="text-sm text-gray-600">
                    ${level ? level.name : ''} - ${program ? program.name : ''}
                </div>
                <div class="text-sm text-gray-600">
                    ${course.duration} min
                </div>
            </div>
        </div>
        
        <div class="flex items-center space-x-2 ml-4">
            <button onclick="editCourseById('${course.id}')" class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                <span class="text-sm">✏️</span>
            </button>
            <button onclick="confirmDeleteCourse('${course.id}')" class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                <span class="text-sm">🗑️</span>
            </button>
        </div>
    `;
    
    return row;
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const courses = window.universityApp.appData.courses;
    
    if (searchTerm === '') {
        filteredCourses = courses;
    } else {
        filteredCourses = courses.filter(course => 
            course.name.toLowerCase().includes(searchTerm) ||
            course.code.toLowerCase().includes(searchTerm) ||
            course.teacher.toLowerCase().includes(searchTerm) ||
            (course.description && course.description.toLowerCase().includes(searchTerm))
        );
    }
    
    renderCourses();
    updateStatistics();
}

function applyFilters() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const courses = window.universityApp.appData.courses;
    const levelFilter = document.getElementById('levelFilter').value;
    const programFilter = document.getElementById('programFilter').value;
    const teacherFilter = document.getElementById('teacherFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredCourses = courses.filter(course => {
        // Filtre par niveau
        if (levelFilter && course.level_id !== levelFilter) return false;
        
        // Filtre par parcours
        if (programFilter && course.program_id !== programFilter) return false;
        
        // Filtre par enseignant
        if (teacherFilter && course.teacher !== teacherFilter) return false;
        
        // Filtre de recherche
        if (searchTerm && !(
            course.name.toLowerCase().includes(searchTerm) ||
            course.code.toLowerCase().includes(searchTerm) ||
            course.teacher.toLowerCase().includes(searchTerm) ||
            (course.description && course.description.toLowerCase().includes(searchTerm))
        )) return false;
        
        return true;
    });
    
    renderCourses();
    updateStatistics();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('levelFilter').value = '';
    document.getElementById('programFilter').value = '';
    document.getElementById('teacherFilter').value = '';
    
    if (window.universityApp && window.universityApp.appData) {
        filteredCourses = window.universityApp.appData.courses;
        renderCourses();
        updateStatistics();
    }
}

function setView(view) {
    currentView = view;
    
    // Mettre à jour les boutons de vue
    document.getElementById('gridView').classList.toggle('text-gray-900', view === 'grid');
    document.getElementById('listView').classList.toggle('text-gray-900', view === 'list');
    
    renderCourses();
}

function openCreateCourseModal() {
    currentEditingCourse = null;
    resetCourseForm();
    
    document.getElementById('modalTitle').textContent = 'Créer un Nouveau Cours';
    openModal('courseModal');
}

function editCourseById(courseId) {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const course = window.universityApp.appData.courses.find(c => c.id === courseId);
    if (!course) return;
    
    currentEditingCourse = course;
    
    // Remplir le formulaire
    document.getElementById('courseName').value = course.name;
    document.getElementById('courseCode').value = course.code;
    document.getElementById('courseDescription').value = course.description || '';
    document.getElementById('courseLevel').value = course.level_id;
    document.getElementById('courseTeacher').value = course.teacher;
    document.getElementById('courseDuration').value = course.duration;
    document.getElementById('courseRoom').value = course.room || '';
    document.getElementById('courseCredits').value = course.credits || '';
    document.getElementById('coursePrerequisites').value = course.prerequisites || '';
    
    // Mettre à jour les parcours selon le niveau
    updateProgramSelectForEdit(course.level_id);
    document.getElementById('courseProgram').value = course.program_id;
    
    document.getElementById('modalTitle').textContent = 'Modifier le Cours';
    openModal('courseModal');
}

function updateProgramSelectForEdit(levelId) {
    const programSelect = document.getElementById('courseProgram');
    
    if (levelId) {
        // Filtrer les parcours par niveau
        const options = programSelect.querySelectorAll('option');
        options.forEach(option => {
            if (option.value === '' || option.dataset.level === levelId) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        });
    }
}

function resetCourseForm() {
    document.getElementById('courseForm').reset();
    
    // Réinitialiser les parcours
    const programSelect = document.getElementById('courseProgram');
    const options = programSelect.querySelectorAll('option');
    options.forEach(option => {
        option.style.display = '';
    });
}

function handleCourseSubmit(e) {
    e.preventDefault();
    
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const formData = {
        name: document.getElementById('courseName').value.trim(),
        code: document.getElementById('courseCode').value.trim(),
        description: document.getElementById('courseDescription').value.trim(),
        level_id: document.getElementById('courseLevel').value,
        program_id: document.getElementById('courseProgram').value,
        teacher: document.getElementById('courseTeacher').value.trim(),
        duration: parseInt(document.getElementById('courseDuration').value),
        room: document.getElementById('courseRoom').value.trim(),
        credits: parseInt(document.getElementById('courseCredits').value) || null,
        prerequisites: document.getElementById('coursePrerequisites').value.trim()
    };
    
    // Validation
    if (!formData.name || !formData.code || !formData.level_id || !formData.program_id || !formData.teacher || !formData.duration) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Vérifier les doublons de code
    const existingCourse = window.universityApp.appData.courses.find(c => 
        c.code.toLowerCase() === formData.code.toLowerCase() && 
        (!currentEditingCourse || c.id !== currentEditingCourse.id)
    );
    
    if (existingCourse) {
        alert('Un cours avec ce code existe déjà');
        return;
    }
    
    if (currentEditingCourse) {
        // Mise à jour du cours existant
        Object.assign(currentEditingCourse, formData);
        showNotification('Cours modifié avec succès', 'success');
    } else {
        // Création d'un nouveau cours
        const newCourse = {
            id: 'course_' + Date.now(),
            ...formData
        };
        window.universityApp.appData.courses.push(newCourse);
        showNotification('Cours créé avec succès', 'success');
    }
    
    window.universityApp.saveData();
    closeCourseModal();
    loadFilters();
    renderCourses();
    updateStatistics();
    initializeCharts();
}

function confirmDeleteCourse(courseId) {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const course = window.universityApp.appData.courses.find(c => c.id === courseId);
    if (!course) return;
    
    courseToDelete = course;
    openModal('deleteModal');
}

function confirmDelete() {
    if (!courseToDelete || !window.universityApp || !window.universityApp.appData) return;
    
    // Supprimer le cours
    const index = window.universityApp.appData.courses.findIndex(c => c.id === courseToDelete.id);
    if (index !== -1) {
        window.universityApp.appData.courses.splice(index, 1);
        window.universityApp.saveData();
        
        showNotification('Cours supprimé avec succès', 'success');
        
        loadFilters();
        renderCourses();
        updateStatistics();
        initializeCharts();
    }
    
    closeDeleteModal();
}

function closeDeleteModal() {
    closeModal('deleteModal');
    courseToDelete = null;
}

function closeCourseModal() {
    closeModal('courseModal');
    currentEditingCourse = null;
}

function showCourseDetails(course) {
    // Créer une modale de détails ou rediriger vers une page de détails
    const level = getLevelById(course.level_id);
    const program = getProgramById(course.program_id);
    
    const details = `
        Cours: ${course.name} (${course.code})
        Enseignant: ${course.teacher}
        Niveau: ${level ? level.name : 'Non défini'}
        Parcours: ${program ? program.name : 'Non défini'}
        Durée: ${course.duration} minutes
        ${course.description ? `Description: ${course.description}` : ''}
        ${course.room ? `Salle: ${course.room}` : ''}
        ${course.credits ? `Crédits ECTS: ${course.credits}` : ''}
        ${course.prerequisites ? `Prérequis: ${course.prerequisites}` : ''}
    `;
    
    alert(details); // Pour l'instant, utiliser une alerte simple
}

function updateStatistics() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const data = window.universityApp.appData;
    const courses = filteredCourses.length > 0 ? filteredCourses : data.courses;
    
    // Statistiques de base
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalLevels').textContent = data.levels.length;
    document.getElementById('totalPrograms').textContent = data.programs.length;
    document.getElementById('totalTeachers').textContent = [...new Set(courses.map(c => c.teacher))].length;
}

function initializeCharts() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const data = window.universityApp.appData;
    const courses = data.courses;
    
    // Graphique par niveau
    const levelChart = echarts.init(document.getElementById('levelChart'));
    const levelData = data.levels.map(level => ({
        name: level.name,
        value: courses.filter(course => course.level_id === level.id).length
    })).filter(item => item.value > 0);
    
    levelChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [{
            name: 'Cours par niveau',
            type: 'pie',
            radius: '70%',
            data: levelData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            itemStyle: {
                color: function(params) {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
                    return colors[params.dataIndex % colors.length];
                }
            }
        }]
    });
    
    // Graphique par parcours
    const programChart = echarts.init(document.getElementById('programChart'));
    const programData = data.programs.map(program => ({
        name: program.name,
        value: courses.filter(course => course.program_id === program.id).length
    })).filter(item => item.value > 0);
    
    programChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [{
            name: 'Cours par parcours',
            type: 'pie',
            radius: '70%',
            data: programData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            itemStyle: {
                color: function(params) {
                    const colors = ['#06b6d4', '#84cc16', '#f97316', '#a855f7', '#ec4899'];
                    return colors[params.dataIndex % colors.length];
                }
            }
        }]
    });
    
    // Rendre les graphiques responsive
    window.addEventListener('resize', function() {
        levelChart.resize();
        programChart.resize();
    });
}

function importCourses() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    // Importer les cours
                    data.forEach(courseData => {
                        if (!courseData.id) {
                            courseData.id = 'course_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                        }
                        window.universityApp.appData.courses.push(courseData);
                    });
                    
                    window.universityApp.saveData();
                    loadFilters();
                    renderCourses();
                    updateStatistics();
                    initializeCharts();
                    
                    showNotification('Cours importés avec succès', 'success');
                } else {
                    throw new Error('Format de fichier invalide');
                }
            } catch (error) {
                console.error('Erreur lors de l\'import:', error);
                showNotification('Erreur lors de l\'import du fichier', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function exportCourses() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const data = window.universityApp.appData.courses;
    const jsonData = JSON.stringify(data, null, 2);
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cours_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification('Cours exportés avec succès', 'success');
}

// Fonctions utilitaires
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
        
        // Animation d'entrée
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

console.log('Module de gestion des cours chargé');