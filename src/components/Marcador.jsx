import './Marcador.css';

// Muestra puntos, vidas, racha y récord. Solo recibe datos por props.
function Marcador({ puntos, vidas, vidasIniciales, racha, record, recordSuperado }) {
  // Un corazón por cada vida inicial; los perdidos se ven apagados
  const corazones = Array.from({ length: vidasIniciales }, (_, indice) => indice < vidas);

  return (
    <dl className="marcador panel">
      <div className="marcador__dato">
        <dt>Puntos</dt>
        {/* key = valor: al cambiar, React recrea el elemento y se repite la animación */}
        <dd key={puntos} className="marcador__valor marcador__valor--cambio">
          {puntos}
        </dd>
      </div>

      <div className="marcador__dato">
        <dt>Vidas</dt>
        <dd className="marcador__valor">
          <span role="img" aria-label={`${vidas} de ${vidasIniciales} vidas`}>
            {corazones.map((activo, indice) => (
              <span
                key={indice}
                aria-hidden="true"
                className={activo ? 'marcador__corazon' : 'marcador__corazon marcador__corazon--perdido'}
              >
                ♥
              </span>
            ))}
          </span>
        </dd>
      </div>

      <div className="marcador__dato">
        <dt>Racha</dt>
        <dd key={racha} className="marcador__valor marcador__valor--cambio">
          {racha}
        </dd>
      </div>

      <div className={recordSuperado ? 'marcador__dato marcador__dato--record' : 'marcador__dato'}>
        <dt>Récord</dt>
        <dd key={record} className="marcador__valor marcador__valor--cambio">
          {record}
        </dd>
      </div>
    </dl>
  );
}

export default Marcador;
