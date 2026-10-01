import Carta from './Carta.jsx';
import { nombreCarta } from '../utils/cartas';
import './Historial.css';

const RESULTADOS = {
  acierto: { simbolo: '✓', texto: 'acierto' },
  fallo: { simbolo: '✗', texto: 'fallo' },
  empate: { simbolo: '=', texto: 'empate' },
};

// Miniaturas de las últimas cartas jugadas (la más reciente primero),
// marcando si fue acierto, fallo o empate.
function Historial({ jugadas }) {
  return (
    <section className="historial panel" aria-labelledby="titulo-historial">
      <h2 id="titulo-historial" className="panel__titulo">
        Últimas jugadas
      </h2>

      {jugadas.length === 0 ? (
        <p className="historial__vacio">Todavía no hay jugadas. ¡Elige Mayor o Menor!</p>
      ) : (
        <ol className="historial__lista">
          {jugadas.map(({ id, carta, resultado, eleccion }) => {
            const { simbolo, texto } = RESULTADOS[resultado];
            return (
              <li
                key={id}
                className={`historial__jugada historial__jugada--${resultado}`}
                aria-label={`${nombreCarta(carta)}: ${texto}. Elegiste ${eleccion}.`}
                title={`${nombreCarta(carta)} · ${texto} · elegiste ${eleccion}`}
              >
                <Carta carta={carta} tamano="mini" />
                <span className="historial__marca" aria-hidden="true">
                  {simbolo}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export default Historial;
