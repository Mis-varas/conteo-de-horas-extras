import React, { useState } from 'react';
import { useTurnos } from '../logic/useTurnos';
import { UserPlus, Trash2, Edit2, Check, X } from 'lucide-react';

const Funcionarios = () => {
  const { funcionarios, setFuncionarios, eliminarFuncionario, editarFuncionario } = useTurnos();
  const [nombre, setNombre] = useState('');
  const [editando, setEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const randomColor = () => {
    const colors = [
      '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
      '#06b6d4', '#84cc16', '#f97316', '#a855f7', '#14b8a6', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    const lista = [...funcionarios, [Date.now().toString(), nombre, randomColor()]];
    setFuncionarios(lista);
    localStorage.setItem('funcionarios', JSON.stringify(lista));
    setNombre('');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-32">
      <h1 className="text-2xl font-black mb-6 italic">Staff</h1>
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-3xl shadow-sm mb-8 flex gap-2">
        <input className="flex-1 p-3 bg-gray-50 rounded-2xl font-bold outline-none" placeholder="Nuevo..." value={nombre} onChange={e => setNombre(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white p-3 rounded-2xl"><UserPlus /></button>
      </form>
      <div className="grid gap-3">
        {funcionarios.map(f => (
          <div key={f[0]} className="bg-white p-4 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black" style={{ backgroundColor: f[2] }}>{f[1][0].toUpperCase()}</div>
            <div className="flex-1">
              {editando === f[0] ? <input className="bg-gray-100 p-1 font-bold w-full" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} /> : <p className="font-black text-gray-700 capitalize">{f[1]}</p>}
            </div>
            <div className="flex gap-1">
              {editando === f[0] ? (
                <> <button onClick={() => { editarFuncionario(f[0], nuevoNombre); setEditando(null); }}><Check className="text-green-500"/></button> <button onClick={() => setEditando(null)}><X className="text-gray-400"/></button> </>
              ) : (
                <> <button onClick={() => { setEditando(f[0]); setNuevoNombre(f[1]); }}><Edit2 className="text-gray-300" size={18}/></button> <button onClick={() => eliminarFuncionario(f[0])}><Trash2 className="text-gray-300" size={18}/></button> </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funcionarios;