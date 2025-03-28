const db = require('../database');

module.exports = {
    name: 'register',
    description: 'Registra o usuário no banco de dados!',
    execute(message) {
        const userId = message.author.id;
        const username = message.author.username;

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

        if (user) {
            message.reply('📋 Você já está registrado!');
        } else {
            db.prepare('INSERT INTO users (id, username) VALUES (?, ?)').run(userId, username);
            message.reply('✅ Você foi registrado com sucesso!');
        }
    }
};
