export interface ServicioNotificacion {
  reproducirSonidoInicioTrabajo(): void
  reproducirSonidoPausaActiva(): void
  reproducirSonidoMetaAlcanzada(): void
  enviarNotificacionNavegador(titulo: string, mensaje: string): Promise<boolean>
}
