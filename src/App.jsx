import { useState, useEffect } from 'react'

function App() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/cursos.json')
      .then(r => r.json())
      .then(data => {
        setCursos(data.slice(1)) // Remove header row
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{padding: '20px'}}>Cargando...</div>

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
