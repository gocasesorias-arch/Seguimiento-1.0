import { useState } from 'react';
import { Circle, CheckCircle, ChevronLeft, ChevronRight } from './Icons';
import { ESTADOS, ordenEstados } from '../utils/constants';
import { obtenerColorPorEstado, obtenerHitosPorEstado } from '../utils/helpers';

const Dashboard = ({ cursosFiltrados, hitoActual, setHitoActual }) => {
  const hitos = [
    {
      id: 1,
      nombre: "Planificación",
      estado: ESTADOS.PLANIFICACION,
      descripcion: "Definición inicial y planificación del curso",
      color: "bg-gray-100 border-gray-400 text-gray-700",
      subHitos: obtenerHitosPorEstado(ESTADOS.PLANIFICACION)
    },
    {
      id: 2,
      nombre: "En Proceso",
      estado: ESTADOS.EN_PROCESO,
      descripcion: "Preparación de logística y fechas",
      color: "bg-indigo-100 border-indigo-400 text-indigo-700",
      subHitos: obtenerHitosPorEstado(ESTADOS.EN_PROCESO)
    },
    {
      id: 3,
      nombre: "En Ejecución",
      estado: ESTADOS.EN_EJECUCION,
      descripcion: "Capacitación en curso",
      color: "bg-blue-100 border-blue-400 text-blue-700",
      subHitos: obtenerHitosPorEstado(ESTADOS.EN_EJECUCION)
    },
    {
      id: 4,
      nombre: "Realizado",
      estado: ESTADOS.REALIZADO,
      descripcion: "Capacitación completada",
      color: "bg-green-100 border-green-400 text-green-700",
      subHitos: obtenerHitosPorEstado(ESTADOS.REALIZADO)
    }
  ];

  const hitoActualData = hitos[hitoActual];
  const cursosFiltradosHito = cursosFiltrados.filter(c => c.Column4 === hitoActualData.estado);

  const avanzarHito = () => {
    if (hitoActual < hitos.length - 1) setHitoActual(hitoActual + 1);
  };

  const retrocederHito = () => {
    if (hitoActual > 0) setHitoActual(hitoActual - 1);
  };

  const irAHito = (index) => {
    setHitoActual(index);
  };

  return (
    <>
      {/* Barra de navegación de hitos */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={retrocederHito}
            disabled={hitoActual === 0}
            className={`p-2 rounded-lg transition-all ${
              hitoActual === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ChevronLeft size={32} />
          </button>

          <div className="flex-1 flex items-center justify-between gap-2">
            {hitos.map((hito, index) => {
              const Icon = index <= hitoActual ? CheckCircle : Circle;
              const isActive = index === hitoActual;
              return (
                <div key={hito.id} className="flex items-center flex-1">
                  <button
                    onClick={() => irAHito(index)}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      isActive
                        ? `${hito.color} border-4`
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={24} className={isActive ? '' : 'text-slate-400'} />
                      <div className="text-left">
                        <div className={`font-bold ${isActive ? '' : 'text-slate-600'}`}>
                          {hito.nombre}
                        </div>
                        <div className={`text-xs ${isActive ? '' : 'text-slate-500'}`}>
                          {cursosFiltrados.filter(c => c.Column4 === hito.estado).length} cursos
                        </div>
                      </div>
                    </div>
                  </button>
                  {index < hitos.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${
                      index < hitoActual ? 'bg-green-500' : 'bg-slate-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={avanzarHito}
            disabled={hitoActual === hitos.length - 1}
            className={`p-2 rounded-lg transition-all ${
              hitoActual === hitos.length - 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* Detalle del hito actual */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {hitoActualData.nombre}
            </h2>
            <p className="text-slate-600">{hitoActualData.descripcion}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold ${hitoActualData.color}`}>
            {cursosFiltradosHito.length} cursos
          </span>
        </div>

        {/* Sub-hitos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {hitoActualData.subHitos.map((subHito, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
              <CheckCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-700">{subHito}</span>
            </div>
          ))}
        </div>

        {/* Lista de cursos */}
        <div className="space-y-2">
          {cursosFiltradosHito.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Circle size={48} className="mx-auto mb-2 opacity-50" />
              <p>No hay cursos en este estado con los filtros seleccionados</p>
            </div>
          ) : (
            cursosFiltradosHito.map((curso, index) => (
              <div key={index} className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-300 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{curso.Column13 || 'Sin nombre'}</h3>
                    <p className="text-sm text-slate-600 mt-1">{curso.Column14 || 'Sin descripción'}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {curso.Column9 || 'Sin VP'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {curso.Column10 || 'Sin gerencia'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {curso.Column15 || 0} horas
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        Responsable: {curso.Column7 || 'No asignado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Barra de progreso general */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">Progreso General del Estado</span>
            <span className="text-sm font-bold text-blue-600">
              {cursosFiltradosHito.length > 0
                ? Math.round((cursosFiltradosHito.filter(c => c.Column4 === ESTADOS.REALIZADO).length / cursosFiltradosHito.length) * 100)
                : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-4 transition-all duration-500"
              style={{
                width: `${cursosFiltradosHito.length > 0
                  ? (cursosFiltradosHito.filter(c => c.Column4 === ESTADOS.REALIZADO).length / cursosFiltradosHito.length) * 100
                  : 0}%`
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
