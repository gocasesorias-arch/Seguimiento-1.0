import { useState, useEffect } from 'react';
import { monthMap } from '../utils/constants';

export const useFiltros = (cursos, setGerenciasDisponibles) => {
  const [filtros, setFiltros] = useState({
    vp: 'Todos',
    gerencia: 'Todas',
    mes: 'Todos',
    año: 'Todos',
    responsable: 'Todos',
    nombres: []
  });

  // Actualizar gerencias cuando cambie VP
  useEffect(() => {
    if (cursos.length > 0) {
      let gerenciasFiltradas;
      if (filtros.vp === 'Todos') {
        gerenciasFiltradas = ['Todas', ...new Set(cursos.map(c => c.Column10).filter(Boolean))].sort();
      } else {
        gerenciasFiltradas = ['Todas', ...new Set(cursos.filter(c => c.Column9 === filtros.vp).map(c => c.Column10).filter(Boolean))].sort();
      }

      setGerenciasDisponibles(gerenciasFiltradas);

      if (filtros.gerencia !== 'Todas' && !gerenciasFiltradas.includes(filtros.gerencia)) {
        actualizarFiltro('gerencia', 'Todas');
      }
    }
  }, [filtros.vp, cursos]);

  const aplicarFiltros = (curso) => {
    const cumpleVP = filtros.vp === 'Todos' || curso.Column9 === filtros.vp;
    const cumpleGerencia = filtros.gerencia === 'Todas' || curso.Column10 === filtros.gerencia;
    const cumpleMes = filtros.mes === 'Todos' || monthMap[curso['0']] === filtros.mes;
    const cumpleNombre = filtros.nombres.length === 0 || filtros.nombres.includes(curso.Column13);
    const cumpleAño = filtros.año === 'Todos' || String(curso.Column2) === filtros.año;
    const cumpleResponsable = filtros.responsable === 'Todos' || curso.Column7 === filtros.responsable;

    return cumpleVP && cumpleGerencia && cumpleMes && cumpleNombre && cumpleAño && cumpleResponsable;
  };

  const actualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      vp: 'Todos',
      gerencia: 'Todas',
      mes: 'Todos',
      año: 'Todos',
      responsable: 'Todos',
      nombres: []
    });
  };

  return {
    filtros,
    aplicarFiltros,
    actualizarFiltro,
    limpiarFiltros
  };
};
