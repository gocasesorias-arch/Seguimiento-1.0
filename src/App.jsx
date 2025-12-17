import { useState } from 'react';
import PanelFiltros from './components/PanelFiltros';
import Dashboard from './components/Dashboard';
import GestionHitos from './components/GestionHitos';
import { useCursos } from './hooks/useCursos';
import { useFiltros } from './hooks/useFiltros';
import { useHitos } from './hooks/useHitos';

function App() {
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [hitoActual, setHitoActual] = useState(0);

  // Custom hooks
  const {
    cursos,
    loading,
    error,
    vpsDisponibles,
    gerenciasDisponibles,
    nombresDisponibles,
    añosDisponibles,
    responsablesDisponibles,
    mesesDisponibles,
    setGerenciasDisponibles
  } = useCursos();

  const {
    filtros,
    aplicarFiltros,
    actualizarFiltro,
    limpiarFiltros
  } = useFiltros(cursos, setGerenciasDisponibles);

  const {
    progresoHitos,
    toggleHito,
    cambiarEstadoEspecial
  } = useHitos(cursos);

  // Filtrar cursos
  const cursosFiltrados = cursos.filter(aplicarFiltros);

  // Opciones de filtros
  const opcionesFiltros = {
    vps: vpsDisponibles,
    gerencias: gerenciasDisponibles,
    nombres: nombresDisponibles,
    años: añosDisponibles,
    responsables: responsablesDisponibles,
    meses: mesesDisponibles
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Sistema de Seguimiento de Capacitaciones
          </h1>
          <p className="text-slate-600">
            Gestión y seguimiento integral de capacitaciones por VP y Gerencia
          </p>
        </div>

        {/* Panel de Filtros */}
        <PanelFiltros
          filtros={filtros}
          actualizarFiltro={actualizarFiltro}
          limpiarFiltros={limpiarFiltros}
          opcionesFiltros={opcionesFiltros}
          cursosContados={cursosFiltrados.length}
        />

        {/* Selector de Vista */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setVistaActual('dashboard')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                vistaActual === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              📊 Dashboard de Estados
            </button>
            <button
              onClick={() => setVistaActual('gestion')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                vistaActual === 'gestion'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ✅ Gestión de Hitos
            </button>
          </div>
        </div>

        {/* Vistas */}
        {vistaActual === 'dashboard' && (
          <Dashboard
            cursosFiltrados={cursosFiltrados}
            hitoActual={hitoActual}
            setHitoActual={setHitoActual}
          />
        )}

        {vistaActual === 'gestion' && (
          <GestionHitos
            cursos={cursos}
            cursosFiltrados={cursosFiltrados}
            progresoHitos={progresoHitos}
            toggleHito={toggleHito}
            cambiarEstadoEspecial={cambiarEstadoEspecial}
            limpiarFiltros={limpiarFiltros}
          />
        )}
      </div>
    </div>
  );
}

export default App;
