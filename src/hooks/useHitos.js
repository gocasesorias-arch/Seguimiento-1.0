import { useState, useEffect } from 'react';
import { obtenerSiguienteEstado } from '../utils/helpers';

export const useHitos = (cursos) => {
  const [progresoHitos, setProgresoHitos] = useState({});

  // Cargar progreso desde localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('progresoHitos');
    if (savedProgress) {
      try {
        setProgresoHitos(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error al cargar progreso de hitos:', e);
      }
    } else {
      // Inicializar progreso para todos los cursos
      const initialProgress = {};
      cursos.forEach((curso, index) => {
        initialProgress[index] = {
          hitos: [false, false, false, false],
          estadoActual: curso.Column4
        };
      });
      setProgresoHitos(initialProgress);
    }
  }, [cursos]);

  // Guardar progreso en localStorage cuando cambie
  useEffect(() => {
    if (Object.keys(progresoHitos).length > 0) {
      localStorage.setItem('progresoHitos', JSON.stringify(progresoHitos));
    }
  }, [progresoHitos]);

  const toggleHito = (cursoIndex, hitoIndex) => {
    setProgresoHitos(prev => {
      const cursoProgreso = prev[cursoIndex] || {
        hitos: [false, false, false, false],
        estadoActual: cursos[cursoIndex]?.Column4
      };

      const nuevosHitos = [...cursoProgreso.hitos];
      nuevosHitos[hitoIndex] = !nuevosHitos[hitoIndex];

      const todosCompletados = nuevosHitos.every(h => h);
      let nuevoEstado = cursoProgreso.estadoActual;

      if (todosCompletados) {
        const siguienteEstado = obtenerSiguienteEstado(cursoProgreso.estadoActual);
        if (siguienteEstado !== cursoProgreso.estadoActual) {
          nuevoEstado = siguienteEstado;
          nuevosHitos.fill(false);
        }
      }

      return {
        ...prev,
        [cursoIndex]: {
          hitos: nuevosHitos,
          estadoActual: nuevoEstado
        }
      };
    });
  };

  const cambiarEstadoEspecial = (cursoIndex, nuevoEstado) => {
    setProgresoHitos(prev => ({
      ...prev,
      [cursoIndex]: {
        hitos: [false, false, false, false],
        estadoActual: nuevoEstado
      }
    }));
  };

  return {
    progresoHitos,
    toggleHito,
    cambiarEstadoEspecial
  };
};
