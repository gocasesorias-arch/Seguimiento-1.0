import { useState, useEffect } from 'react';
import { monthMap } from '../utils/constants';

export const useCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vpsDisponibles, setVpsDisponibles] = useState(['Todos']);
  const [gerenciasDisponibles, setGerenciasDisponibles] = useState(['Todas']);
  const [nombresDisponibles, setNombresDisponibles] = useState([]);
  const [añosDisponibles, setAñosDisponibles] = useState(['Todos']);
  const [responsablesDisponibles, setResponsablesDisponibles] = useState(['Todos']);
  const [mesesDisponibles, setMesesDisponibles] = useState(['Todos']);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const response = await fetch('/cursos.json');
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();

        // Eliminar el primer elemento (headers)
        const cursosData = data.slice(1);
        setCursos(cursosData);

        // Extraer valores únicos para filtros
        const vpsUnicas = ['Todos', ...new Set(cursosData.map(c => c.Column9).filter(Boolean))].sort();
        const gerenciasUnicas = ['Todas', ...new Set(cursosData.map(c => c.Column10).filter(Boolean))].sort();
        const nombresUnicos = [...new Set(cursosData.map(c => c.Column13).filter(Boolean))].sort();
        const añosUnicos = ['Todos', ...new Set(cursosData.map(c => String(c.Column2)).filter(Boolean))].sort();
        const responsablesUnicos = ['Todos', ...new Set(cursosData.map(c => c.Column7).filter(Boolean))].sort();

        const mesesUnicos = ['Todos', ...new Set(cursosData.map(c => {
          const mesNumero = c['0'];
          return monthMap[mesNumero];
        }).filter(Boolean))];

        setVpsDisponibles(vpsUnicas);
        setGerenciasDisponibles(gerenciasUnicas);
        setNombresDisponibles(nombresUnicos);
        setAñosDisponibles(añosUnicos);
        setResponsablesDisponibles(responsablesUnicos);
        setMesesDisponibles(mesesUnicos);

        setLoading(false);
      } catch (err) {
        console.error('Error cargando cursos:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    cargarCursos();
  }, []);

  return {
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
  };
};
