import './Header.css';

// Encabezado con el título y un recordatorio del orden de las cartas
function Header() {
  return (
    <header className="encabezado">
      <h1 className="encabezado__titulo">
        <span className="encabezado__adorno" aria-hidden="true">♠</span>
        Mayor o Menor
        <span className="encabezado__adorno encabezado__adorno--rojo" aria-hidden="true">♥</span>
      </h1>
      <p className="encabezado__subtitulo">
        Adivina si la siguiente carta será mayor o menor. Orden: As (14), Rey (13), Reina (12) y
        Jota (11).
      </p>
    </header>
  );
}

export default Header;
