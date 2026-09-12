import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  Auth,
} from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

export interface ConfiguracionFirebaseCredenciales {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId: string
}

export class GestorFirebase {
  private static app: FirebaseApp | null = null
  private static auth: Auth | null = null
  private static db: Firestore | null = null

  private static readonly CONFIG_PREDETERMINADA: ConfiguracionFirebaseCredenciales = {
    projectId: 'vialgo-app',
    appId: '1:919641122811:web:ea90a2ce99e03a617f8d5e',
    storageBucket: 'vialgo-app.firebasestorage.app',
    apiKey: 'AIzaSyD2NlgQL5LUBJ2sf4u7T2MQlOW8AeNN9As',
    authDomain: 'vialgo-app.firebaseapp.com',
    messagingSenderId: '919641122811',
  }

  static estaConfigurado(): boolean {
    return true
  }

  static obtenerApp(): FirebaseApp {
    if (!this.app) {
      const apps = getApps()
      if (apps.length > 0) {
        this.app = apps[0]
      } else {
        const config: ConfiguracionFirebaseCredenciales = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY || this.CONFIG_PREDETERMINADA.apiKey,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || this.CONFIG_PREDETERMINADA.authDomain,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || this.CONFIG_PREDETERMINADA.projectId,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || this.CONFIG_PREDETERMINADA.storageBucket,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || this.CONFIG_PREDETERMINADA.messagingSenderId,
          appId: import.meta.env.VITE_FIREBASE_APP_ID || this.CONFIG_PREDETERMINADA.appId,
        }
        this.app = initializeApp(config)
      }
    }
    return this.app
  }

  static obtenerAuth(): Auth | null {
    const app = this.obtenerApp()
    if (!app) return null

    if (!this.auth) {
      this.auth = getAuth(app)
      setPersistence(this.auth, browserLocalPersistence).catch(() => {})
    }
    return this.auth
  }

  static obtenerFirestore(): Firestore | null {
    const app = this.obtenerApp()
    if (!app) return null

    if (!this.db) {
      this.db = getFirestore(app)
    }
    return this.db
  }

  static obtenerProveedorGoogle(): GoogleAuthProvider {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    return provider
  }
}
