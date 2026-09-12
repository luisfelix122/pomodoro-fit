import { Ejercicio } from '../modelos/Ejercicio'
import { ZonaCuerpo } from '../modelos/ZonaCuerpo'

export const CATALOGO_EJERCICIOS: Ejercicio[] = [
  // Tren Superior
  {
    id: 'ts-1',
    nombre: 'Flexiones en Escritorio / Pared',
    descripcion: 'Fortalece pecho, hombros y tríceps aprovechando la superficie de tu escritorio o pared.',
    zona: ZonaCuerpo.TREN_SUPERIOR,
    duracionSegundos: 45,
    repeticiones: '12 a 15 repeticiones',
    instrucciones: [
      'Apoyá las manos a la altura de los hombros sobre el borde del escritorio firme o la pared.',
      'Mantené el cuerpo alineado desde los talones a la cabeza, activando el abdomen.',
      'Bajá el pecho controladamente flexionando los codos a 45 grados y empujá para volver.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'ts-2',
    nombre: 'Fondos de Tríceps en Silla',
    descripcion: 'Excelente para tonificar brazos y compensar la postura caída de hombros.',
    zona: ZonaCuerpo.TREN_SUPERIOR,
    duracionSegundos: 40,
    repeticiones: '10 a 12 repeticiones',
    instrucciones: [
      'Sentate en el borde de una silla firme y apoyá las palmas al lado de las caderas.',
      'Adelantá los pies y bajá el torso doblando los codos hacia atrás.',
      'Empujá con fuerza de tríceps para subir sin encoger los hombros.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'ts-3',
    nombre: 'Flexiones Escapulares',
    descripcion: 'Activa la musculatura alta de la espalda y previene molestias cervicales.',
    zona: ZonaCuerpo.TREN_SUPERIOR,
    duracionSegundos: 45,
    repeticiones: '15 repeticiones',
    instrucciones: [
      'Colocate en posición de plancha alta o apoyado en la pared con brazos extendidos.',
      'Sin doblar los codos, juntá los omóplatos atrás y luego separalos empujando la pared.',
      'Mantené el movimiento lento y enfocado en la espalda media-alta.',
    ],
    dificultad: 'PRINCIPIANTE',
  },

  // Tren Inferior
  {
    id: 'ti-1',
    nombre: 'Sentadillas al Aire',
    descripcion: 'Activa cuádriceps y glúteos tras periodos prolongados sentado.',
    zona: ZonaCuerpo.TREN_INFERIOR,
    duracionSegundos: 45,
    repeticiones: '15 repeticiones',
    instrucciones: [
      'Pies separados al ancho de hombros, puntas ligeramente hacia afuera.',
      'Bajá las caderas como sentándote en una silla imaginaria manteniendo el pecho erguido.',
      'Empujá desde los talones para volver a la posición inicial apretando glúteos.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'ti-2',
    nombre: 'Elevación de Talones (Gemelos)',
    descripcion: 'Estimula el retorno venoso y la circulación de las piernas.',
    zona: ZonaCuerpo.TREN_INFERIOR,
    duracionSegundos: 40,
    repeticiones: '20 repeticiones',
    instrucciones: [
      'Parate erguido, podés apoyar la mano en la pared para equilibrio.',
      'Elevate sobre las puntas de los pies contrayendo gemelos en la cima por 1 segundo.',
      'Bajá despacio sintiendo el control del movimiento.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'ti-3',
    nombre: 'Sentadilla Isométrica en Pared',
    descripcion: 'Fuerza estática pura para piernas sin impacto articular.',
    zona: ZonaCuerpo.TREN_INFERIOR,
    duracionSegundos: 35,
    repeticiones: 'Mantener 30 a 45 segundos',
    instrucciones: [
      'Apoyá la espalda completamente contra una pared lisa.',
      'Deslizate hacia abajo hasta que rodillas y caderas formen un ángulo de 90 grados.',
      'Mantené la posición respirando con ritmo constante.',
    ],
    dificultad: 'INTERMEDIO',
  },

  // Core
  {
    id: 'co-1',
    nombre: 'Plancha Abdominal en Escritorio o Suelo',
    descripcion: 'Fortalecimiento de toda la faja lumbar y abdominal.',
    zona: ZonaCuerpo.CORE,
    duracionSegundos: 40,
    repeticiones: 'Mantener 30 a 45 segundos',
    instrucciones: [
      'Apoyá los antebrazos sobre una colchoneta o sobre tu escritorio firme.',
      'Alineá talones, cadera y hombros en una sola línea recta.',
      'Apretá el abdomen y los glúteos evitando que la cintura caiga.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'co-2',
    nombre: 'Bicho Muerto (Dead Bug) de Pie',
    descripcion: 'Coordinación y control del core sin necesidad de tirarse al piso.',
    zona: ZonaCuerpo.CORE,
    duracionSegundos: 45,
    repeticiones: '12 por lado',
    instrucciones: [
      'Parate con los brazos apuntando hacia el frente.',
      'Elevá la rodilla derecha hacia el pecho mientras llevás el brazo izquierdo hacia arriba.',
      'Alterná de lado manteniendo el abdomen bien firme.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'co-3',
    nombre: 'Giros Rusos de Pie',
    descripcion: 'Trabaja oblicuos y movilidad de cintura.',
    zona: ZonaCuerpo.CORE,
    duracionSegundos: 40,
    repeticiones: '20 giros alternos',
    instrucciones: [
      'Pies firmes en el suelo, rodillas ligeramente flexionadas.',
      'Juntá las manos al frente y girá el torso controladamente de izquierda a derecha.',
      'Focalizá la fuerza en los costados del abdomen.',
    ],
    dificultad: 'PRINCIPIANTE',
  },

  // Movilidad y Postura
  {
    id: 'mo-1',
    nombre: 'Apertura de Pecho y Estiramiento Torácico',
    descripcion: 'Revierte la postura encorvada del teclado y alivia hombros.',
    zona: ZonaCuerpo.MOVILIDAD_POSTURA,
    duracionSegundos: 40,
    repeticiones: '8 respiraciones profundas',
    instrucciones: [
      'Entrelazá las manos por detrás de la espalda baja.',
      'Extendé los brazos hacia atrás y abrí el pecho elevando la mirada sutilmente.',
      'Respirá profundamente sintiendo cómo se expande la caja torácica.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'mo-2',
    nombre: 'Estiramiento de Flexores de Cadera (Psoas)',
    descripcion: 'Imprescindible para liberar la tensión provocada por estar sentado.',
    zona: ZonaCuerpo.MOVILIDAD_POSTURA,
    duracionSegundos: 45,
    repeticiones: '25 seg por pierna',
    instrucciones: [
      'Da un paso amplio hacia adelante en posición de estocada suave.',
      'Empujá la pelvis hacia adelante hasta sentir el estiramiento en la parte frontal de la cadera trasera.',
      'Mantené el torso recto y cambiá de pierna.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'mo-3',
    nombre: 'Descompresión Cervical y Trapecios',
    descripcion: 'Alivia dolor de cabeza por tensión y rigidez de nuca.',
    zona: ZonaCuerpo.MOVILIDAD_POSTURA,
    duracionSegundos: 40,
    repeticiones: '20 seg por lado',
    instrucciones: [
      'Dejá caer suavemente la oreja derecha hacia el hombro derecho.',
      'Con la mano derecha realizá una presión milimétrica y suave sobre la cabeza.',
      'El hombro izquierdo se relaja hacia abajo. Repetí del otro lado.',
    ],
    dificultad: 'PRINCIPIANTE',
  },

  // Todo el Cuerpo
  {
    id: 'tc-1',
    nombre: 'Jumping Jacks de Bajo Impacto',
    descripcion: 'Eleva el ritmo cardíaco y activa extremidades sin impacto en rodillas.',
    zona: ZonaCuerpo.TODO_EL_CUERPO,
    duracionSegundos: 45,
    repeticiones: 'Continuo durante 40 segundos',
    instrucciones: [
      'Empezá con pies juntos y brazos a los costados.',
      'Abrí el pie derecho hacia el lateral mientras subís ambos brazos en arco.',
      'Volvé al centro y abrí hacia el lado izquierdo a buen ritmo.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'tc-2',
    nombre: 'Sentadilla con Elevación de Brazos',
    descripcion: 'Combina activación de piernas, espalda alta y respiración.',
    zona: ZonaCuerpo.TODO_EL_CUERPO,
    duracionSegundos: 45,
    repeticiones: '12 repeticiones',
    instrucciones: [
      'Al descender en sentadilla, extendé los brazos paralelos hacia el frente.',
      'Al subir a posición de pie, elevá los brazos sobre la cabeza y estirate hacia arriba.',
      'Coordiná con una respiración profunda y fluida.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
  {
    id: 'tc-3',
    nombre: 'Escaladores Lentos de Pie',
    descripcion: 'Trabajo dinámico de coordinación, core y piernas.',
    zona: ZonaCuerpo.TODO_EL_CUERPO,
    duracionSegundos: 45,
    repeticiones: '20 repeticiones alternadas',
    instrucciones: [
      'Elevá una rodilla hacia el codo opuesto con control abdominal.',
      'Alterná continuamente como si subieras una escalera empinada.',
      'Mantené la columna elongada sin jorobarte.',
    ],
    dificultad: 'PRINCIPIANTE',
  },
]

export class GestorEjercicios {
  private catalogo: Ejercicio[]

  constructor(catalogoInicial: Ejercicio[] = CATALOGO_EJERCICIOS) {
    this.catalogo = catalogoInicial
  }

  obtenerPorZona(zona: ZonaCuerpo): Ejercicio[] {
    if (zona === ZonaCuerpo.TODO_EL_CUERPO) {
      // Para todo el cuerpo, unimos los ejercicios dedicados de cuerpo completo
      // más una selección equilibrada de las otras zonas
      const deCuerpoCompleto = this.catalogo.filter(e => e.zona === ZonaCuerpo.TODO_EL_CUERPO)
      const deOtrasZonas = this.catalogo.filter(e => e.zona !== ZonaCuerpo.TODO_EL_CUERPO)
      return [...deCuerpoCompleto, ...deOtrasZonas]
    }

    return this.catalogo.filter(e => e.zona === zona)
  }

  obtenerSiguiente(ejercicios: Ejercicio[], indiceActual: number): Ejercicio {
    if (ejercicios.length === 0) {
      throw new Error('La lista de ejercicios no puede estar vacía')
    }
    const indiceNormalizado = Math.abs(indiceActual) % ejercicios.length
    return ejercicios[indiceNormalizado]
  }

  reordenarPersonalizado(ejercicios: Ejercicio[], ordenIds: string[]): Ejercicio[] {
    const mapa = new Map(ejercicios.map(e => [e.id, e]))
    const reordenados: Ejercicio[] = []

    for (const id of ordenIds) {
      const e = mapa.get(id)
      if (e) {
        reordenados.push(e)
      }
    }

    // Agregar los restantes si alguno no estaba en la lista de IDs
    for (const e of ejercicios) {
      if (!ordenIds.includes(e.id)) {
        reordenados.push(e)
      }
    }

    return reordenados
  }
}
