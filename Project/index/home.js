function welcomeUser(username)
{
    const user = document.getElementById('user');

    if (user) 
        user.textContent = 'Seja bem vindo ' + username + '!';
    else
        console.error("Erro: Elemento com ID 'user' não encontrado!");
}

document.addEventListener('DOMContentLoaded', function() {
    
    const nomeFixo = 'Admin'; 
    
    welcomeUser(nomeFixo)
});