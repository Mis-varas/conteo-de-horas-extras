import React, { useState } from 'react';
import { useTurnos } from '../logic/useTurnos';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const Reportes = () => {
  const { funcionarios, asignaciones } = useTurnos();
  const [mesVer, setMesVer] = useState(format(new Date(), 'yyyy-MM'));

  // Generar lista de los últimos 6 meses para el registro
  const mesesRegistro = eachMonthOfInterval({
    start: subMonths(new Date(), 6),
    end: new Date()
  }).reverse();

  // Filtrar asignaciones SOLO del mes seleccionado
  const asignacionesMes = asignaciones.filter(a => a.mesReferencia === mesVer);

  const estadisticas = funcionarios.map(f => {
    const turnosF = asignacionesMes.filter(a => a.id === f[0]);
    const horas = turnosF.reduce((acc, curr) => acc + curr.horas, 0);
    return {
      nombre: f[1], color: f[2], horas,
      diasSemana: turnosF.filter(a => a.parte === "Entre Semana").length,
      diasFinde: turnosF.filter(a => a.parte === "Fin de Semana").length
    };
  });

  const granTotal = estadisticas.reduce((acc, curr) => acc + curr.horas, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-28">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 italic flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={28} /> Registro Histórico
        </h1>
      </header>

      {/* Selector de Mes */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {mesesRegistro.map(m => {
          const val = format(m, 'yyyy-MM');
          return (
            <button key={val} onClick={() => setMesVer(val)}
              className={`px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap ${mesVer === val ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400'}`}>
              {format(m, 'MMMM yyyy', { locale: es })}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
          <Clock className="text-blue-500 mb-2" size={20} />
          <p className="text-2xl font-black text-gray-800">{granTotal}</p>
          <p className="text-xs font-bold text-gray-400 uppercase">Horas en {mesVer}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {estadisticas.map(est => {
          const porcentaje = granTotal > 0 ? ((est.horas / granTotal) * 100).toFixed(1) : 0;
          return (
            <div key={est.nombre} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-black text-gray-800 capitalize">{est.nombre}</h3>
                <span className="text-xs font-black px-3 py-1 rounded-full text-white" style={{backgroundColor: est.color}}>{porcentaje}%</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
                <span>Semana: {est.diasSemana}</span>
                <span>Finde: {est.diasFinde}</span>
                <span className="text-gray-800">{est.horas}h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reportes;