import './Mensaje.css';

const ICONOS = {
  info: '?',
  acierto: '✓',
  fallo: '✗',
  empate: '=',
  record: '★',
};

// Mensaje de resultado. tipo: 'info' | 'acierto' | 'fallo' | 'empate' | 'record'
function Mensaje({ mensaje }) {
  return (
    // role="status": los lectores de pantalla leen el mensaje cuando cambia
    <div className="mensaje-zona" role="status" aria-live="polite">
      {/* key = texto: al cambiar el mensaje se repite la animación de entrada */}
      <p key={mensaje.texto} className={`mensaje mensaje--${mensaje.tipo}`}>
        <span className="mensaje__icono" aria-hidden="true">
          {ICONOS[mensaje.tipo]}
        </span>
        {mensaje.texto}
      </p>
    </div>
  );
}

export default Mensaje;
