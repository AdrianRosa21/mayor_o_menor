import './Botones.css';

// Botones Mayor / Menor con la tecla de atajo indicada en pantalla.
// deshabilitado: evita el doble clic; cargando: muestra que se espera a la API.
function Botones({ deshabilitado, cargando, alElegir }) {
  return (
    <div className="botones">
      <div className="botones__fila">
        <button
          type="button"
          className="boton boton--mayor"
          disabled={deshabilitado}
          onClick={() => alElegir('mayor')}
          aria-label="Mayor: la siguiente carta será mayor. Atajo: flecha arriba"
        >
          <span className="boton__flecha" aria-hidden="true">▲</span>
          <span className="boton__texto">Mayor</span>
          <kbd aria-hidden="true">↑</kbd>
        </button>

        <button
          type="button"
          className="boton boton--menor"
          disabled={deshabilitado}
          onClick={() => alElegir('menor')}
          aria-label="Menor: la siguiente carta será menor. Atajo: flecha abajo"
        >
          <span className="boton__flecha" aria-hidden="true">▼</span>
          <span className="boton__texto">Menor</span>
          <kbd aria-hidden="true">↓</kbd>
        </button>
      </div>

      <p className="botones__estado" role="status">
        {cargando ? 'Sacando carta…' : ''}
      </p>

      <p className="botones__atajos">
        Atajos de teclado: <kbd>↑</kbd> Mayor · <kbd>↓</kbd> Menor · <kbd>Enter</kbd> Jugar de nuevo
      </p>
    </div>
  );
}

export default Botones;
