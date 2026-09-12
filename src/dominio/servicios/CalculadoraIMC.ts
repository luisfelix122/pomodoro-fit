export interface ResultadoIMC {
  imc: number
  clasificacion: 'Bajo peso' | 'Peso normal' | 'Sobrepeso' | 'Obesidad'
  mensajeSalud: string
}

export class CalculadoraIMC {
  static calcular(pesoKg: number, alturaCm: number): ResultadoIMC {
    if (pesoKg <= 0) {
      throw new Error('El peso debe ser mayor a cero')
    }
    if (alturaCm <= 0) {
      throw new Error('La altura debe ser mayor a cero')
    }

    const alturaMetros = alturaCm / 100
    const imc = pesoKg / (alturaMetros * alturaMetros)

    let clasificacion: ResultadoIMC['clasificacion'] = 'Peso normal'
    let mensajeSalud = 'Tu peso se encuentra en un rango saludable.'

    if (imc < 18.5) {
      clasificacion = 'Bajo peso'
      mensajeSalud = 'Tu peso está por debajo de lo recomendado. Priorizá nutrición adecuada.'
    } else if (imc < 25) {
      clasificacion = 'Peso normal'
      mensajeSalud = 'Excelente estado. Mantené tu actividad y hábitos de hidratación.'
    } else if (imc < 30) {
      clasificacion = 'Sobrepeso'
      mensajeSalud = 'Ligero sobrepeso. Las pausas activas y buena hidratación ayudarán a equilibrar.'
    } else {
      clasificacion = 'Obesidad'
      mensajeSalud = 'Nivel de alerta. Te recomendamos complementar con actividad regular y consulta médica.'
    }

    return {
      imc: Number(imc.toFixed(2)),
      clasificacion,
      mensajeSalud,
    }
  }
}
