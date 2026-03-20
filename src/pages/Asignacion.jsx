import React, { useState } from 'react';
import { useTurnos } from '../logic/useTurnos';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRightLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

const Asignacion = () => {
  // Importamos 'quitarTurno' para asegurar el refresco visual
  const { funcionarios, asignaciones, agregarTurnos, intercambiar, quitarTurno } = useTurnos();
  const [user, setUser] = useState(null);
  const [modo, setModo] = useState('NORMAL');
  const [seleccion, setSeleccion] = useState([]);
  const [mesActual, setMesActual] = useState(new Date());

  const dias = eachDayOfInterval({ start: startOfMonth(mesActual), end: endOfMonth(mesActual) });

  const clicDia = (fStr) => {
    const t = asignaciones.find(a => a.fecha === fStr);

    // MODO CANJE
    if (modo === 'CANJE') {
      if (!t || seleccion.includes(fStr)) return;
      const n = [...seleccion, fStr];
      setSeleccion(n);
      if (n.length === 2) {
        intercambiar(n[0], n[1]);
        setSeleccion([]);
        setModo('NORMAL');
      }
      return;
    }

    // MODO NORMAL - Quitar selección azul
    if (seleccion.includes(fStr)) {
      setSeleccion(prev => prev.filter(s => s !== fStr));
      return;
    }

    // RESOLUCIÓN: LIBERAR DÍA OCUPADO
    // Solo funciona si NO hay funcionario seleccionado y NO hay selección azul
    if (t && !user && seleccion.length === 0) {
      const fechaTxt = format(new Date(fStr + "T00:00:00"), 'dd/MM');
      
      Swal.fire({
        title: '¿Liberar día?',
        text: `¿Quitar el ${fechaTxt} asignado a ${t.nombre}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          quitarTurno(fStr); // Llama a la lógica que refresca el estado
        }
      });
      return;
    }

    // ASIGNAR DÍAS
    if (user) {
      if (t && t.id !== user.id) {
        Swal.fire({ icon: 'error', title: 'Ocupado', text: 'Libera este día primero.' });
        return;
      }
      setSeleccion(prev => [...prev, fStr]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-44">
      {/* Selector de Mes */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <button onClick={() => setMesActual(subMonths(mesActual, 1))}><ChevronLeft /></button>
        <h2 className="font-black capitalize">{format(mesActual, 'MMMM yyyy', { locale: es })}</h2>
        <button onClick={() => setMesActual(addMonths(mesActual, 1))}><ChevronRight /></button>
      </div>

      {/* Lista de Funcionarios con Deselección */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2 no-scrollbar">
        {funcionarios.map(f => (
          <button 
            key={f[0]} 
            onClick={() => {
              if (user?.id === f[0]) setUser(null); // Deselecciona si ya estaba marcado
              else setUser({id: f[0], nombre: f[1], color: f[2]});
              setSeleccion([]);
            }}
            className={`px-5 py-3 rounded-2xl font-bold border-2 transition-all ${user?.id === f[0] ? 'text-white shadow-lg' : 'bg-white text-gray-400 border-gray-200'}`}
            style={{ backgroundColor: user?.id === f[0] ? f[2] : '', borderColor: user?.id === f[0] ? 'transparent' : '' }}
          >
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
          const colorF = t ? funcionarios.find(f => f[0] === t.id)?.[2] : null;

          return (
            <button 
              key={fStr} 
              onClick={() => clicDia(fStr)}
              style={{ backgroundColor: colorF || (sel ? '#3b82f6' : '#fff') }}
              className={`h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-sm border border-gray-100 transition-all ${colorF || sel ? 'text-white border-transparent' : 'text-gray-300'}`}
            >
              <span className="text-[10px] uppercase font-black opacity-60">{format(dia, 'eee', {locale: es})}</span>
              <span className="text-2xl font-black">{format(dia, 'd')}</span>
              {t && <span className="text-[9px] font-bold bg-black/10 px-2 py-0.5 rounded-full mt-1 truncate w-10/12 text-center">{t.nombre}</span>}
            </button>
          );
        })}
      </div>

      {/* Botones Flotantes */}
      <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto flex flex-col gap-3">
        <button onClick={() => {setModo(modo === 'NORMAL' ? 'CANJE' : 'NORMAL'); setSeleccion([]);}} 
          className={`w-full h-16 rounded-3xl font-black shadow-xl flex items-center justify-center gap-3 transition-all ${modo === 'CANJE' ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}>
          <ArrowRightLeft size={24}/>
          <span className="text-xl uppercase">Cambiar Días</span>
        </button>
        {seleccion.length > 0 && modo === 'NORMAL' && (
          <button onClick={() => {agregarTurnos(user.id, user.nombre, seleccion); setSeleccion([]);}} 
            className="w-full bg-emerald-500 text-white h-16 rounded-3xl font-black shadow-xl flex items-center justify-center gap-2">
            <Check size={24}/> GUARDAR
          </button>
        )}
      </div>
    </div>
  );
};

export default Asignacion;