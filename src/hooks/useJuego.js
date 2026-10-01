// Hook personalizado: aquí vive TODO el estado y la lógica del juego.
// Los componentes solo reciben estos datos por props y avisan con funciones.

import { useCallback, useEffect, useState } from 'react';
import { crearMazo, sacarCarta } from '../services/deckApi';
import { calcularProbabilidades, evaluarJugada, nombreCarta } from '../utils/cartas';

const VIDAS_INICIALES = 3;
const MAXIMO_HISTORIAL = 8;
const RACHA_MINIMA_CELEBRACION = 2; // con 1 acierto no tiene sentido celebrar un "récord"
const CLAVE_RECORD = 'mayorOMenor.record';

const MENSAJE_INICIAL = { tipo: 'info', texto: '¿La siguiente carta será mayor o menor?' };

/** Lee el récord guardado. Si localStorage falla o el dato no sirve, empieza en 0. */
function leerRecordGuardado() {
  try {
    const record = Number(localStorage.getItem(CLAVE_RECORD));
    return Number.isInteger(record) && record > 0 ? record : 0;
  } catch {
    return 0;
  }
}

/** Arma el mensaje que se muestra después de cada jugada. */
function crearMensaje({ resultado, carta, nuevaRacha, esRecord, sinVidas }) {
  const nombre = nombreCarta(carta);

  if (esRecord) {
    return { tipo: 'record', texto: `¡Nuevo récord! Racha de ${nuevaRacha}. Salió ${nombre}.` };
  }
  if (resultado === 'acierto') {
    return { tipo: 'acierto', texto: `¡Acertaste! Salió ${nombre}.` };
  }
  if (resultado === 'fallo') {
    const final = sinVidas ? ' Te quedaste sin vidas.' : ' Pierdes una vida.';
    return { tipo: 'fallo', texto: `Fallaste. Salió ${nombre}.${final}` };
  }
  return { tipo: 'empate', texto: `¡Empate! Salió ${nombre}, del mismo valor. No cambia nada.` };
}

export function useJuego() {
  // --- Mazo y carta en la mesa ---
  const [idMazo, setIdMazo] = useState(null);
  const [restantes, setRestantes] = useState(0);
  const [cartaActual, setCartaActual] = useState(null);
  const [cartasSacadas, setCartasSacadas] = useState([]); // las que ya salieron del mazo actual

  // --- Marcador ---
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_INICIALES);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0); // mejor racha de ESTA partida
  const [record, setRecord] = useState(leerRecordGuardado); // mejor racha histórica

  // --- Lo que se muestra en pantalla ---
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState(MENSAJE_INICIAL);
  const [mostrarProbabilidad, setMostrarProbabilidad] = useState(true);
  const [numeroCelebracion, setNumeroCelebracion] = useState(0); // 0 = sin celebración
  const [totalJugadas, setTotalJugadas] = useState(0);

  // --- Comunicación con la API ---
  const [cargandoMazo, setCargandoMazo] = useState(true);
  const [cargandoCarta, setCargandoCarta] = useState(false);
  const [error, setError] = useState(null); // null, { tipo: 'inicio' } o { tipo: 'jugada', eleccion }
  const [numeroPartida, setNumeroPartida] = useState(0); // al cambiar, se crea un mazo nuevo

  const juegoTerminado = vidas <= 0;
  const puedeJugar =
    cartaActual !== null && !cargandoMazo && !cargandoCarta && !error && !juegoTerminado;

  // Efecto 1: crear el mazo y sacar la primera carta al abrir la app
  // y cada vez que cambia numeroPartida (jugar de nuevo / reintentar).
  useEffect(() => {
    let cancelado = false; // evita usar una respuesta vieja si el efecto se vuelve a ejecutar

    async function iniciarPartida() {
      try {
        const mazo = await crearMazo();
        const primera = await sacarCarta(mazo.idMazo);
        if (cancelado) return;
        setIdMazo(mazo.idMazo);
        setCartaActual(primera.carta);
        setRestantes(primera.restantes);
        setCartasSacadas([primera.carta]);
      } catch {
        if (!cancelado) setError({ tipo: 'inicio' });
      } finally {
        if (!cancelado) setCargandoMazo(false);
      }
    }

    iniciarPartida();
    return () => {
      cancelado = true;
    };
  }, [numeroPartida]);

  // Efecto 2: guardar el récord en localStorage cada vez que cambia.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_RECORD, String(record));
    } catch {
      // Sin localStorage (modo privado, bloqueado...) el juego sigue; solo no se guarda
    }
  }, [record]);

  /** Reinicia todo menos el récord y pide un mazo nuevo (lo hace el efecto 1). */
  const reiniciarPartida = useCallback(() => {
    setCargandoMazo(true);
    setError(null);
    setIdMazo(null);
    setCartaActual(null);
    setCartasSacadas([]);
    setRestantes(0);
    setPuntos(0);
    setVidas(VIDAS_INICIALES);
    setRacha(0);
    setMejorRacha(0);
    setHistorial([]);
    setMensaje(MENSAJE_INICIAL);
    setNumeroCelebracion(0);
    setTotalJugadas(0);
    setNumeroPartida((numero) => numero + 1);
  }, []);

  /** El jugador elige 'mayor' o 'menor': se saca una carta y se actualiza el juego. */
  const jugar = useCallback(
    async (eleccion) => {
      if (!cartaActual || cargandoMazo || cargandoCarta || vidas <= 0) return;

      setCargandoCarta(true); // deshabilita los botones mientras espera la API
      setError(null);

      try {
        // Si el mazo se acabó, se crea uno nuevo sin perder el progreso
        let idDelMazo = idMazo;
        let sacadasDelMazo = cartasSacadas;
        if (restantes <= 0) {
          const mazoNuevo = await crearMazo();
          idDelMazo = mazoNuevo.idMazo;
          sacadasDelMazo = [];
        }

        const { carta, restantes: quedan } = await sacarCarta(idDelMazo);
        const resultado = evaluarJugada(eleccion, cartaActual, carta);

        // Reglas: acierto = +1 punto y +1 racha; fallo = -1 vida y racha en 0; empate = nada
        const nuevoPuntaje = resultado === 'acierto' ? puntos + 1 : puntos;
        const nuevasVidas = resultado === 'fallo' ? vidas - 1 : vidas;
        let nuevaRacha = racha;
        if (resultado === 'acierto') nuevaRacha = racha + 1;
        if (resultado === 'fallo') nuevaRacha = 0;

        const supereElRecord = nuevaRacha > record;
        const esRecord = supereElRecord && nuevaRacha >= RACHA_MINIMA_CELEBRACION;

        setPuntos(nuevoPuntaje);
        setVidas(nuevasVidas);
        setRacha(nuevaRacha);
        setMejorRacha(Math.max(mejorRacha, nuevaRacha));
        if (supereElRecord) setRecord(nuevaRacha);
        if (esRecord) setNumeroCelebracion((numero) => numero + 1);

        setIdMazo(idDelMazo);
        setRestantes(quedan);
        setCartasSacadas([...sacadasDelMazo, carta]);
        setCartaActual(carta);
        setTotalJugadas(totalJugadas + 1);
        setHistorial(
          [{ id: totalJugadas + 1, carta, resultado, eleccion }, ...historial].slice(
            0,
            MAXIMO_HISTORIAL,
          ),
        );
        setMensaje(
          crearMensaje({ resultado, carta, nuevaRacha, esRecord, sinVidas: nuevasVidas <= 0 }),
        );
      } catch {
        setError({ tipo: 'jugada', eleccion });
      } finally {
        setCargandoCarta(false);
      }
    },
    [
      cartaActual,
      cargandoMazo,
      cargandoCarta,
      vidas,
      idMazo,
      cartasSacadas,
      restantes,
      puntos,
      racha,
      mejorRacha,
      record,
      totalJugadas,
      historial,
    ],
  );

  /** Botón "Reintentar": repite lo que falló (crear el mazo o la jugada). */
  const reintentar = useCallback(() => {
    if (!error) return;
    if (error.tipo === 'inicio') reiniciarPartida();
    else jugar(error.eleccion);
  }, [error, jugar, reiniciarPartida]);

  const alternarProbabilidad = useCallback(() => {
    setMostrarProbabilidad((visible) => !visible);
  }, []);

  // Efecto 3: atajos de teclado. ↑ = Mayor, ↓ = Menor, Enter = Jugar de nuevo.
  useEffect(() => {
    function alPresionarTecla(evento) {
      if (evento.ctrlKey || evento.metaKey || evento.altKey) return;

      if (juegoTerminado) {
        if (evento.key === 'Enter') {
          evento.preventDefault(); // evita que el botón enfocado se active dos veces
          if (!evento.repeat) reiniciarPartida();
        }
        return;
      }

      const esFlecha = evento.key === 'ArrowUp' || evento.key === 'ArrowDown';
      if (!esFlecha) return;
      if (!error && !cargandoMazo) evento.preventDefault(); // la flecha no debe mover la página
      if (!puedeJugar || evento.repeat) return;

      jugar(evento.key === 'ArrowUp' ? 'mayor' : 'menor');
    }

    window.addEventListener('keydown', alPresionarTecla);
    return () => window.removeEventListener('keydown', alPresionarTecla);
  }, [juegoTerminado, puedeJugar, error, cargandoMazo, jugar, reiniciarPartida]);

  // Si el mazo se agotó, la siguiente carta saldrá de un mazo nuevo y completo,
  // así que las probabilidades se calculan sin descontar cartas.
  const probabilidades = cartaActual
    ? calcularProbabilidades(cartaActual, restantes <= 0 ? [] : cartasSacadas)
    : null;

  return {
    // Datos
    cartaActual,
    restantes,
    puntos,
    vidas,
    vidasIniciales: VIDAS_INICIALES,
    racha,
    mejorRacha,
    record,
    historial,
    mensaje,
    probabilidades,
    mostrarProbabilidad,
    numeroCelebracion,
    totalJugadas,
    cargandoMazo,
    cargandoCarta,
    error,
    juegoTerminado,
    puedeJugar,
    // Acciones
    jugar,
    reiniciarPartida,
    reintentar,
    alternarProbabilidad,
  };
}
