import './PantallaFinal.css';

// Pantalla de "Game over" (ventana modal) con el resumen de la partida.
function PantallaFinal({ puntos, mejorRacha, record, superoRecord, alReiniciar }) {
  return (
    <div className="final">
      <div
        className="final__ventana"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-final"
        aria-describedby="descripcion-final"
      >
        <h2 id="titulo-final" className="final__titulo">
          Game over
        </h2>
        <p id="descripcion-final" className="final__descripcion">
          Te quedaste sin vidas. Este fue tu resultado:
        </p>

        <dl className="final__datos">
          <div className="final__dato">
            <dt>Puntaje final</dt>
            <dd>{puntos}</dd>
          </div>
          <div className="final__dato">
            <dt>Mejor racha</dt>
            <dd>{mejorRacha}</dd>
          </div>
          <div className="final__dato">
            <dt>Récord</dt>
            <dd>{record}</dd>
          </div>
        </dl>

        {superoRecord && (
          <p className="final__record">★ ¡Superaste tu récord en esta partida! ★</p>
        )}

        {/* autoFocus: el foco cae en el botón, así Enter o la barra espaciadora funcionan */}
        <button type="button" className="final__boton" onClick={alReiniciar} autoFocus>
          Jugar de nuevo <kbd aria-hidden="true">Enter</kbd>
        </button>
      </div>
    </div>
  );
}

export default PantallaFinal;
