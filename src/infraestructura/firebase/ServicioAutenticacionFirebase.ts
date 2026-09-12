import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as UsuarioFirebase,
} from 'firebase/auth'
import { GestorFirebase } from './configuracionFirebase'

export interface DatosSesionUsuario {
  id: string
  nombre: string
  email: string | null
  fotoUrl: string | null
}

export class ServicioAutenticacionFirebase {
  static estaDisponible(): boolean {
    return GestorFirebase.estaConfigurado()
  }

  static async iniciarSesionConGoogle(): Promise<DatosSesionUsuario> {
    const auth = GestorFirebase.obtenerAuth()
    if (!auth) {
      throw new Error('Firebase no está configurado. Por favor agregá tus claves en el archivo .env.')
    }

    const proveedor = GestorFirebase.obtenerProveedorGoogle()
    const resultado = await signInWithPopup(auth, proveedor)
    return this.mapearUsuario(resultado.user)
  }

  static async iniciarSesionConCorreo(correo: string, contrasena: string): Promise<DatosSesionUsuario> {
    const auth = GestorFirebase.obtenerAuth()
    if (!auth) {
      throw new Error('Firebase no está configurado.')
    }

    const resultado = await signInWithEmailAndPassword(auth, correo, contrasena)
    return this.mapearUsuario(resultado.user)
  }

  static async registrarConCorreo(
    correo: string,
    contrasena: string,
    _nombre: string
  ): Promise<DatosSesionUsuario> {
    const auth = GestorFirebase.obtenerAuth()
    if (!auth) {
      throw new Error('Firebase no está configurado.')
    }

    const resultado = await createUserWithEmailAndPassword(auth, correo, contrasena)
    return this.mapearUsuario(resultado.user)
  }

  static async cerrarSesion(): Promise<void> {
    const auth = GestorFirebase.obtenerAuth()
    if (auth) {
      await signOut(auth)
    }
  }

  static suscribirseAEstadoSesion(
    alCambiar: (usuario: DatosSesionUsuario | null) => void
  ): () => void {
    const auth = GestorFirebase.obtenerAuth()
    if (!auth) {
      alCambiar(null)
      return () => {}
    }

    return onAuthStateChanged(auth, (user) => {
      alCambiar(user ? this.mapearUsuario(user) : null)
    })
  }

  private static mapearUsuario(user: UsuarioFirebase): DatosSesionUsuario {
    return {
      id: user.uid,
      nombre: user.displayName || user.email?.split('@')[0] || 'Usuario',
      email: user.email,
      fotoUrl: user.photoURL,
    }
  }
}
