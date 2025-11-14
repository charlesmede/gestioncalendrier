// Module de Gestion des Emails
// Career Academy Institute

let selectedTemplate = 'schedule';
let emailHistory = [];
let emailTemplates = {};

// Templates d'email prédéfinis
const DEFAULT_TEMPLATES = {
    schedule: {
        name: 'Emploi du Temps',
        icon: '📅',
        subject: 'Emploi du Temps - {level} {program} - Semaine du {date}',
        body: `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
                        <h2 style="color: white; margin: 0;">Emploi du Temps</h2>
                        <p style="color: #e2e8f0; margin: 5px 0 0 0;">Career Academy Institute</p>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">{level} - {program}</h3>
                        <p style="color: #6b7280; margin-bottom: 0;"><strong>Semaine du {date}</strong></p>
                    </div>
                    
                    <p>Bonjour,</p>
                    <p>Veuillez trouver ci-joint l'emploi du temps pour la semaine à venir.</p>
                    
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <h4 style="color: #374151; margin-top: 0;">Résumé de la semaine:</h4>
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-top: 12px;">
                            {schedule_summary}
                        </div>
                    </div>
                    
                    <p>Pour toute question ou modification, n'hésitez pas à contacter l'administration.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                        <p>Cet email a été envoyé automatiquement par le système de gestion universitaire.</p>
                        <p>Career Academy Institute - charles@career-academyinstitute.com</p>
                    </div>
                </div>
            </body>
        </html>
        `
    },
    announcement: {
        name: 'Annonce',
        icon: '📢',
        subject: 'Annonce Importante - Career Academy Institute',
        body: `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #f59e0b; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
                        <h2 style="color: white; margin: 0;">📢 Annonce Importante</h2>
                        <p style="color: #fef3c7; margin: 5px 0 0 0;">Career Academy Institute</p>
                    </div>
                    
                    <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e;"><strong>{message_content}</strong></p>
                    </div>
                    
                    <p>Cette annonce concerne tous les étudiants et enseignants concernés.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                        <p>Career Academy Institute - charles@career-academyinstitute.com</p>
                        <p>Pour toute question, veuillez contacter l'administration.</p>
                    </div>
                </div>
            </body>
        </html>
        `
    },
    reminder: {
        name: 'Rappel',
        icon: '⏰',
        subject: 'Rappel Important - {event_type}',
        body: `
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #8b5cf6; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
                        <h2 style="color: white; margin: 0;">⏰ Rappel</h2>
                        <p style="color: #e9d5ff; margin: 5px 0 0 0;">Career Academy Institute</p>
                    </div>
                    
                    <div style="background: #faf5ff; border: 1px solid #8b5cf6; border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <h3 style="color: #7c3aed; margin-top: 0;">{event_type}</h3>
                        <p style="margin: 8px 0 0 0; color: #6b7280;"><strong>Date:</strong> {event_date}</p>
                        <p style="margin: 4px 0 0 0; color: #6b7280;"><strong>Heure:</strong> {event_time}</p>
                        <p style="margin: 4px 0 0 0; color: #6b7280;"><strong>Lieu:</strong> {event_location}</p>
                    </div>
                    
                    <p style="color: #374151;">{reminder_message}</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                        <p>Career Academy Institute - charles@career-academyinstitute.com</p>
                    </div>
                </div>
            </body>
        </html>
        `
    },
    custom: {
        name: 'Personnalisé',
        icon: '✉️',
        subject: '',
        body: ''
    }
};

// Initialisation de la page email
document.addEventListener('DOMContentLoaded', function() {
    initializeEmailPage();
    setupEventListeners();
    loadEmailHistory();
    loadFilters();
    updateEmailStatistics();
    initializeEmailChart();
    selectTemplate('schedule');
});

function initializeEmailPage() {
    // Charger les templates depuis le localStorage ou utiliser les défauts
    const savedTemplates = localStorage.getItem('emailTemplates');
    emailTemplates = savedTemplates ? JSON.parse(savedTemplates) : DEFAULT_TEMPLATES;
    
    // Charger l'historique des emails
    const savedHistory = localStorage.getItem('emailHistory');
    emailHistory = savedHistory ? JSON.parse(savedHistory) : [];
}

function setupEventListeners() {
    // Formulaire de composition
    document.getElementById('composeForm').addEventListener('submit', handleEmailSubmit);
    
    // Filtre d'historique
    document.getElementById('statusFilter').addEventListener('change', filterEmailHistory);
    
    // Sélection de template
    document.querySelectorAll('[data-template]').forEach(card => {
        card.addEventListener('click', () => {
            const template = card.dataset.template;
            selectTemplate(template);
        });
    });
}

function loadFilters() {
    if (!window.universityApp || !window.universityApp.appData) return;
    
    const data = window.universityApp.appData;
    
    // Charger les niveaux pour les envois rapides
    const quickSendLevel = document.getElementById('quickSendLevel');
    const composeLevel = document.getElementById('composeLevel');
    
    [quickSendLevel, composeLevel].forEach(select => {
        select.innerHTML = '<option value="">Tous les niveaux</option>';
        data.levels.forEach(level => {
            select.innerHTML += `<option value="${level.id}">${level.name}</option>`;
        });
    });
}

function selectTemplate(templateName) {
    selectedTemplate = templateName;
    
    // Mettre à jour l'affichage des cartes
    document.querySelectorAll('[data-template]').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-template="${templateName}"]`).classList.add('selected');
    
    // Afficher l'aperçu
    updateTemplatePreview();
}

function updateTemplatePreview() {
    const template = emailTemplates[selectedTemplate];
    const preview = document.getElementById('templatePreview');
    
    if (template) {
        const previewContent = template.body
            .replace('{level}', 'L3 Informatique')
            .replace('{program}', 'Informatique')
            .replace('{date}', new Date().toLocaleDateString('fr-FR'))
            .replace('{message_content}', 'Message d\'annonce important')
            .replace('{event_type}', 'Examen de Programmation Web')
            .replace('{event_date}', new Date().toLocaleDateString('fr-FR'))
            .replace('{event_time}', '14:00 - 16:00')
            .replace('{event_location}', 'Salle A101')
            .replace('{reminder_message}', 'N\'oubliez pas d\'apporter votre ordinateur et vos documents.')
            .replace('{schedule_summary}', '<div style="text-align: center; padding: 8px; background: #f3f4f6; border-radius: 4px;">Lun: 2h<br>Mar: 3h<br>Mer: 1h</div>');
        
        preview.innerHTML = previewContent;
    }
}

function openComposeModal() {
    resetComposeForm();
    openModal('composeModal');
}

function closeComposeModal() {
    closeModal('composeModal');
}

function resetComposeForm() {
    document.getElementById('composeForm').reset();
    document.getElementById('composeStudents').checked = true;
}

async function handleEmailSubmit(e) {
    e.preventDefault();
    
    const formData = {
        recipients: {
            students: document.getElementById('composeStudents').checked,
            teachers: document.getElementById('composeTeachers').checked,
            admin: document.getElementById('composeAdmin').checked
        },
        level: document.getElementById('composeLevel').value,
        subject: document.getElementById('composeSubject').value.trim(),
        message: document.getElementById('composeMessage').value.trim(),
        attachments: document.getElementById('composeAttachments').files
    };
    
    // Validation
    if (!formData.recipients.students && !formData.recipients.teachers && !formData.recipients.admin) {
        alert('Veuillez sélectionner au moins un destinataire');
        return;
    }
    
    if (!formData.subject || !formData.message) {
        alert('Veuillez remplir le sujet et le message');
        return;
    }
    
    // Afficher une notification de traitement
    showNotification('Préparation de l\'envoi d\'email...', 'info');
    
    try {
        // Simuler l'envoi d'email avec un délai
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Créer l'entrée d'historique
        const emailRecord = {
            id: 'email_' + Date.now(),
            subject: formData.subject,
            recipients: generateRecipientList(formData.recipients, formData.level),
            message: formData.message,
            timestamp: new Date().toISOString(),
            status: 'sent',
            attachments: formData.attachments.length,
            level: formData.level || 'Tous niveaux'
        };
        
        // Ajouter à l'historique
        emailHistory.unshift(emailRecord);
        saveEmailHistory();
        
        // Mettre à jour les statistiques
        updateEmailStatistics();
        
        // Rafraîchir l'historique
        renderEmailHistory();
        
        showNotification('Email envoyé avec succès', 'success');
        closeComposeModal();
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        showNotification('Erreur lors de l\'envoi de l\'email', 'error');
        
        // Enregistrer l'échec dans l'historique
        const emailRecord = {
            id: 'email_' + Date.now(),
            subject: formData.subject,
            recipients: generateRecipientList(formData.recipients, formData.level),
            message: formData.message,
            timestamp: new Date().toISOString(),
            status: 'failed',
            attachments: formData.attachments.length,
            level: formData.level || 'Tous niveaux'
        };
        
        emailHistory.unshift(emailRecord);
        saveEmailHistory();
        updateEmailStatistics();
        renderEmailHistory();
    }
}

function generateRecipientList(recipients, level) {
    const list = [];
    if (recipients.students) list.push('Étudiants');
    if (recipients.teachers) list.push('Enseignants');
    if (recipients.admin) list.push('Administration');
    
    const levelText = level ? ` (${getLevelNameById(level)})` : '';
    return list.join(', ') + levelText;
}

function getLevelNameById(levelId) {
    if (!window.universityApp || !window.universityApp.appData) return 'Tous niveaux';
    
    const level = window.universityApp.appData.levels.find(l => l.id === levelId);
    return level ? level.name : 'Tous niveaux';
}

async function sendQuickEmail() {
    const type = document.getElementById('quickSendType').value;
    const recipients = {
        students: document.getElementById('sendToStudents').checked,
        teachers: document.getElementById('sendToTeachers').checked,
        admin: document.getElementById('sendToAdmin').checked
    };
    const level = document.getElementById('quickSendLevel').value;
    
    if (!recipients.students && !recipients.teachers && !recipients.admin) {
        alert('Veuillez sélectionner au moins un destinataire');
        return;
    }
    
    // Utiliser le template approprié
    const template = emailTemplates[type];
    if (!template) {
        alert('Template non trouvé');
        return;
    }
    
    showNotification('Préparation de l\'envoi rapide...', 'info');
    
    try {
        // Préparer les données du template
        const subject = template.subject
            .replace('{level}', level ? getLevelNameById(level) : 'Tous niveaux')
            .replace('{program}', 'Informatique')
            .replace('{date}', new Date().toLocaleDateString('fr-FR'))
            .replace('{event_type}', 'Cours programmés')
            .replace('{event_date}', new Date().toLocaleDateString('fr-FR'));
        
        const body = template.body
            .replace('{level}', level ? getLevelNameById(level) : 'Tous niveaux')
            .replace('{program}', 'Informatique')
            .replace('{date}', new Date().toLocaleDateString('fr-FR'))
            .replace('{message_content}', 'Veuillez consulter votre emploi du temps mis à jour.')
            .replace('{event_type}', 'Cours')
            .replace('{event_date}', new Date().toLocaleDateString('fr-FR'))
            .replace('{event_time}', 'Selon planning')
            .replace('{event_location}', 'Campus universitaire')
            .replace('{reminder_message}', 'Merci de vérifier vos horaires régulièrement.')
            .replace('{schedule_summary}', '<p>Voir l\'emploi du temps en pièce jointe.</p>');
        
        // Simuler l'envoi
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Créer l'entrée d'historique
        const emailRecord = {
            id: 'email_' + Date.now(),
            subject: subject,
            recipients: generateRecipientList(recipients, level),
            message: 'Email envoyé via envoi rapide',
            timestamp: new Date().toISOString(),
            status: 'sent',
            attachments: 0,
            level: level || 'Tous niveaux',
            template: type
        };
        
        emailHistory.unshift(emailRecord);
        saveEmailHistory();
        
        updateEmailStatistics();
        renderEmailHistory();
        
        showNotification('Email envoyé avec succès', 'success');
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi rapide:', error);
        showNotification('Erreur lors de l\'envoi rapide', 'error');
    }
}

function saveDraft() {
    const formData = {
        recipients: {
            students: document.getElementById('composeStudents').checked,
            teachers: document.getElementById('composeTeachers').checked,
            admin: document.getElementById('composeAdmin').checked
        },
        level: document.getElementById('composeLevel').value,
        subject: document.getElementById('composeSubject').value.trim(),
        message: document.getElementById('composeMessage').value.trim()
    };
    
    localStorage.setItem('emailDraft', JSON.stringify(formData));
    showNotification('Brouillon sauvegardé', 'success');
}

function loadDraft() {
    const draft = localStorage.getItem('emailDraft');
    if (draft) {
        const formData = JSON.parse(draft);
        document.getElementById('composeStudents').checked = formData.recipients.students;
        document.getElementById('composeTeachers').checked = formData.recipients.teachers;
        document.getElementById('composeAdmin').checked = formData.recipients.admin;
        document.getElementById('composeLevel').value = formData.level;
        document.getElementById('composeSubject').value = formData.subject;
        document.getElementById('composeMessage').value = formData.message;
    }
}

function updateEmailStatistics() {
    const sent = emailHistory.filter(email => email.status === 'sent').length;
    const pending = emailHistory.filter(email => email.status === 'pending').length;
    const failed = emailHistory.filter(email => email.status === 'failed').length;
    
    document.getElementById('sentEmails').textContent = sent;
    document.getElementById('pendingEmails').textContent = pending;
    document.getElementById('failedEmails').textContent = failed;
    
    // Calculer le taux de livraison
    const total = sent + failed;
    const deliveryRate = total > 0 ? Math.round((sent / total) * 100) : 100;
    document.getElementById('deliveryRate').textContent = deliveryRate + '%';
}

function renderEmailHistory() {
    const container = document.getElementById('emailHistory');
    const noMessage = document.getElementById('noEmailsMessage');
    
    if (emailHistory.length === 0) {
        container.innerHTML = '';
        noMessage.classList.remove('hidden');
        return;
    }
    
    noMessage.classList.add('hidden');
    
    const statusFilter = document.getElementById('statusFilter').value;
    const filteredEmails = statusFilter ? 
        emailHistory.filter(email => email.status === statusFilter) : 
        emailHistory;
    
    container.innerHTML = '';
    
    filteredEmails.forEach(email => {
        const emailCard = createEmailCard(email);
        container.appendChild(emailCard);
    });
}

function createEmailCard(email) {
    const card = document.createElement('div');
    card.className = `email-card ${email.status} p-6 rounded-xl cursor-pointer`;
    
    const statusIcon = {
        sent: '✅',
        pending: '⏳',
        failed: '❌'
    };
    
    const statusText = {
        sent: 'Envoyé',
        pending: 'En attente',
        failed: 'Échoué'
    };
    
    const date = new Date(email.timestamp).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
                <div class="flex items-center mb-2">
                    <span class="text-lg mr-2">${statusIcon[email.status]}</span>
                    <h4 class="font-semibold text-gray-800">${email.subject}</h4>
                </div>
                <p class="text-sm text-gray-600 mb-2">${email.recipients}</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>${date}</span>
                    <span class="px-2 py-1 bg-gray-100 rounded-full text-xs">${statusText[email.status]}</span>
                    ${email.attachments > 0 ? `<span>📎 ${email.attachments} fichier(s)</span>` : ''}
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="resendEmail('${email.id}')" class="p-2 text-blue-600 hover:text-blue-800 transition-colors" title="Renvoyer">
                    <span class="text-sm">🔄</span>
                </button>
                <button onclick="viewEmailDetails('${email.id}')" class="p-2 text-gray-600 hover:text-gray-800 transition-colors" title="Détails">
                    <span class="text-sm">👁️</span>
                </button>
            </div>
        </div>
        
        <div class="text-sm text-gray-600">
            <p>${email.message.substring(0, 150)}${email.message.length > 150 ? '...' : ''}</p>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            viewEmailDetails(email.id);
        }
    });
    
    return card;
}

function viewEmailDetails(emailId) {
    const email = emailHistory.find(e => e.id === emailId);
    if (!email) return;
    
    const modal = document.getElementById('emailDetailModal');
    const content = document.getElementById('emailDetailContent');
    
    const date = new Date(email.timestamp).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const statusIcon = {
        sent: '✅',
        pending: '⏳',
        failed: '❌'
    };
    
    const statusText = {
        sent: 'Envoyé',
        pending: 'En attente',
        failed: 'Échoué'
    };
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2">Informations Générales</h4>
                    <div class="space-y-2 text-sm">
                        <div><strong>Sujet:</strong> ${email.subject}</div>
                        <div><strong>Destinataires:</strong> ${email.recipients}</div>
                        <div><strong>Date:</strong> ${date}</div>
                        <div><strong>Statut:</strong> ${statusIcon[email.status]} ${statusText[email.status]}</div>
                        <div><strong>Niveau:</strong> ${email.level}</div>
                        ${email.template ? `<div><strong>Template:</strong> ${email.template}</div>` : ''}
                        ${email.attachments > 0 ? `<div><strong>Pièces jointes:</strong> ${email.attachments} fichier(s)</div>` : ''}
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2">Statistiques</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Envoyés:</span>
                            <span class="text-green-600 font-medium">${email.status === 'sent' ? '1' : '0'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Échoués:</span>
                            <span class="text-red-600 font-medium">${email.status === 'failed' ? '1' : '0'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>En attente:</span>
                            <span class="text-orange-600 font-medium">${email.status === 'pending' ? '1' : '0'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">Message</h4>
                <div class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">${email.message}</p>
                </div>
            </div>
            
            <div class="flex space-x-3 pt-4">
                <button onclick="resendEmail('${email.id}')" class="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    🔄 Renvoyer
                </button>
                <button onclick="closeEmailDetailModal()" class="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                    Fermer
                </button>
            </div>
        </div>
    `;
    
    openModal('emailDetailModal');
}

function resendEmail(emailId) {
    const email = emailHistory.find(e => e.id === emailId);
    if (!email) return;
    
    showNotification('Préparation du renvoi...', 'info');
    
    // Simuler le renvoi
    setTimeout(() => {
        // Mettre à jour le statut
        email.status = 'sent';
        email.timestamp = new Date().toISOString();
        
        saveEmailHistory();
        updateEmailStatistics();
        renderEmailHistory();
        
        showNotification('Email renvoyé avec succès', 'success');
        
        if (document.getElementById('emailDetailModal').classList.contains('hidden')) {
            closeEmailDetailModal();
        }
    }, 1500);
}

function filterEmailHistory() {
    renderEmailHistory();
}

function clearEmailHistory() {
    if (confirm('Êtes-vous sûr de vouloir vider l\'historique des emails ?')) {
        emailHistory = [];
        saveEmailHistory();
        updateEmailStatistics();
        renderEmailHistory();
        showNotification('Historique vidé avec succès', 'success');
    }
}

function refreshEmailStatus() {
    showNotification('Actualisation des statuts...', 'info');
    
    // Simuler une actualisation
    setTimeout(() => {
        // Mettre à jour quelques emails en attente
        emailHistory.forEach(email => {
            if (email.status === 'pending' && Math.random() > 0.5) {
                email.status = 'sent';
            }
        });
        
        saveEmailHistory();
        updateEmailStatistics();
        renderEmailHistory();
        
        showNotification('Statuts actualisés', 'success');
    }, 1000);
}

function initializeEmailChart() {
    const chartDom = document.getElementById('emailChart');
    const myChart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'item'
        },
        series: [{
            name: 'Statistiques emails',
            type: 'pie',
            radius: '70%',
            data: [
                { value: 45, name: 'Envoyés', itemStyle: { color: '#10b981' } },
                { value: 3, name: 'En attente', itemStyle: { color: '#f59e0b' } },
                { value: 2, name: 'Échoués', itemStyle: { color: '#ef4444' } }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    myChart.setOption(option);
    
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

function createTemplate() {
    const name = prompt('Nom du template:');
    if (!name) return;
    
    const templateId = 'template_' + Date.now();
    emailTemplates[templateId] = {
        name: name,
        icon: '📄',
        subject: '',
        body: ''
    };
    
    localStorage.setItem('emailTemplates', JSON.stringify(emailTemplates));
    showNotification('Template créé avec succès', 'success');
}

function saveEmailHistory() {
    localStorage.setItem('emailHistory', JSON.stringify(emailHistory));
}

function closeEmailDetailModal() {
    closeModal('emailDetailModal');
}

// Fonctions utilitaires
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

console.log('Module de gestion des emails chargé');