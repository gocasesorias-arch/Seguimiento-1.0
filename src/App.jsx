import { useState, useEffect } from 'react'

function App() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    vp: 'Todos',
    gerencia: 'Todas',
    estado: 'Todos'
  })
  const [vpsDisponibles, setVpsDisponibles] = useState(['Todos'])
  const [gerenciasDisponibles, setGerenciasDisponibles] = useState(['Todas'])

  useEffect(() => {
    fetch('/Seguimiento-1.0/cursos.json')
      .then(r => r.json())
      .then(data => {
        const cursosData = data.slice(1)
        setCursos(cursosData)

        // Extraer VPs y Gerencias únicas
        const vps = ['Todos', ...new Set(cursosData.map(c => c.Column9).filter(Boolean))].sort()
        const gerencias = ['Todas', ...new Set(cursosData.map(c => c.Column10).filter(Boolean))].sort()

        setVpsDisponibles(vps)
        setGerenciasDisponibles(gerencias)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  const cursosFiltrados = cursos.filter(curso => {
    const cumpleVP = filtros.vp === 'Todos' || curso.Column9 === filtros.vp
    const cumpleGerencia = filtros.gerencia === 'Todas' || curso.Column10 === filtros.gerencia
    const cumpleEstado = filtros.estado === 'Todos' || curso.Column4 === filtros.estado
    return cumpleVP && cumpleGerencia && cumpleEstado
  })

  const estadisticas = {
    total: cursosFiltrados.length,
    realizados: cursosFiltrados.filter(c => c.Column4 === 'Realizado').length,
    enEjecucion: cursosFiltrados.filter(c => c.Column4 === 'En Ejecución').length,
    planificacion: cursosFiltrados.filter(c => c.Column4 === 'Planificación').length
  }

  const getEstadoColor = (estado) => {
    const colores = {
      'Realizado': 'bg-green-100 text-green-800 border-green-300',
      'En Ejecución': 'bg-blue-100 text-blue-800 border-blue-300',
      'En Proceso': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Planificación': 'bg-gray-100 text-gray-800 border-gray-300',
      'Suspendido': 'bg-red-100 text-red-800 border-red-300',
      'Postergado': 'bg-purple-100 text-purple-800 border-purple-300'
    }
    return colores[estado] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>Sistema de Seguimiento de Capacitaciones</h1>
      <p>Total de cursos: {cursos.length}</p>
      <div style={{maxHeight: '400px', overflow: 'auto', border: '1px solid #ccc', padding: '10px'}}>
        {cursos.slice(0, 10).map((curso) => (
          <div key={curso.Column1 || curso.Column13} style={{padding: '10px', borderBottom: '1px solid #eee'}}>
            <strong>{curso.Column13 || 'Sin nombre'}</strong>
            <br/>
            <small>{curso.Column10} - {curso.Column4}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
