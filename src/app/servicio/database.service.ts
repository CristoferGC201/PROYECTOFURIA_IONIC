import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';
import { UserAccount } from '../interfaz/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  async inicializarPlugin() {
    this.db = await this.sqlite.createConnection('camionesDB', false, 'no-encryption', 1, false);
    await this.db.open();
    
    // --- CREACIÓN DE TABLAS ---
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        domain TEXT NOT NULL,
        createdAt TEXT
      );
      
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        estado TEXT DEFAULT 'Activo',
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        autor TEXT NOT NULL, 
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY(chat_id) REFERENCES chats(id) ON DELETE CASCADE
      );
    `;
    
    await this.db.execute(schema);
    this.dbReady.next(true);
    console.log('✅ Base de Datos SQLite Lista');
  }

  dbState() { return this.dbReady.asObservable(); }

  // --- USUARIOS ---
  async registrarUsuario(user: UserAccount) {
    // AQUÍ SEPARAMOS EL DOMINIO AUTOMÁTICAMENTE
    const domain = user.email.split('@')[1] || 'general'; 
    const sql = `INSERT INTO users (name, email, password, domain, createdAt) VALUES (?, ?, ?, ?, ?)`;
    return await this.db.run(sql, [user.name, user.email, user.password, domain, new Date().toISOString()]);
  }

  async login(email: string, pass: string) {
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    const res = await this.db.query(sql, [email, pass]);
    return res.values && res.values.length > 0 ? res.values[0] : null;
  }

  // --- CHATS ---
  async crearChat(userId: number, titulo: string) {
    const sql = `INSERT INTO chats (user_id, titulo) VALUES (?, ?)`;
    const res = await this.db.run(sql, [userId, titulo]);
    return res.changes?.lastId;
  }

  async obtenerChats(userId: number) {
    const sql = `SELECT * FROM chats WHERE user_id = ? ORDER BY id DESC`;
    const res = await this.db.query(sql, [userId]);
    return res.values || [];
  }

  // --- MENSAJES ---
  async guardarMensaje(chatId: number, text: string, autor: string) {
    const sql = `INSERT INTO messages (chat_id, text, autor) VALUES (?, ?, ?)`;
    return await this.db.run(sql, [chatId, text, autor]);
  }

  async obtenerMensajes(chatId: number) {
    const sql = `SELECT * FROM messages WHERE chat_id = ? ORDER BY id ASC`;
    const res = await this.db.query(sql, [chatId]);
    return res.values || [];
  }
}