import React, { useState } from 'react';
import { useTurnos } from '../logic/useTurnos';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRightLeft, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Asignacion = () => {
  const { funcionarios, asignaciones, agregarTurnos, intercambiar } = useTurnos();
  const [user, setUser] = useState(null);
  const [modo, setModo] = useState('NORMAL');
  const [seleccion, setSeleccion] = useState([]);
  const [mesActual, setMesActual] = useState(new Date());

  const dias = eachDayOfInterval({ start: startOfMonth(mesActual), end: endOfMonth(mesActual) });

  const clicDia = (fStr) => {
    const t = asignaciones.find(a => a.fecha === fStr);
    if (modo === 'CANJE') {
      if (!t) return;
      const n = [...seleccion, fStr];
      setSeleccion(n);
      if (n.length === 2) { intercambiar(n[0], n[1]); setSeleccion([]); setModo('NORMAL'); }
    } else {
      if (t && t.id !== user?.id) return; // No tocar turnos ajenos
      setSeleccion(prev => prev.includes(fStr) ? prev.filter(s => s !== fStr) : [...prev, fStr]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-32">
      {/* Cabecera con selector de mes */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-3xl shadow-sm">
        <button onClick={() => setMesActual(subMonths(mesActual, 1))}><ChevronLeft /></button>
        <h2 className="font-black capitalize">{format(mesActual, 'MMMM yyyy', { locale: es })}</h2>
        <button onClick={() => setMesActual(addMonths(mesActual, 1))}><ChevronRight /></button>
      </div>

      {/* Staff */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {funcionarios.map(f => (
          <button key={f[0]} onClick={() => {setUser({id: f[0], nombre: f[1], color: f[2]}); setSeleccion([]);}}
            className={`px-4 py-2 rounded-2xl font-bold border-2 transition-all ${user?.id === f[0] ? 'text-white shadow-md' : 'bg-white text-gray-400 border-transparent'}`}
            style={{ backgroundColor: user?.id === f[0] ? f[2] : '', borderColor: user?.id === f[0] ? 'transparent' : f[2] }}>
            {f[1]}
          </button>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-4 gap-3">
        {dias.map(dia => {
          const fStr = format(dia, 'yyyy-MM-dd');
          const t = asignaciones.find(a => a.fecha === fStr);
          const sel = seleccion.includes(fStr);
          const fInfo = t ? funcionarios.find(f => f[0] === t.id) : null;

          return (
            <button key={fStr} onClick={() => clicDia(fStr)}
              style={{ backgroundColor: fInfo ? fInfo[2] : (sel ? '#3b82f6' : '#fff') }}
              className={`h-24 rounded-3xl flex flex-col items-center justify-center shadow-sm transition-all ${fInfo || sel ? 'text-white' : 'text-gray-300'}`}>
              <span className="text-[10px] uppercase font-bold">{format(dia, 'eee', {locale: es})}</span>
              <span className="text-2xl font-black">{format(dia, 'd')}</span>
              {t && <span className="text-[8px] font-bold bg-black/20 px-1 rounded mt-1 truncate w-10/12">{t.nombre}</span>}
            </button>
          );
        })}
      </div>

      {/* Acciones */}
      <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto flex gap-3">
        <button onClick={() => {setModo(modo === 'NORMAL' ? 'CANJE' : 'NORMAL'); setSeleccion([]);}} 
          className={`flex-1 h-14 rounded-2xl font-bold shadow-lg ${modo === 'CANJE' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}>
          {modo === 'CANJE' ? 'CANCELAR CANJE' : 'MODO CANJE'}
        </button>
        {seleccion.length > 0 && modo === 'NORMAL' && (
          <button onClick={() => {agregarTurnos(user.id, user.nombre, seleccion); setSeleccion([]);}} 
            className="flex-1 bg-green-500 text-white h-14 rounded-2xl font-bold shadow-lg">GUARDAR</button>
        )}
      </div>
    </div>
  );
};

export default Asignacion;