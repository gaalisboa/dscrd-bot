require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

// Carregar todos os comandos da pasta
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} está online!`);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
        command.execute(message, args);
    }
});

const db = require('./database');

client.on('messageCreate', message => {
    if (message.author.bot) return;

    const userId = message.author.id;
    let user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    if (user) {
        db.prepare('UPDATE users SET messages = messages + 1 WHERE id = ?').run(userId);
    } else {
        db.prepare('INSERT INTO users (id, username, messages) VALUES (?, ?, 1)').run(userId, message.author.username);
    }
});

client.login(process.env.TOKEN);
