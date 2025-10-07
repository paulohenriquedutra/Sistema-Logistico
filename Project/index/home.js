import User, { admin } from '../../Class/User.js';

// --- Elementos do DOM ---
const userNameDisplay = document.getElementById('user');
const userIdDisplay = document.getElementById('display-user-id');
const openModalBtn = document.getElementById('open-config-modal');
const closeModalBtn = document.getElementById('close-modal');
const saveUserBtn = document.getElementById('save-user-name');
const userConfigModal = document.getElementById('fUserConfig');
const userNameInput = document.getElementById('userNameInput');
const userLoginInput = document.getElementById('userLoginInput');
const modalStatusMessage = document.getElementById('modal-status-message');
const saveButtonText = document.getElementById('save-button-text');


/**
 * Define o texto de boas-vindas na interface e atualiza a exibição.
 * @param {string} username - O nome do usuário para a saudação.
 */
function welcomeUser(username) {
    if (userNameDisplay) {
        // Atualiza a saudação na tela principal
        userNameDisplay.textContent = 'Seja bem vindo ' + username + '!';
    } else {
        console.error("Erro: Elemento com ID 'user' não encontrado!");
    }
}

/**
 * Popula o modal de configuração com os dados atuais do objeto 'admin'.
 */
function populateModal() {
    userNameInput.value = admin.nome || '';
    userLoginInput.value = admin.login || '';
    
    // Campos de senha são deixados vazios por segurança
    document.getElementById('currentPasswordInput').value = '';
    document.getElementById('newPasswordInput').value = '';
    modalStatusMessage.textContent = ''; // Limpa a mensagem de status
}

/**
 * Manipulador para salvar as configurações, atualizando o objeto 'admin' local.
 */
async function handleSaveProfile() {
    const newUserName = userNameInput.value.trim();
    const newUserLogin = userLoginInput.value.trim();
    
    // Validação básica
    if (!newUserName || !newUserLogin) {
        modalStatusMessage.textContent = 'Nome e Login são obrigatórios.';
        modalStatusMessage.className = 'text-sm font-medium text-red-600 h-4';
        return;
    }

    saveButtonText.textContent = 'Salvando...';
    saveUserBtn.disabled = true;

    try {
        // Usa o método do objeto admin (que simula uma chamada de API/DB)
        const success = await admin.updateProfile(newUserName, newUserLogin);

        if (success) {
            modalStatusMessage.textContent = 'Configurações salvas com sucesso!';
            modalStatusMessage.className = 'text-sm font-medium text-green-600 h-4';
            
            // Atualiza o display principal
            welcomeUser(admin.nome);
            
            // SIMULAÇÃO DE TROCA DE SENHA:
            const newPassword = document.getElementById('newPasswordInput').value.trim();
            if (newPassword) {
                 console.log("Simulação de troca de senha concluída para a nova senha.");
                 // Em um caso real, você faria uma chamada para admin.changePassword(newPassword)
            }
        } else {
            throw new Error("Falha na simulação de atualização.");
        }

    } catch (error) {
        console.error("Erro ao salvar o perfil:", error);
        modalStatusMessage.textContent = 'Erro ao salvar. Verifique o console.';
        modalStatusMessage.className = 'text-sm font-medium text-red-600 h-4';
    } finally {
        saveButtonText.textContent = 'Salvar Alterações';
        saveUserBtn.disabled = false;
    }
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Define a saudação inicial com base no objeto admin
    welcomeUser(admin.nome);
    
    // 2. Exibe o ID do usuário (simulado)
    if (userIdDisplay) {
        userIdDisplay.textContent = admin.id;
    }

    // 3. Configura os eventos do Modal
    openModalBtn.addEventListener('click', () => {
        if (userConfigModal) {
            populateModal(); // Preenche o modal com os dados atuais de 'admin'
            userConfigModal.showModal();
        }
    });

    closeModalBtn.addEventListener('click', () => {
        if (userConfigModal) {
            userConfigModal.close();
            modalStatusMessage.textContent = ''; // Limpa o status ao fechar
        }
    });

    saveUserBtn.addEventListener('click', handleSaveProfile);
});
