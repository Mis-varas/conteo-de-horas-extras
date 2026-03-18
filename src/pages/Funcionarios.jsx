import React, { useState } from 'react';
import { useTurnos } from '../logic/useTurnos';
import { UserPlus, Circle } from 'lucide-react';

const Funcionarios = () => {
  const { funcionarios, guardarFuncionario } = useTurnos();
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleAdd = () => {
    if (!nombre) return;
    guardarFuncionario([Date.now().toString(), nombre, color]);
    setNombre('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black mb-6 italic text-gray-800">Staff</h1>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm mb-8">
        <input className="w-full p-4 bg-gray-100 rounded-2xl mb-4 font-bold focus:ring-2 ring-blue-500 outline-none" placeholder="Nombre del funcionario..." value={nombre} onChange={e => setNombre(e.target.value)} />
        <div className="flex justify-between items-center mb-6">
          <span className="font-bold text-gray-500">Color de marca:</span>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 rounded-full overflow-hidden border-none cursor-pointer" />
        </div>
        <button onClick={handleAdd} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2"><UserPlus size={20}/> AÑADIR AL EQUIPO</button>
      </div>

      <div className="grid gap-3">
        {funcionarios.map(f => (
          <div key={f[0]} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <Circle fill={f[2]} stroke="none" size={24} />
            <span className="font-bold text-gray-700">{f[1]}</span>
            <span className="ml-auto text-[10px] font-mono text-gray-300 uppercase">ID: {f[0].slice(-5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funcionarios;