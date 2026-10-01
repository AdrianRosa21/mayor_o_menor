import './Header.css';

// Encabezado con el título y un recordatorio del orden de las cartas
function Header() {
  return (
    <header className="encabezado">
      <p className="encabezado__palos" aria-hidden="true">
        <span>♠</span>
        <span className="encabezado__palo--rojo">♥</span>
        <span>♣</span>
        <span className="encabezado__palo--rojo">♦</span>
      </p>
      <h1 className="encabezado__titulo">Mayor o Menor</h1>
      <p className="encabezado__subtitulo">
        Adivina si la siguiente carta será mayor o menor. El As es la más alta (14), seguido del
        Rey (13), la Reina (12) y la Jota (11).
      </p>
    </header>
  );
}

export default Header;
