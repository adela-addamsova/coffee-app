import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, 'coffee-app.db'), { timeout: 5000 });

export default db;
