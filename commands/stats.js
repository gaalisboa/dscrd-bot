const db = require('../database');

module.exports = {
    name: 'stats',
    description: 'Mostra quantas mensagens você enviou!',
    execute(message) {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(message.author.id);

        if (user) {
            message.reply(`📊 Você já enviou ${user.messages} mensagens!`);
        } else {
            message.reply('❌ Você ainda não está registrado. Use `!registro` primeiro!');
        }
    }
};
