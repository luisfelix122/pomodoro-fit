import { ServicioNotificacion } from '../../dominio/repositorios/ServicioNotificacion'

export class GeneradorSonidoWeb implements ServicioNotificacion {
  private audioContext: AudioContext | null = null

  private obtenerAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.audioContext = new AudioCtx()
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {})
    }
    return this.audioContext
  }

  reproducirSonidoInicioTrabajo(): void {
    const ctx = this.obtenerAudioContext()
    if (!ctx) return

    // Tono campana suave (Frecuencia 528 Hz - tono de claridad y enfoque)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(528, ctx.currentTime)

    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 1.2)
  }

  reproducirSonidoPausaActiva(): void {
    const ctx = this.obtenerAudioContext()
    if (!ctx) return

    // Dos tonos ascendentes enérgicos para motivar la pausa activa
    const ahora = ctx.currentTime

    // Tono 1: 440 Hz (A4)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(440, ahora)
    gain1.gain.setValueAtTime(0.25, ahora)
    gain1.gain.exponentialRampToValueAtTime(0.001, ahora + 0.3)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ahora)
    osc1.stop(ahora + 0.3)

    // Tono 2: 659.25 Hz (E5)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(659.25, ahora + 0.18)
    gain2.gain.setValueAtTime(0.3, ahora + 0.18)
    gain2.gain.exponentialRampToValueAtTime(0.001, ahora + 0.7)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ahora + 0.18)
    osc2.stop(ahora + 0.7)
  }

  reproducirSonidoMetaAlcanzada(): void {
    const ctx = this.obtenerAudioContext()
    if (!ctx) return

    // Arpegio mayor triunfal (Do - Mi - Sol - Do)
    const notas = [523.25, 659.25, 783.99, 1046.5]
    const inicio = ctx.currentTime

    notas.forEach((freq, idx) => {
      const t = inicio + idx * 0.12
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  async enviarNotificacionNavegador(titulo: string, mensaje: string): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      new Notification(titulo, { body: mensaje, icon: '/favicon.ico' })
      return true
    }

    if (Notification.permission !== 'denied') {
      const permiso = await Notification.requestPermission()
      if (permiso === 'granted') {
        new Notification(titulo, { body: mensaje, icon: '/favicon.ico' })
        return true
      }
    }

    return false
  }
}
