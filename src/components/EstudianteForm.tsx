interface EstudianteFormProps {
  nombre: string;
  grupo: string;
  cargando: boolean;
  error: string;
  onNombreChange: (v: string) => void;
  onGrupoChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EstudianteForm({ nombre, grupo, cargando, error, onNombreChange, onGrupoChange, onSubmit }: EstudianteFormProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Agregar Estudiante</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => onNombreChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Grupo (Ej: A, B, C)"
          value={grupo}
          onChange={e => onGrupoChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {cargando ? 'Agregando...' : 'Agregar Estudiante'}
        </button>
      </form>
    </div>
  );
}
