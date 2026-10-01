import Carta from './Carta.jsx';
import './Mesa.css';

// La mesa de fieltro: el mazo a la izquierda, la carta actual en el centro y la
// carta anterior a la derecha. claveCarta cambia con cada carta nueva para que
// se repita la animación de volteo.
function Mesa({ carta, cartaAnterior, restantes, claveCarta, esperando }) {
  const textoRestantes =
    restantes <= 0
      ? 'Mazo vacío: se barajará uno nuevo'
      : `${restantes} ${restantes === 1 ? 'carta' : 'cartas'} en el mazo`;

  return (
    <section className="mesa" aria-label="Mesa de juego">
      <div className="mesa__mazo">
        <div className={esperando ? 'mesa__pila mesa__pila--esperando' : 'mesa__pila'} aria-hidden="true">
          <span className="dorso" />
          <span className="dorso" />
          <span className="dorso" />
        </div>
        <p className="mesa__restantes">{textoRestantes}</p>
      </div>

      <div className="mesa__carta">
        <Carta key={claveCarta} carta={carta} animada />
        <p className="mesa__etiqueta">Carta actual</p>
      </div>

      <div className="mesa__anterior">
        {cartaAnterior ? (
          <Carta key={`${claveCarta}-anterior`} carta={cartaAnterior} tamano="media" />
        ) : (
          <div className="mesa__hueco" aria-hidden="true" />
        )}
        <p className="mesa__etiqueta">Carta anterior</p>
      </div>
    </section>
  );
}

export default Mesa;
