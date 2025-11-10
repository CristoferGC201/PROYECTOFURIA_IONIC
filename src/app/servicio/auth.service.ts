// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { UserAccount } from '../interfaz/user';

const KEY_USERS = 'app_users_v1';
const KEY_SESSION = 'app_session_v1';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  getUsers(): UserAccount[] {
    const raw = localStorage.getItem(KEY_USERS);
    return raw ? JSON.parse(raw) as UserAccount[] : [];
  }


  private saveUsers(users: UserAccount[]) {
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  }

  register(user: UserAccount): { ok: boolean; message: string } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { ok: false, message: 'El correo ya está registrado.' };
    }

    const newUser: UserAccount = {
      ...user,
      email: user.email.toLowerCase(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setSession(newUser.email);
    return { ok: true, message: 'Registro exitoso.' };
  }

  login(email: string, password: string): { ok: boolean; message: string } {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, message: 'Credenciales inválidas.' };
    this.setSession(found.email);
    return { ok: true, message: 'Login correcto.' };
  }

  setSession(email: string | null) {
    if (email) localStorage.setItem(KEY_SESSION, email.toLowerCase());
    else localStorage.removeItem(KEY_SESSION);
  }

  getSession(): string | null {
    return localStorage.getItem(KEY_SESSION);
  }

  logout() {
    this.setSession(null);
  }


  currentUser(): UserAccount | null {
    const email = this.getSession();
    if (!email) return null;
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  removeUserByEmail(email: string) {
    const users = this.getUsers().filter(u => u.email.toLowerCase() !== email.toLowerCase());
    this.saveUsers(users);

    const session = this.getSession();
    if (session && session.toLowerCase() === email.toLowerCase()) this.logout();
  }
}
