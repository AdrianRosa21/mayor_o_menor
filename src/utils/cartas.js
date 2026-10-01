// Funciones puras para trabajar con cartas (no usan React ni la red).
// Una carta tiene esta forma: { codigo, valor, palo, imagen }
// Ejemplo: { codigo: 'KH', valor: 'KING', palo: 'HEARTS', imagen: '...' }

// Valor numérico de cada carta según las reglas del juego
const VALORES_NUMERICOS = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14,
};

const CARTAS_POR_VALOR = 4; // un mazo tiene 4 palos
const PORCENTAJE_TOTAL = 100;

const NOMBRES_VALORES = {
  JACK: 'Jota',
  QUEEN: 'Reina',
  KING: 'Rey',
  ACE: 'As',
};

const ETIQUETAS_VALORES = { JACK: 'J', QUEEN: 'Q', KING: 'K', ACE: 'A' };

const NOMBRES_PALOS = {
  HEARTS: 'corazones',
  DIAMONDS: 'diamantes',
  CLUBS: 'tréboles',
  SPADES: 'picas',
};

const SIMBOLOS_PALOS = {
  HEARTS: '♥',
  DIAMONDS: '♦',
  CLUBS: '♣',
  SPADES: '♠',
};

/** Convierte el valor de la API ("7", "KING", "ACE"...) en un número del 2 al 14. */
export function obtenerValorNumerico(valor) {
  const valorNumerico = VALORES_NUMERICOS[valor];
  if (valorNumerico === undefined) {
    throw new Error(`Valor de carta desconocido: ${valor}`);
  }
  return valorNumerico;
}

/** Dice cómo es la carta nueva respecto a la actual: 'mayor', 'menor' o 'igual'. */
export function compararCartas(cartaActual, cartaNueva) {
  const valorActual = obtenerValorNumerico(cartaActual.valor);
  const valorNuevo = obtenerValorNumerico(cartaNueva.valor);

  if (valorNuevo > valorActual) return 'mayor';
  if (valorNuevo < valorActual) return 'menor';
  return 'igual';
}

/**
 * Evalúa la jugada según lo que eligió el jugador ('mayor' o 'menor').
 * Devuelve 'acierto', 'fallo' o 'empate'.
 */
export function evaluarJugada(eleccion, cartaActual, cartaNueva) {
  const resultado = compararCartas(cartaActual, cartaNueva);

  if (resultado === 'igual') return 'empate';
  return resultado === eleccion ? 'acierto' : 'fallo';
}

/**
 * Calcula la probabilidad de que la siguiente carta sea mayor, menor o igual.
 * Un mazo completo tiene 4 cartas de cada valor; restamos las que ya salieron
 * (cartasSacadas) y contamos cuántas de las que quedan caen en cada caso.
 */
export function calcularProbabilidades(cartaActual, cartasSacadas) {
  const valorActual = obtenerValorNumerico(cartaActual.valor);

  // Cuántas cartas de cada valor siguen en el mazo
  const quedanPorValor = {};
  for (const valor of Object.values(VALORES_NUMERICOS)) {
    quedanPorValor[valor] = CARTAS_POR_VALOR;
  }
  for (const carta of cartasSacadas) {
    quedanPorValor[obtenerValorNumerico(carta.valor)] -= 1;
  }

  let mayor = 0;
  let menor = 0;
  let igual = 0;
  for (const [valor, cantidad] of Object.entries(quedanPorValor)) {
    if (Number(valor) > valorActual) mayor += cantidad;
    else if (Number(valor) < valorActual) menor += cantidad;
    else igual += cantidad;
  }

  const total = mayor + menor + igual;
  const aPorcentaje = (cartas) =>
    total === 0 ? 0 : Math.round((cartas / total) * PORCENTAJE_TOTAL);

  return {
    total,
    mayor: { cartas: mayor, porcentaje: aPorcentaje(mayor) },
    menor: { cartas: menor, porcentaje: aPorcentaje(menor) },
    igual: { cartas: igual, porcentaje: aPorcentaje(igual) },
  };
}

/** Nombre legible en español: "Rey de picas", "7 de corazones". */
export function nombreCarta(carta) {
  const valor = NOMBRES_VALORES[carta.valor] ?? carta.valor;
  const palo = NOMBRES_PALOS[carta.palo] ?? carta.palo;
  return `${valor} de ${palo}`;
}

/** Símbolo del palo: ♥ ♦ ♣ ♠ */
export function simboloPalo(palo) {
  return SIMBOLOS_PALOS[palo] ?? '?';
}

/** Texto corto para la esquina de la carta: "A", "K", "10"... */
export function etiquetaValor(valor) {
  return ETIQUETAS_VALORES[valor] ?? valor;
}

/** Los corazones y diamantes son rojos; tréboles y picas, negros. */
export function esPaloRojo(palo) {
  return palo === 'HEARTS' || palo === 'DIAMONDS';
}
