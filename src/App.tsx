import { useState, useEffect } from 'react'

interface Estudiante {
  id: number
  nombre: string
  grupo: string
}

function App() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [nombre, setNombre] = useState('')
  const [grupo, setGrupo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarEstudiantes()
  }, [])

  const cargarEstudiantes = async () => {
    try {
      const respuesta = await fetch('/api/items')
      if (!respuesta.ok) throw new Error()
      const datos: Estudiante[] = await respuesta.json()
      setEstudiantes(datos)
    } catch {
      setError('No se pudo conectar con el servidor')
    }
  }

  const agregarEstudiante = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !grupo.trim()) return
    setCargando(true)
    setError('')
    try {
      const respuesta = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, grupo }),
      })
      if (!respuesta.ok) throw new Error()
      const nuevo: Estudiante = await respuesta.json()
      setEstudiantes(prev => [...prev, nuevo])
      setNombre('')
      setGrupo('')
    } catch {
      setError('No se pudo agregar el estudiante')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Registro de Estudiantes
        </h1>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Agregar Estudiante</h2>
          <form onSubmit={agregarEstudiante} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Grupo (Ej: A, B, C)"
              value={grupo}
              onChange={e => setGrupo(e.target.value)}
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

        {/* Lista de estudiantes */}
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

      </div>
    </div>
  )
}

export default App
