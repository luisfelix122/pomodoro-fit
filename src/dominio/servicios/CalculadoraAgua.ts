export interface DistribucionAgua {
  metaTotalDiariaMl: number
  aguaJornadaMl: number
  aguaFueraJornadaMl: number
}

export class CalculadoraAgua {
  private static readonly ML_POR_KG = 35

  static calcularMetaDiaria(pesoKg: number): number {
    if (pesoKg <= 0) {
      throw new Error('El peso debe ser mayor a cero')
    }
    return Math.round(pesoKg * this.ML_POR_KG)
  }

  static calcularVasos(volumenTotalMl: number, mlPorVaso: number = 250): number {
    if (mlPorVaso <= 0) {
      throw new Error('El volumen por vaso debe ser mayor a cero')
    }
    return Math.round(volumenTotalMl / mlPorVaso)
  }

  static distribuirPorJornada(
    metaDiariaMl: number,
    horasTrabajo: number,
    horasDespiertoTotal: number = 16
  ): DistribucionAgua {
    if (metaDiariaMl <= 0) {
      throw new Error('La meta diaria debe ser mayor a cero')
    }
    if (horasTrabajo < 0) {
      throw new Error('Las horas de trabajo no pueden ser negativas')
    }
    if (horasTrabajo > horasDespiertoTotal) {
      throw new Error('Las horas de trabajo no pueden exceder las horas despierto')
    }

    const proporcionTrabajo = horasTrabajo / horasDespiertoTotal
    const aguaJornadaMl = Math.round(metaDiariaMl * proporcionTrabajo)
    const aguaFueraJornadaMl = metaDiariaMl - aguaJornadaMl

    return {
      metaTotalDiariaMl: metaDiariaMl,
      aguaJornadaMl,
      aguaFueraJornadaMl,
    }
  }
}
