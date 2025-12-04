import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { UserAccount } from '../interfaz/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  // Variable para saber si estamos en web
  private isWeb: boolean = false;

  constructor() {
    this.isWeb = Capacitor.getPlatform() === 'web';
  }

  async inicializarPlugin() {
    // 🌍 MODO WEB: Usamos LocalStorage
    if (this.isWeb) {
      console.log('🌍 Modo Web detectado: Usando LocalStorage.');
      this.dbReady.next(true);
      return;
    }

    // 📱 MODO NATIVO: Inicializamos SQLite Real
    try {
      this.db = await this.sqlite.createConnection('camionesDB', false, 'no-encryption', 1, false);
      await this.db.open();
      
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
      console.log('📱 Modo Nativo: Base de Datos SQLite Lista');
    } catch (e) {
      console.error('Error inicializando SQLite nativo:', e);
    }
  }

  dbState() { return this.dbReady.asObservable(); }

  // --- REGISTRO ---
  async registrarUsuario(user: UserAccount) {
    const domain = user.email.split('@')[1] || 'general';

    if (this.isWeb) {
      const users = JSON.parse(localStorage.getItem('web_users') || '[]');
      const existe = users.find((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
      if (existe) throw new Error('El correo ya existe');

      const newId = users.length + 1;
      const newUser = { ...user, id: newId, domain, createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem('web_users', JSON.stringify(users));
      
      return { changes: { lastId: newId } };
    } else {
      const sql = `INSERT INTO users (name, email, password, domain, createdAt) VALUES (?, ?, ?, ?, ?)`;
      return await this.db.run(sql, [user.name, user.email, user.password, domain, new Date().toISOString()]);
    }
  }

  // --- LOGIN ---
  async login(email: string, pass: string) {
    if (this.isWeb) {
      const users = JSON.parse(localStorage.getItem('web_users') || '[]');
      return users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass) || null;
    } else {
      const sql = `SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?`;
      const res = await this.db.query(sql, [email, pass]);
      return res.values && res.values.length > 0 ? res.values[0] : null;
    }
  }

  // --- CREAR CHAT ---
  async crearChat(userId: number, titulo: string) {
    if (this.isWeb) {
      const chats = JSON.parse(localStorage.getItem('web_chats') || '[]');
      const newId = chats.length + 1;
      chats.push({ id: newId, user_id: userId, titulo, estado: 'Activo' });
      localStorage.setItem('web_chats', JSON.stringify(chats));
      return newId;
    } else {
      const sql = `INSERT INTO chats (user_id, titulo) VALUES (?, ?)`;
      const res = await this.db.run(sql, [userId, titulo]);
      return res.changes?.lastId;
    }
  }

  // --- BORRAR CHAT (NUEVO) ---
  async borrarChat(chatId: number) {
    if (this.isWeb) {
      // 1. Borrar chat
      let chats = JSON.parse(localStorage.getItem('web_chats') || '[]');
      chats = chats.filter((c: any) => c.id !== chatId);
      localStorage.setItem('web_chats', JSON.stringify(chats));

      // 2. Borrar mensajes
      let msgs = JSON.parse(localStorage.getItem('web_msgs') || '[]');
      msgs = msgs.filter((m: any) => m.chat_id !== chatId);
      localStorage.setItem('web_msgs', JSON.stringify(msgs));
    } else {
      // SQLite borra en cascada
      const sql = `DELETE FROM chats WHERE id = ?`;
      await this.db.run(sql, [chatId]);
    }
  }

  // --- OBTENER CHATS ---
  async obtenerChats(userId: number) {
    if (this.isWeb) {
      const chats = JSON.parse(localStorage.getItem('web_chats') || '[]');
      return chats.filter((c: any) => c.user_id == userId).reverse(); 
    } else {
      const sql = `SELECT * FROM chats WHERE user_id = ? ORDER BY id DESC`;
      const res = await this.db.query(sql, [userId]);
      return res.values || [];
    }
  }

  // --- GUARDAR MENSAJE ---
  async guardarMensaje(chatId: number, text: string, autor: string) {
    if (this.isWeb) {
      const msgs = JSON.parse(localStorage.getItem('web_msgs') || '[]');
      const newId = msgs.length + 1;
      msgs.push({ id: newId, chat_id: chatId, text, autor, timestamp: Date.now() });
      localStorage.setItem('web_msgs', JSON.stringify(msgs));
      return { changes: { lastId: newId } };
    } else {
      const sql = `INSERT INTO messages (chat_id, text, autor) VALUES (?, ?, ?)`;
      return await this.db.run(sql, [chatId, text, autor]);
    }
  }

  // --- OBTENER MENSAJES ---
  async obtenerMensajes(chatId: number) {
    if (this.isWeb) {
      const msgs = JSON.parse(localStorage.getItem('web_msgs') || '[]');
      return msgs.filter((m: any) => m.chat_id == chatId);
    } else {
      const sql = `SELECT * FROM messages WHERE chat_id = ? ORDER BY id ASC`;
      const res = await this.db.query(sql, [chatId]);
      return res.values || [];
    }
  }
}