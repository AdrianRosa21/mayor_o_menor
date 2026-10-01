import Header from './components/Header.jsx';
import Marcador from './components/Marcador.jsx';
import Mesa from './components/Mesa.jsx';
import Mensaje from './components/Mensaje.jsx';
import Botones from './components/Botones.jsx';
import Probabilidad from './components/Probabilidad.jsx';
import Historial from './components/Historial.jsx';
import PantallaFinal from './components/PantallaFinal.jsx';
import Cargando from './components/Cargando.jsx';
import ErrorApi from './components/ErrorApi.jsx';
import Celebracion from './components/Celebracion.jsx';
import { useJuego } from './hooks/useJuego';
import './App.css';

// App solo arma la pantalla: el estado y la lógica están en useJuego.
function App() {
  const juego = useJuego();

  // Pantallas especiales: cargando el mazo o error al crearlo
  let contenido;
  if (juego.cargandoMazo) {
    contenido = <Cargando />;
  } else if (!juego.cartaActual) {
    contenido = <ErrorApi alReintentar={juego.reintentar} />;
  } else {
    contenido = (
      <div className="juego">
        <div className="juego__principal">
          <Marcador
            puntos={juego.puntos}
            vidas={juego.vidas}
            vidasIniciales={juego.vidasIniciales}
            racha={juego.racha}
            record={juego.record}
            recordSuperado={juego.numeroCelebracion > 0}
          />
          <Mesa
            carta={juego.cartaActual}
            restantes={juego.restantes}
            claveCarta={`${juego.totalJugadas}-${juego.cartaActual.codigo}`}
            esperando={juego.cargandoCarta}
          />
          <Mensaje mensaje={juego.mensaje} />
          {juego.error ? (
            <ErrorApi alReintentar={juego.reintentar} />
          ) : (
            <Botones
              deshabilitado={!juego.puedeJugar}
              cargando={juego.cargandoCarta}
              alElegir={juego.jugar}
            />
          )}
        </div>

        <aside className="juego__lateral" aria-label="Ayudas de la partida">
          <Probabilidad
            probabilidades={juego.probabilidades}
            visible={juego.mostrarProbabilidad}
            alAlternar={juego.alternarProbabilidad}
          />
          <Historial jugadas={juego.historial} />
        </aside>
      </div>
    );
  }

  return (
    <>
      <div className="aplicacion">
        <Header />
        <main className="contenido">{contenido}</main>
      </div>

      {juego.juegoTerminado && (
        <PantallaFinal
          puntos={juego.puntos}
          mejorRacha={juego.mejorRacha}
          record={juego.record}
          superoRecord={juego.numeroCelebracion > 0}
          alReiniciar={juego.reiniciarPartida}
        />
      )}

      {juego.numeroCelebracion > 0 && <Celebracion key={juego.numeroCelebracion} />}
    </>
  );
}

export default App;
