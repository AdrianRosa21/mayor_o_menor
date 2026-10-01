import { useState } from 'react';
import { esPaloRojo, etiquetaValor, nombreCarta, simboloPalo } from '../utils/cartas';
import './Carta.css';

// Dibuja una carta. Con animada=true aparece boca abajo y se voltea en 3D
// cuando termina de cargar la imagen. tamano: 'normal' o 'mini'.
function Carta({ carta, animada = false, tamano = 'normal' }) {
  // 'cargando' | 'lista' | 'error' (si la imagen falla, se dibuja la carta con texto)
  const [estadoImagen, setEstadoImagen] = useState('cargando');

  const nombre = nombreCarta(carta);
  const etiqueta = etiquetaValor(carta.valor);
  const simbolo = simboloPalo(carta.palo);

  const clases = ['carta', `carta--${tamano}`];
  if (animada) clases.push('carta--animada');
  if (estadoImagen !== 'cargando') clases.push('carta--descubierta');

  return (
    <div className={clases.join(' ')}>
      <div className="carta__giro">
        <div className="carta__cara carta__cara--dorso dorso" aria-hidden="true" />

        <div className="carta__cara carta__cara--frente">
          {estadoImagen === 'error' ? (
            <div
              className={esPaloRojo(carta.palo) ? 'carta__dibujo carta__dibujo--roja' : 'carta__dibujo'}
              role="img"
              aria-label={nombre}
            >
              <span className="carta__esquina">
                {etiqueta}
                <br />
                {simbolo}
              </span>
              <span className="carta__centro">{simbolo}</span>
            </div>
          ) : (
            <img
              className="carta__imagen"
              src={carta.imagen}
              alt={nombre}
              draggable="false"
              onLoad={() => setEstadoImagen('lista')}
              onError={() => setEstadoImagen('error')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Carta;
