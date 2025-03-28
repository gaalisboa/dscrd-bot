const Database = require('better-sqlite3');
const db = new Database('bot.db');

// Criar a tabela se não existir
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT,
        messages INTEGER DEFAULT 0
    )
`).run();

module.exports = db;
