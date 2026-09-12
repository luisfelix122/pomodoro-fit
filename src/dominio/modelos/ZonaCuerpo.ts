export enum ZonaCuerpo {
  TREN_SUPERIOR = 'TREN_SUPERIOR',
  TREN_INFERIOR = 'TREN_INFERIOR',
  CORE = 'CORE',
  MOVILIDAD_POSTURA = 'MOVILIDAD_POSTURA',
  TODO_EL_CUERPO = 'TODO_EL_CUERPO',
}

export const ETIQUETAS_ZONA_CUERPO: Record<ZonaCuerpo, string> = {
  [ZonaCuerpo.TREN_SUPERIOR]: 'Tren Superior (Brazos, Pecho y Espalda)',
  [ZonaCuerpo.TREN_INFERIOR]: 'Tren Inferior (Piernas y Glúteos)',
  [ZonaCuerpo.CORE]: 'Core (Abdomen y Lumbar)',
  [ZonaCuerpo.MOVILIDAD_POSTURA]: 'Movilidad y Postura (Oficina)',
  [ZonaCuerpo.TODO_EL_CUERPO]: 'Todo el Cuerpo (Funcional Completo)',
}
