import { hitosPorEstado, coloresPorEstado, ordenEstados } from './constants';

export const obtenerHitosPorEstado = (estado) => {
  return hitosPorEstado[estado] || [];
};

export const obtenerColorPorEstado = (estado) => {
  return coloresPorEstado[estado] || 'bg-gray-100 border-gray-400 text-gray-700';
};

export const obtenerSiguienteEstado = (estadoActual) => {
  const index = ordenEstados.indexOf(estadoActual);
  if (index >= 0 && index < ordenEstados.length - 1) {
    return ordenEstados[index + 1];
  }
  return estadoActual;
};

export const obtenerEstadoAnterior = (estadoActual) => {
  const index = ordenEstados.indexOf(estadoActual);
  if (index > 0) {
    return ordenEstados[index - 1];
  }
  return estadoActual;
};
