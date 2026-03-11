export interface Estudiante {
  id: number;
  nombre: string;
  grupo: string;
}

interface EstudianteTableProps {
  estudiantes: Estudiante[];
}

export function EstudianteTable({ estudiantes }: EstudianteTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Lista de Estudiantes ({estudiantes.length})
      </h2>
      {estudiantes.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No hay estudiantes registrados</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 text-gray-600">ID</th>
              <th className="py-2 px-3 text-gray-600">Nombre</th>
              <th className="py-2 px-3 text-gray-600">Grupo</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map(est => (
              <tr key={est.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-500">{est.id}</td>
                <td className="py-2 px-3 font-medium">{est.nombre}</td>
                <td className="py-2 px-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">
                    {est.grupo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
