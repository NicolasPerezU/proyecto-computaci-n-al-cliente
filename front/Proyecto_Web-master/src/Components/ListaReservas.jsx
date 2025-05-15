function ListaReservas({ reservas, cancelarReserva }) {
  if (reservas.length === 0) {
    return <p>No hay reservas registradas.</p>;
  }

  return (
    <ul className="space-y-2">
      {reservas.map((reserva) => (
        <li key={reserva._id} className="p-4 bg-gray-800 rounded shadow">
          {reserva.userId && (
            <p><strong>Usuario:</strong> {reserva.userId.nombres} {reserva.userId.apellidos}</p>
          )}
          <p><strong>Fecha:</strong> {new Date(reserva.fechaReserva).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {reserva.horaReserva}</p>
          <p><strong>Personas:</strong> {reserva.numeroPersonas}</p>
          <button
            onClick={() => cancelarReserva(reserva._id)}
            className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Cancelar
          </button>
        </li>
      ))}
    </ul>
  );
}


export default ListaReservas;
