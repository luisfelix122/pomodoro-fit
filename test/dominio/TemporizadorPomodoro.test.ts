import { describe, it, expect } from 'vitest'
import { TemporizadorPomodoro } from '../../src/dominio/servicios/TemporizadorPomodoro'
import { TipoFase } from '../../src/dominio/modelos/EstadoTemporizador'

describe('TemporizadorPomodoro', () => {
  it('debe inicializarse en fase de TRABAJO con el tiempo configurado', () => {
    const temp = new TemporizadorPomodoro({
      minutosTrabajo: 25,
      minutosPausaActiva: 5,
      minutosDescansoLargo: 15,
      ciclosParaDescansoLargo: 4,
    })

    const estado = temp.obtenerEstado()
    expect(estado.faseActual).toBe(TipoFase.TRABAJO)
    expect(estado.segundosRestantes).toBe(25 * 60)
    expect(estado.estaCorriendo).toBe(false)
    expect(estado.ciclosCompletados).toBe(0)
  })

  it('debe decrementar los segundos restantes al avanzar', () => {
    const temp = new TemporizadorPomodoro({ minutosTrabajo: 25, minutosPausaActiva: 5 })
    temp.iniciar()
    temp.avanzarSegundo()

    const estado = temp.obtenerEstado()
    expect(estado.segundosRestantes).toBe(25 * 60 - 1)
    expect(estado.estaCorriendo).toBe(true)
  })

  it('debe transicionar de TRABAJO a PAUSA_ACTIVA al llegar a cero', () => {
    const temp = new TemporizadorPomodoro({ minutosTrabajo: 1, minutosPausaActiva: 5 })
    // Forzamos 1 segundo restante
    temp.establecerSegundosRestantes(1)
    temp.iniciar()
    const cambioFase = temp.avanzarSegundo()

    expect(cambioFase).toBe(true)
    const estado = temp.obtenerEstado()
    expect(estado.faseActual).toBe(TipoFase.PAUSA_ACTIVA)
    expect(estado.segundosRestantes).toBe(5 * 60)
    expect(estado.ciclosCompletados).toBe(1)
  })

  it('debe transicionar a DESCANSO_LARGO cuando se alcanzan los ciclos definidos', () => {
    const temp = new TemporizadorPomodoro({
      minutosTrabajo: 1,
      minutosPausaActiva: 1,
      minutosDescansoLargo: 15,
      ciclosParaDescansoLargo: 2,
    })

    // Ciclo 1 completado
    temp.completarFaseActual() // De Trabajo -> Pausa Activa
    expect(temp.obtenerEstado().faseActual).toBe(TipoFase.PAUSA_ACTIVA)
    temp.completarFaseActual() // De Pausa Activa -> Trabajo

    // Ciclo 2 completado
    temp.completarFaseActual() // De Trabajo -> debe ir a Descanso Largo porque alcanzó 2
    expect(temp.obtenerEstado().faseActual).toBe(TipoFase.DESCANSO_LARGO)
    expect(temp.obtenerEstado().segundosRestantes).toBe(15 * 60)
  })
})
