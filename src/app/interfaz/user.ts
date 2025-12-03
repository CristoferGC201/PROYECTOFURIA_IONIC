export interface UserAccount {
  id?: number;      // Lo genera la base de datos automáticamente
  name: string;
  email: string;
  password: string;
  domain?: string;  // Aquí guardaremos "gmail.com", "uabc.edu.mx", etc.
  createdAt?: string;
}