// Todas las llamadas a la API pública Deck of Cards viven en este archivo.
// Los componentes y el hook nunca usan fetch directamente.

const URL_BASE = 'https://deckofcardsapi.com/api/deck';
const URL_IMAGENES = 'https://deckofcardsapi.com/static/img';
const TIEMPO_MAXIMO_MS = 10000; // si la API tarda más, se considera un fallo

/** Hace la petición y valida la respuesta. Lanza un error si algo sale mal. */
async function pedirJson(url) {
  const respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS) });

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}`);
  }

  const datos = await respuesta.json();
  // La API puede responder 200 con success:false (por ejemplo, si no quedan cartas)
  if (!datos.success) {
    throw new Error(datos.error ?? 'La API no pudo completar la petición');
  }
  return datos;
}

/** Traduce la carta de la API a la forma que usa nuestra app. */
function normalizarCarta(cartaApi) {
  return {
    codigo: cartaApi.code,
    valor: cartaApi.value,
    palo: cartaApi.suit,
    imagen: cartaApi.image ?? `${URL_IMAGENES}/${cartaApi.code}.png`,
  };
}

/** Crea un mazo nuevo y barajado. Devuelve { idMazo, restantes }. */
export async function crearMazo() {
  const datos = await pedirJson(`${URL_BASE}/new/shuffle/?deck_count=1`);
  return { idMazo: datos.deck_id, restantes: datos.remaining };
}

/** Saca una carta del mazo. Devuelve { carta, restantes }. */
export async function sacarCarta(idMazo) {
  const datos = await pedirJson(`${URL_BASE}/${idMazo}/draw/?count=1`);

  if (!Array.isArray(datos.cards) || datos.cards.length === 0) {
    throw new Error('La API no devolvió ninguna carta');
  }
  return { carta: normalizarCarta(datos.cards[0]), restantes: datos.remaining };
}
