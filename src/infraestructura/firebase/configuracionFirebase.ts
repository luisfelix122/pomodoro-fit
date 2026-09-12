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

  static estaConfigurado(): boolean {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    return Boolean(apiKey && projectId && apiKey !== 'TU_API_KEY')
  }

  static obtenerApp(): FirebaseApp | null {
    if (!this.estaConfigurado()) {
      return null
    }

    if (!this.app) {
      const apps = getApps()
      if (apps.length > 0) {
        this.app = apps[0]
      } else {
        const config: ConfiguracionFirebaseCredenciales = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
