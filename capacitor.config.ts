import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PROYECTOFURIA_IONIC',
  webDir: 'www',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsDatabaseEncrypted: false,
      androidDatabaseLocation: 'default',
      androidIsDatabaseEncrypted: false,
      // CONFIGURACIÓN WEB OBLIGATORIA
      webDatabaseArea: 'sqlite_storage',
      webType: 'jeep-sqlite' 
    }
  }
};

export default config;