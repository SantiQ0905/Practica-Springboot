
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EstudianteForm } from './components/EstudianteForm';
import { EstudianteTable } from './components/EstudianteTable';
import type { Estudiante } from './components/EstudianteTable';
import { Footer } from './components/Footer';

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
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto">
        <Header title="Registro de Estudiantes" />
        <EstudianteForm
          nombre={nombre}
          grupo={grupo}
          cargando={cargando}
          error={error}
          onNombreChange={setNombre}
          onGrupoChange={setGrupo}
          onSubmit={agregarEstudiante}
        />
        <EstudianteTable estudiantes={estudiantes} />
      </div>
      <Footer />
    </div>
  );
}

export default App
