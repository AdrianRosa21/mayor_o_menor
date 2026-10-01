import './Cargando.css';

// Pantalla de carga mientras se crea el mazo.
function Cargando({ texto = 'Barajando el mazo…' }) {
  return (
    <div className="cargando" role="status" aria-live="polite">
      <div className="cargando__palos" aria-hidden="true">
        <span>♠</span>
        <span className="cargando__palo--rojo">♥</span>
        <span>♣</span>
        <span className="cargando__palo--rojo">♦</span>
      </div>
      <p className="cargando__texto">{texto}</p>
    </div>
  );
}

export default Cargando;
