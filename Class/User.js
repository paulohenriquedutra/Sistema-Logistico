class User {
    constructor(id, login, senha, nome)
    {
        this.id = id;
        this.login = login;
        this.senha = senha;
        this.nome = nome;
    }

    /**
     * Simula a atualização do perfil do usuário.
     * @param {string} newName - Novo nome de exibição.
     * @param {string} newLogin - Novo login/email.
     * @returns {Promise<boolean>} - Simula uma operação assíncrona de sucesso.
     */
    async updateProfile(newName, newLogin) {
        return new Promise(resolve => {
            // Simula um delay de rede para feedback visual
            setTimeout(() => {
                this.nome = newName;
                this.login = newLogin;
                resolve(true);
            }, 500);
        });
    }
}

export let admin = new User(1, 'admin@admin', 'admin', 'Admin');

export default User;