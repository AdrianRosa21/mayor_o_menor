import './Probabilidad.css';

const FILAS = [
  { clave: 'mayor', etiqueta: 'Mayor' },
  { clave: 'menor', etiqueta: 'Menor' },
  { clave: 'igual', etiqueta: 'Igual (empate)' },
];

// Indicador de probabilidad calculado con las cartas que quedan en el mazo.
// visible: si se muestra o está oculto; alAlternar: muestra/oculta el panel.
function Probabilidad({ probabilidades, visible, alAlternar }) {
  return (
    <section className="probabilidad panel" aria-labelledby="titulo-probabilidad">
      <div className="probabilidad__cabecera">
        <h2 id="titulo-probabilidad" className="panel__titulo">
          Probabilidad
        </h2>
        <button
          type="button"
          className="probabilidad__alternar"
          onClick={alAlternar}
          aria-expanded={visible}
          aria-controls="probabilidad-contenido"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {visible && probabilidades && (
        <div id="probabilidad-contenido">
          <p className="probabilidad__total">
            La siguiente carta saldrá de las {probabilidades.total} que quedan en el mazo:
          </p>
          <ul className="probabilidad__lista">
            {FILAS.map(({ clave, etiqueta }) => {
              const dato = probabilidades[clave];
              return (
                <li key={clave} className="probabilidad__fila">
                  <div className="probabilidad__texto">
                    <span>{etiqueta}</span>
                    <span>
                      <strong>{dato.porcentaje} %</strong>
                      <span className="probabilidad__cartas"> ({dato.cartas})</span>
                    </span>
                  </div>
                  <div className="probabilidad__barra" aria-hidden="true">
                    <div
                      className={`probabilidad__relleno probabilidad__relleno--${clave}`}
                      style={{ width: `${dato.porcentaje}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

export default Probabilidad;
