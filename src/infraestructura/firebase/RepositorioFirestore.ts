import { doc, getDoc, setDoc } from 'firebase/firestore'
import { RepositorioUsuario } from '../../dominio/repositorios/RepositorioUsuario'
import { Usuario } from '../../dominio/modelos/Usuario'
import { RegistroDia } from '../../dominio/modelos/RegistroDia'
import { GestorFirebase } from './configuracionFirebase'

export class RepositorioFirestore implements RepositorioUsuario {
  constructor(private usuarioIdActual: string) {}

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    const db = GestorFirebase.obtenerFirestore()
    if (!db || !this.usuarioIdActual) return null

    const docRef = doc(db, 'usuarios', this.usuarioIdActual)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null

    return snapshot.data() as Usuario
  }

  async guardarUsuario(usuario: Usuario): Promise<void> {
    const db = GestorFirebase.obtenerFirestore()
    if (!db) return

    const docRef = doc(db, 'usuarios', usuario.id)
    await setDoc(docRef, usuario, { merge: true })
  }

  async guardarRegistroDia(usuarioId: string, registro: RegistroDia): Promise<void> {
    const db = GestorFirebase.obtenerFirestore()
    if (!db) return

    const docRef = doc(db, 'usuarios', usuarioId, 'dias', registro.fechaIso)
    await setDoc(docRef, registro, { merge: true })
  }

  async obtenerRegistroDia(usuarioId: string, fechaIso: string): Promise<RegistroDia | null> {
    const db = GestorFirebase.obtenerFirestore()
    if (!db) return null

    const docRef = doc(db, 'usuarios', usuarioId, 'dias', fechaIso)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null

    return snapshot.data() as RegistroDia
  }
}
