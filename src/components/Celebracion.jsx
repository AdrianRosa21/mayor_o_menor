import './Celebracion.css';

const COLORES = ['#e6c46f', '#f7f1e1', '#ff8a8a', '#6be09b', '#7cc0ff'];
const CANTIDAD_CONFETI = 44;

// Confeti: cada pieza recibe su posición, color y retraso mediante variables CSS.
// Se calcula con operaciones simples (sin números al azar) para que sea predecible.
const confeti = Array.from({ length: CANTIDAD_CONFETI }, (_, i) => ({
  id: i,
  izquierda: (i * 37 + 11) % 100, // % desde la izquierda
  retraso: (i % 9) * 0.09, // segundos
  duracion: 1.8 + (i % 5) * 0.25, // segundos
  giro: 360 + (i % 4) * 180, // grados
  color: COLORES[i % COLORES.length],
}));

// Celebración visual al superar el récord. Está hecha solo con CSS (animaciones).
// Es decorativa: el mensaje con el récord se anuncia aparte, en <Mensaje />.
function Celebracion() {
  return (
    <div className="celebracion" aria-hidden="true">
      <p className="celebracion__letrero">¡Nuevo récord!</p>
      {confeti.map((pieza) => (
        <span
          key={pieza.id}
          className="celebracion__pieza"
          style={{
            '--izquierda': `${pieza.izquierda}%`,
            '--retraso': `${pieza.retraso}s`,
            '--duracion': `${pieza.duracion}s`,
            '--giro': `${pieza.giro}deg`,
            '--color': pieza.color,
          }}
        />
      ))}
    </div>
  );
}

export default Celebracion;
