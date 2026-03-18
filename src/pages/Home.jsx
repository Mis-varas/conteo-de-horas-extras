import React from 'react';
import { useTurnos } from '../logic/useTurnos';
import { format, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { LayoutDashboard, Users, CalendarDays, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { funcionarios, asignaciones } = useTurnos();

  const hoy = new Date();
  const mañana = addDays(hoy, 1);

  const turnoHoy = asignaciones.find(a => isSameDay(new Date(a.fecha + "T00:00:00"), hoy));
  const turnoMañana = asignaciones.find(a => isSameDay(new Date(a.fecha + "T00:00:00"), mañana));

  // Obtener color del funcionario
  const getColor = (id) => funcionarios.find(f => f[0] === id)?.[2] || '#cbd5e1';

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-28">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 italic flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" size={28} />
          Panel de Control
        </h1>
        <p className="text-gray-500 font-medium">
          {format(hoy, "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </header>

      {/* Estado Actual (Hoy y Mañana) */}
      <div className="grid gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Turno de Hoy</p>
            <p className="text-xl font-black text-gray-800">
              {turnoHoy ? turnoHoy.nombre : "Sin asignar"}
            </p>
          </div>
          {turnoHoy && (
            <div 
              className="ml-auto w-4 h-4 rounded-full" 
              style={{ backgroundColor: getColor(turnoHoy.id) }}
            />
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 opacity-80">
          <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Próximo (Mañana)</p>
            <p className="text-lg font-bold text-gray-700">
              {turnoMañana ? turnoMañana.nombre : "Pendiente"}
            </p>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos (Botones Lindos) */}
      <h2 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest">Accesos Rápidos</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/asignacion" className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg shadow-blue-200 flex flex-col gap-3 active:scale-95 transition-transform">
          <CalendarDays size={32} />
          <span className="font-bold text-lg leading-tight">Gestionar<br/>Calendario</span>
        </Link>

        <Link to="/funcionarios" className="bg-white p-6 rounded-[2rem] text-gray-800 shadow-sm border border-gray-100 flex flex-col gap-3 active:scale-95 transition-transform">
          <Users className="text-blue-600" size={32} />
          <span className="font-bold text-lg leading-tight">Lista de<br/>Personal</span>
        </Link>
      </div>

      {/* Resumen Estadístico Simple */}
      <div className="mt-8 bg-gray-800 p-6 rounded-[2.5rem] text-white">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Resumen Mensual</span>
          <span className="bg-gray-700 px-3 py-1 rounded-full text-xs">{format(hoy, 'MMMM', { locale: es })}</span>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black">{asignaciones.length}</span>
          <span className="text-gray-400 mb-1 font-bold">turnos registrados</span>
        </div>
      </div>
    </div>
  );
};

export default Home;