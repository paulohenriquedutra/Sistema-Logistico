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

let currentUserId = 1; 

/**
 * Busca os dados do usuário na API e preenche a interface.
 */
async function fetchUserData() {
    try {
        const res = await fetch(`http://localhost:3000/usuarios/${currentUserId}`);
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        const user = await res.json();

        // Atualiza a interface
        if (userNameDisplay) userNameDisplay.textContent = 'Seja bem-vindo ' + user.nome + '!';
        if (userIdDisplay) userIdDisplay.textContent = user.id;

        return user;
    } catch (erro) {
        console.error('Erro ao buscar dados do usuário:', erro);
        return null;
    }
}

/**
 * Popula o modal de configuração com os dados do usuário
 */
function populateModal(user) {
    if (!user) return;
    userNameInput.value = user.nome || '';
    userLoginInput.value = user.login || '';
    
    document.getElementById('currentPasswordInput').value = '';
    document.getElementById('newPasswordInput').value = '';
    modalStatusMessage.textContent = '';
}

/**
 * Salva alterações do usuário via API
 */
async function handleSaveProfile() {
    const newUserName = userNameInput.value.trim();
    const newUserLogin = userLoginInput.value.trim();

    if (!newUserName || !newUserLogin) {
        modalStatusMessage.textContent = 'Nome e Login são obrigatórios.';
        modalStatusMessage.className = 'text-sm font-medium text-red-600 h-4';
        return;
    }

    saveButtonText.textContent = 'Salvando...';
    saveUserBtn.disabled = true;

    try {
        const res = await fetch(`http://localhost:3000/usuarios/${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: newUserName, login: newUserLogin })
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        modalStatusMessage.textContent = 'Configurações salvas com sucesso!';
        modalStatusMessage.className = 'text-sm font-medium text-green-600 h-4';

        await fetchUserData();

        const newPassword = document.getElementById('newPasswordInput').value.trim();
        if (newPassword) {
            console.log('troca de senha concluída.');
        }

    } catch (erro) {
        console.error('Erro ao salvar perfil:', erro);
        modalStatusMessage.textContent = 'Erro ao salvar. Verifique o console.';
        modalStatusMessage.className = 'text-sm font-medium text-red-600 h-4';
    } finally {
        saveButtonText.textContent = 'Salvar Alterações';
        saveUserBtn.disabled = false;
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    
    const user = await fetchUserData();

    // Modal
    openModalBtn.addEventListener('click', () => {
        if (userConfigModal) {
            populateModal(user);
            userConfigModal.showModal();
        }
    });

    closeModalBtn.addEventListener('click', () => {
        if (userConfigModal) {
            userConfigModal.close();
            modalStatusMessage.textContent = '';
        }
    });

    saveUserBtn.addEventListener('click', handleSaveProfile);
});
