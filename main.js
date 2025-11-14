// Application de Gestion Universitaire - Career Academy Institute
// Auteur: Charles - charles@career-academyinstitute.com

// État global de l'application
let appData = {
    levels: [],
    programs: [],
    courses: [],
    schedule: [],
    emails: []
};

// Configuration email
const EMAIL_CONFIG = {
    from: 'charles@career-academyinstitute.com',
    smtp: {
        host: 'smtp.career-academyinstitute.com',
        port: 587,
        secure: false
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    initializeChart();
    setupEventListeners();
    animateElements();
});

// Initialisation de base
function initializeApp() {
    // Charger les données depuis le localStorage
    const savedData = localStorage.getItem('universityAppData');
    if (savedData) {
        appData = JSON.parse(savedData);
    }
    
    // Mettre à jour les interfaces
    updateLevelsList();
    updateProgramsList();
    updateCoursesList();
}

// Charger des données d'exemple
function loadSampleData() {
    if (appData.levels.length === 0) {
        appData.levels = [
            { id: 'l1', name: 'Licence 1', code: 'L1', color: '#3b82f6' },
            { id: 'l2', name: 'Licence 2', code: 'L2', color: '#10b981' },
            { id: 'l3', name: 'Licence 3', code: 'L3', color: '#f59e0b' },
            { id: 'm1', name: 'Master 1', code: 'M1', color: '#8b5cf6' },
            { id: 'm2', name: 'Master 2', code: 'M2', color: '#ef4444' }
        ];
        
        appData.programs = [
            { id: 'info_l1', level_id: 'l1', name: 'Informatique', code: 'INFO', color: '#3b82f6' },
            { id: 'math_l1', level_id: 'l1', name: 'Mathématiques', code: 'MATH', color: '#10b981' },
            { id: 'info_l2', level_id: 'l2', name: 'Informatique', code: 'INFO', color: '#3b82f6' },
            { id: 'info_l3', level_id: 'l3', name: 'Informatique', code: 'INFO', color: '#3b82f6' },
            { id: 'info_m1', level_id: 'm1', name: 'Informatique', code: 'INFO', color: '#3b82f6' }
        ];
        
        appData.courses = [
            {
                id: 'web101',
                name: 'Programmation Web',
                code: 'WEB101',
                description: 'Introduction au développement web moderne',
                teacher: 'Dr. Martin Dubois',
                duration: 120,
                level_id: 'l1',
                program_id: 'info_l1'
            },
            {
                id: 'math201',
                name: 'Mathématiques Discrètes',
                code: 'MATH201',
                description: 'Théorie des graphes et combinatoire',
                teacher: 'Dr. Sophie Laurent',
                duration: 90,
                level_id: 'l2',
                program_id: 'info_l2'
            },
            {
                id: 'db301',
                name: 'Base de Données',
                code: 'DB301',
                description: 'Conception et gestion des bases de données',
                teacher: 'Dr. Pierre Bernard',
                duration: 150,
                level_id: 'm1',
                program_id: 'info_m1'
            }
        ];
        
        saveData();
    }
}

// Sauvegarder les données
function saveData() {
    localStorage.setItem('universityAppData', JSON.stringify(appData));
}

// Initialiser le graphique hebdomadaire
function initializeChart() {
    const chartDom = document.getElementById('weeklyChart');
    const myChart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            name: 'Heures'
        },
        series: [
            {
                name: 'Cours',
                type: 'bar',
                barWidth: '60%',
                data: [8, 6, 7, 5, 4, 2],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#3b82f6' },
                        { offset: 1, color: '#1e3a8a' }
                    ])
                }
            }
        ]
    };
    
    myChart.setOption(option);
    
    // Rendre le graphique responsive
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Bouton d'ajout de cours rapide
    document.getElementById('addCourseBtn').addEventListener('click', function() {
        openModal('coursesModal');
    });
    
    // Formulaire de cours
    document.getElementById('courseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addCourse();
    });
    
    // Mise à jour dynamique des sélecteurs
    document.getElementById('courseLevel').addEventListener('change', updateProgramSelect);
    document.getElementById('programLevel').addEventListener('change', updateProgramSelect);
}

// Animation des éléments
function animateElements() {
    // Animation d'entrée pour les cartes
    anime({
        targets: '.hover-lift',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutQuart'
    });
    
    // Animation pour le texte avec gradient
    anime({
        targets: '.gradient-text',
        scale: [0.9, 1],
        duration: 1000,
        easing: 'easeOutElastic(1, .8)'
    });
}

// Gestion des modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    
    // Animation d'entrée
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // Mettre à jour les listes déroulantes
    if (modalId === 'coursesModal' || modalId === 'programsModal') {
        updateLevelSelects();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    // Animation de sortie
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuart',
        complete: function() {
            modal.classList.add('hidden');
        }
    });
}

// Gestion des niveaux
function openLevelsModal() {
    openModal('levelsModal');
    updateLevelsList();
}

function addLevel() {
    const name = document.getElementById('levelName').value.trim();
    const code = document.getElementById('levelCode').value.trim();
    
    if (!name || !code) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    // Vérifier les doublons
    const exists = appData.levels.some(level => 
        level.name.toLowerCase() === name.toLowerCase() || 
        level.code.toLowerCase() === code.toLowerCase()
    );
    
    if (exists) {
        alert('Ce niveau existe déjà');
        return;
    }
    
    const newLevel = {
        id: 'level_' + Date.now(),
        name: name,
        code: code,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    
    appData.levels.push(newLevel);
    saveData();
    updateLevelsList();
    updateLevelSelects();
    
    // Vider les champs
    document.getElementById('levelName').value = '';
    document.getElementById('levelCode').value = '';
    
    showNotification('Niveau ajouté avec succès', 'success');
}

function updateLevelsList() {
    const levelsList = document.getElementById('levelsList');
    if (!levelsList) return;
    
    levelsList.innerHTML = '';
    
    appData.levels.forEach(level => {
        const levelDiv = document.createElement('div');
        levelDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        levelDiv.innerHTML = `
            <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-3" style="background-color: ${level.color}"></div>
                <span class="font-medium">${level.name}</span>
                <span class="text-gray-500 text-sm ml-2">(${level.code})</span>
            </div>
            <button onclick="deleteLevel('${level.id}')" class="text-red-500 hover:text-red-700">
                <span class="text-lg">🗑️</span>
            </button>
        `;
        levelsList.appendChild(levelDiv);
    });
}

function deleteLevel(levelId) {
    // Vérifier s'il y a des programmes associés
    const hasPrograms = appData.programs.some(program => program.level_id === levelId);
    
    if (hasPrograms) {
        alert('Impossible de supprimer ce niveau car il contient des parcours. Supprimez d\'abord les parcours associés.');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce niveau ?')) {
        appData.levels = appData.levels.filter(level => level.id !== levelId);
        saveData();
        updateLevelsList();
        updateLevelSelects();
        showNotification('Niveau supprimé avec succès', 'success');
    }
}

// Gestion des parcours
function openProgramsModal() {
    openModal('programsModal');
    updateLevelSelects();
}

function addProgram() {
    const levelId = document.getElementById('programLevel').value;
    const name = document.getElementById('programName').value.trim();
    const code = document.getElementById('programCode').value.trim();
    
    if (!levelId || !name || !code) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    // Vérifier les doublons
    const exists = appData.programs.some(program => 
        program.name.toLowerCase() === name.toLowerCase() && 
        program.level_id === levelId
    );
    
    if (exists) {
        alert('Ce parcours existe déjà pour ce niveau');
        return;
    }
    
    const level = appData.levels.find(l => l.id === levelId);
    const newProgram = {
        id: 'program_' + Date.now(),
        level_id: levelId,
        name: name,
        code: code,
        color: level ? level.color : '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    
    appData.programs.push(newProgram);
    saveData();
    
    // Vider les champs
    document.getElementById('programLevel').value = '';
    document.getElementById('programName').value = '';
    document.getElementById('programCode').value = '';
    
    showNotification('Parcours ajouté avec succès', 'success');
    closeModal('programsModal');
}

function updateProgramsList() {
    // Cette fonction peut être utilisée pour afficher les parcours dans une liste
    console.log('Programs list updated');
}

// Gestion des cours
function openCoursesModal() {
    openModal('coursesModal');
    updateLevelSelects();
}

function addCourse() {
    const name = document.getElementById('courseName').value.trim();
    const code = document.getElementById('courseCode').value.trim();
    const description = document.getElementById('courseDescription').value.trim();
    const levelId = document.getElementById('courseLevel').value;
    const programId = document.getElementById('courseProgram').value;
    const teacher = document.getElementById('courseTeacher').value.trim();
    const duration = parseInt(document.getElementById('courseDuration').value);
    
    if (!name || !code || !levelId || !programId || !teacher || !duration) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Vérifier les doublons
    const exists = appData.courses.some(course => 
        course.code.toLowerCase() === code.toLowerCase()
    );
    
    if (exists) {
        alert('Un cours avec ce code existe déjà');
        return;
    }
    
    const newCourse = {
        id: 'course_' + Date.now(),
        name: name,
        code: code,
        description: description,
        teacher: teacher,
        duration: duration,
        level_id: levelId,
        program_id: programId
    };
    
    appData.courses.push(newCourse);
    saveData();
    
    // Vider le formulaire
    document.getElementById('courseForm').reset();
    
    showNotification('Cours créé avec succès', 'success');
    closeModal('coursesModal');
}

function updateCoursesList() {
    // Cette fonction peut être utilisée pour afficher les cours dans une liste
    console.log('Courses list updated');
}

// Mise à jour des sélecteurs
function updateLevelSelects() {
    const courseLevelSelect = document.getElementById('courseLevel');
    const programLevelSelect = document.getElementById('programLevel');
    
    if (courseLevelSelect) {
        courseLevelSelect.innerHTML = '<option value="">Sélectionner un niveau</option>';
        appData.levels.forEach(level => {
            courseLevelSelect.innerHTML += `<option value="${level.id}">${level.name}</option>`;
        });
    }
    
    if (programLevelSelect) {
        programLevelSelect.innerHTML = '<option value="">Sélectionner un niveau</option>';
        appData.levels.forEach(level => {
            programLevelSelect.innerHTML += `<option value="${level.id}">${level.name}</option>`;
        });
    }
}

function updateProgramSelect() {
    const levelId = this.event.target.value;
    const programSelect = document.getElementById('courseProgram');
    
    if (programSelect && levelId) {
        programSelect.innerHTML = '<option value="">Sélectionner un parcours</option>';
        const levelPrograms = appData.programs.filter(program => program.level_id === levelId);
        levelPrograms.forEach(program => {
            programSelect.innerHTML += `<option value="${program.id}">${program.name}</option>`;
        });
    }
}

// Système d'envoi d'email
async function sendEmail(to, subject, body, attachments = []) {
    try {
        // Simulation de l'envoi d'email (dans une vraie application, ceci serait une vraie API)
        const emailData = {
            from: EMAIL_CONFIG.from,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject: subject,
            body: body,
            attachments: attachments,
            timestamp: new Date().toISOString(),
            status: 'sent'
        };
        
        // Simuler un délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Enregistrer l'email envoyé
        appData.emails.push(emailData);
        saveData();
        
        showNotification('Email envoyé avec succès', 'success');
        return { success: true, messageId: 'msg_' + Date.now() };
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        showNotification('Erreur lors de l\'envoi de l\'email', 'error');
        return { success: false, error: error.message };
    }
}

// Envoyer un emploi du temps par email
async function sendScheduleEmail(levelId, programId, weekStart) {
    try {
        const level = appData.levels.find(l => l.id === levelId);
        const program = appData.programs.find(p => p.id === programId);
        
        if (!level || !program) {
            throw new Error('Niveau ou parcours non trouvé');
        }
        
        // Générer le contenu de l'email
        const subject = `Emploi du Temps - ${program.name} ${level.name} - Semaine du ${weekStart}`;
        const body = generateScheduleEmailBody(level, program, weekStart);
        
        // Liste des destinataires (simulée)
        const recipients = [
            'etudiants@career-academyinstitute.com',
            'enseignants@career-academyinstitute.com'
        ];
        
        // Générer le PDF de l'emploi du temps
        const pdfData = await generateSchedulePDF(level, program, weekStart);
        
        // Envoyer l'email avec le PDF en pièce jointe
        const result = await sendEmail(recipients, subject, body, [pdfData]);
        
        return result;
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de planning:', error);
        showNotification('Erreur lors de l\'envoi du planning', 'error');
        return { success: false, error: error.message };
    }
}

// Générer le corps de l'email de planning
function generateScheduleEmailBody(level, program, weekStart) {
    return `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1e3a8a; text-align: center;">Emploi du Temps</h2>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #374151; margin-top: 0;">${program.name} - ${level.name}</h3>
                    <p style="color: #6b7280; margin-bottom: 0;">Semaine du ${weekStart}</p>
                </div>
                
                <p>Bonjour,</p>
                <p>Veuillez trouver ci-joint l'emploi du temps pour la semaine à venir.</p>
                <p>Pour toute question ou modification, n'hésitez pas à contacter l'administration.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                    <p>Cet email a été envoyé automatiquement par le système de gestion universitaire.</p>
                    <p>Career Academy Institute - charles@career-academyinstitute.com</p>
                </div>
            </div>
        </body>
    </html>
    `;
}

// Générer un PDF de l'emploi du temps
async function generateSchedulePDF(level, program, weekStart) {
    try {
        // Simulation de la génération de PDF
        // Dans une vraie application, vous utiliseriez une bibliothèque comme jsPDF
        const pdfData = {
            filename: `emploi-temps-${program.code}-${level.code}-${weekStart.replace(/\//g, '-')}.pdf`,
            content: 'PDF généré avec succès',
            size: 1024,
            type: 'application/pdf'
        };
        
        showNotification('PDF généré avec succès', 'success');
        return pdfData;
        
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        showNotification('Erreur lors de la génération du PDF', 'error');
        throw error;
    }
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

// Export des fonctions pour utilisation dans d'autres fichiers
window.universityApp = {
    appData,
    addLevel,
    addProgram,
    addCourse,
    sendEmail,
    sendScheduleEmail,
    generateSchedulePDF,
    showNotification,
    openModal,
    closeModal,
    saveData
};

// Gestion de la navigation entre pages
function navigateToPage(page) {
    window.location.href = page;
}

// Fonctions utilitaires
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR');
}

function formatTime(time) {
    return new Date('1970-01-01 ' + time).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur globale:', e.error);
    showNotification('Une erreur est survenue', 'error');
});

// Gestion de la déconnexion et sauvegarde
window.addEventListener('beforeunload', function() {
    saveData();
});

console.log('Application de Gestion Universitaire chargée avec succès');
console.log('Email configuré:', EMAIL_CONFIG.from);