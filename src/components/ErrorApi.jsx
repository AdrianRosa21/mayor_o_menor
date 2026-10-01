import './ErrorApi.css';

// Aviso cuando la API falla, con el botón para volver a intentarlo.
function ErrorApi({ alReintentar }) {
  return (
    <div className="error-api panel" role="alert">
      <p className="error-api__texto">No se pudo conectar con la API. Revisa tu internet.</p>
      <button type="button" className="error-api__boton" onClick={alReintentar}>
        Reintentar
      </button>
    </div>
  );
}

export default ErrorApi;
